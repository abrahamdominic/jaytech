import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"
import { requireAuth } from "@/lib/auth"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

interface AllowedType {
  mime: string
  signatures: Buffer[]
  requireSecond?: string
}

// Signature-based detection so a renamed/forged file cannot be uploaded.
const SIGNATURES: AllowedType[] = [
  { mime: "image/jpeg", signatures: [Buffer.from([0xff, 0xd8, 0xff])] },
  { mime: "image/png", signatures: [Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])] },
  { mime: "image/webp", signatures: [Buffer.from("RIFF")], requireSecond: "WEBP" },
  { mime: "image/gif", signatures: [Buffer.from("GIF87a"), Buffer.from("GIF89a")] },
  { mime: "video/mp4", signatures: [Buffer.from([0x00, 0x00, 0x00]), Buffer.from("ftyp")] },
  { mime: "video/quicktime", signatures: [Buffer.from([0x00, 0x00, 0x00]), Buffer.from("ftypqt")] },
  { mime: "application/pdf", signatures: [Buffer.from("%PDF")] },
]

const BUCKET_NAME = "uploads"

function detectMime(buffer: Buffer): string | null {
  for (const type of SIGNATURES) {
    // Special-case: move/mp4 have a variable-size box header before "ftyp".
    if (type.mime === "video/mp4" || type.mime === "video/quicktime") {
      const ftyp = buffer.indexOf(Buffer.from("ftyp"))
      if (ftyp >= 4 && ftyp <= 64) {
        if (type.mime === "video/quicktime") {
          const brand = buffer.subarray(ftyp + 4, ftyp + 8).toString("latin1")
          if (brand === "qt  ") return type.mime
        } else {
          // mp4 has a variety of brands (isom, mp42, avc1, ...)
          return "video/mp4"
        }
      }
      continue
    }
    // WEBP: RIFF + 4 byte size + WEBP
    if (type.requireSecond === "WEBP") {
      const riff = buffer.subarray(0, 4).toString("latin1")
      const webp = buffer.subarray(8, 12).toString("latin1")
      if (riff === "RIFF" && webp === "WEBP") return type.mime
      continue
    }
    for (const sig of type.signatures) {
      if (sig.length > 0 && buffer.subarray(0, sig.length).equals(sig)) {
        return type.mime
      }
    }
  }
  return null
}

function getFilePath(originalName: string): string {
  const now = new Date()
  const datePath = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, "0")}`
  const timestamp = Date.now()
  const sanitized = originalName.replace(/[^a-zA-Z0-9._-]/g, "_")
  return `${datePath}/${timestamp}-${sanitized}`
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAuth()
    if (auth.error) return auth.error

    const supabaseAdmin = getSupabaseAdmin()
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 10MB limit." },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const detectedMime = detectMime(buffer)
    if (!detectedMime) {
      return NextResponse.json(
        { error: "File type not supported or file content could not be validated." },
        { status: 400 }
      )
    }

    // The stored content-type should be the detected MIME, not the client-declared one.
    const fileType = detectedMime
    const filePath = getFilePath(file.name)

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: fileType,
        upsert: false,
      })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return NextResponse.json(
        { error: "Failed to upload file. Please try again." },
        { status: 500 }
      )
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return NextResponse.json(
      {
        url: urlData.publicUrl,
        file_name: file.name,
        file_type: fileType,
        file_size: file.size,
      },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred."
    const status = message.includes("not configured") ? 503 : 500
    console.error("Upload API error:", error)
    return NextResponse.json({ error: message }, { status })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase/admin"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/quicktime",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

const BUCKET_NAME = "uploads"

function getFilePath(originalName: string): string {
  const now = new Date()
  const datePath = `${now.getFullYear()}/${(now.getMonth() + 1).toString().padStart(2, "0")}`
  const timestamp = Date.now()
  const sanitized = originalName.replace(/[^a-zA-Z0-9._-]/g, "_")
  return `${datePath}/${timestamp}-${sanitized}`
}

export async function POST(request: NextRequest) {
  try {
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

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type not supported." },
        { status: 400 }
      )
    }

    const filePath = getFilePath(file.name)

    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: file.type,
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
        file_type: file.type,
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

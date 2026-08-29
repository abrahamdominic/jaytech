import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { Profile } from "@/types/database"

type UserRole = Profile["role"]

async function getServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  const cookieStore = await cookies()
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll() {},
    },
  })
}

export interface AuthContext {
  user: { id: string; email: string | undefined }
  profile: Profile
}

export type AuthResult =
  | { context: AuthContext; user: AuthContext["user"]; profile: Profile; error: null }
  | { error: NextResponse }

function unauthorized(message = "Unauthorized"): NextResponse {
  return NextResponse.json({ error: message }, { status: 401 })
}

function forbidden(message = "Forbidden"): NextResponse {
  return NextResponse.json({ error: message }, { status: 403 })
}

async function loadUser(
  requiredRoles?: UserRole[]
): Promise<AuthResult> {
  const supabase = await getServerSupabase()
  if (!supabase) {
    return { error: NextResponse.json({ error: "Service unavailable" }, { status: 503 }) }
  }

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: unauthorized() }
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError || !profile) {
    return { error: unauthorized() }
  }

  const context: AuthContext = {
    user: { id: user.id, email: user.email ?? undefined },
    profile,
  }

  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(profile.role)) {
      return { error: forbidden() }
    }
  }

  return { context, user: context.user, profile, error: null }
}

export async function requireAuth(): Promise<AuthResult> {
  return loadUser()
}

export async function requireRole(roles: UserRole[]): Promise<AuthResult> {
  return loadUser(roles)
}

export const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"]

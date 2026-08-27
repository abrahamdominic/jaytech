import LoginClient from "./LoginClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Login - J Tech Solar, Starlink & CCTV Hub",
  description: "Sign in to your J Tech Solar, Starlink & CCTV Hub account to manage your bookings and services.",
}

export default function LoginPage() {
  return <LoginClient />
}

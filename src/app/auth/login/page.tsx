import LoginClient from "./LoginClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Login - JayTech",
  description: "Sign in to your JayTech account to manage your bookings and services.",
}

export default function LoginPage() {
  return <LoginClient />
}

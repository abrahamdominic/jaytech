import RegisterClient from "./RegisterClient"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Create Account - JayTech",
  description: "Create a JayTech account to book services and track your bookings.",
}

export default function RegisterPage() {
  return <RegisterClient />
}

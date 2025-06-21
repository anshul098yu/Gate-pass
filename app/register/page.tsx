import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import RegisterPageClient from "./register-page-client"

export default async function RegisterPage() {
  const user = await getCurrentUser()

  if (user) {
    if (user.role === "user") {
      redirect("/dashboard")
    } else if (user.role === "security") {
      redirect("/security")
    } else if (user.role === "department_admin") {
      redirect("/department")
    }
  }

  return <RegisterPageClient />
}

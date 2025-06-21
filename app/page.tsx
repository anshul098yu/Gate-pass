import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default async function HomePage() {
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

  redirect("/login")
}

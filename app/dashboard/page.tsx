import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getApplicationsByUser } from "@/lib/database"
import UserDashboard from "./user-dashboard"

// Add this to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "user") {
    redirect("/login")
  }

  // Get fresh applications data
  const applications = await getApplicationsByUser(user.id)
  console.log("Applications for user:", user.id, applications)

  return <UserDashboard user={user} applications={applications} />
}

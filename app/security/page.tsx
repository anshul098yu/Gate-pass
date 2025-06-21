import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getApplications } from "@/lib/database"
import SecurityDashboard from "./security-dashboard"

// Add this to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function SecurityPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "security") {
    redirect("/login")
  }

  const applications = await getApplications()
  console.log("Security - All applications:", applications)

  return <SecurityDashboard user={user} applications={applications} />
}

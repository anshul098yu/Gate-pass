import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getApplications } from "@/lib/database"
import DepartmentDashboard from "./department-dashboard"

// Add this to prevent caching
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function DepartmentPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "department_admin" || !user.department) {
    redirect("/login")
  }

  console.log("🏢 Department page loading for:", user.name, "Department:", user.department)

  // Fetch all applications, regardless of status or department
  const allApplications = await getApplications()
  console.log("📊 All applications in system:", allApplications)

  return <DepartmentDashboard user={user} applications={allApplications} />
}

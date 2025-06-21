"use server"

import { redirect } from "next/navigation"
import { updateApplication, getApplicationById, getApplications, getApplicationsByDepartment, getApplicationsByStatus } from "@/lib/database"
import { clearUserSession } from "@/lib/auth"

export async function forwardApplicationAction(formData: FormData) {
  try {
    const applicationId = formData.get("applicationId") as string
    const comments = formData.get("comments") as string

    console.log("🚀 Starting forwardApplicationAction")
    console.log("📝 Application ID:", applicationId)
    console.log("💬 Comments:", comments)

    // Check if application exists before updating
    const existingApp = await getApplicationById(applicationId)
    console.log("🔍 Found existing application:", existingApp)

    if (!existingApp) {
      console.log("❌ Application not found!")
      throw new Error(`Application with ID ${applicationId} not found`)
    }

    console.log("🔄 Updating application status to 'forwarded'...")
    const result = await updateApplication(applicationId, {
      status: "forwarded",
      securityComments: comments,
    })

    if (!result) {
      console.log("❌ Failed to update application")
      throw new Error("Failed to update application")
    }

    console.log("✅ Application forwarded successfully:", result)

    // Verify the update worked
    const updatedApp = await getApplicationById(applicationId)
    console.log("🔍 Verification - Updated application:", updatedApp)

    // Show all applications after update
    const applications = await getApplications()
    console.log("📊 All applications after forward:", applications)

    const safeApplications = Array.isArray(applications) ? applications : [];
    const forwardedApplications = safeApplications.filter(app => app.status === "forwarded");

    return { success: true, application: result }
  } catch (error) {
    console.error("💥 Error in forwardApplicationAction:", error)
    throw error
  }
}

export async function logoutAction() {
  await clearUserSession()
  redirect("/login")
}

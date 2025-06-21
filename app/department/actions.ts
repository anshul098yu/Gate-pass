"use server"

import { redirect } from "next/navigation"
import { updateApplication, generateQRCode, getApplicationById } from "@/lib/database"
import { clearUserSession } from "@/lib/auth"

export async function approveApplicationAction(formData: FormData) {
  try {
    const applicationId = formData.get("applicationId") as string
    const comments = formData.get("comments") as string
    const approvedBy = formData.get("approvedBy") as string

    console.log("✅ Starting approval process for application:", applicationId)
    console.log("💬 Comments:", comments)
    console.log("👤 Approved by:", approvedBy)

    // Get the application first
    const application = await getApplicationById(applicationId)
    if (!application) {
      console.log("❌ Application not found:", applicationId)
      throw new Error(`Application with ID ${applicationId} not found`)
    }

    console.log("📋 Found application:", application)

    // Generate QR code
    console.log("🔄 Generating QR code...")
    const qrCode = generateQRCode(application)
    console.log("✅ QR code generated:", qrCode.slice(0, 50) + "...")

    // Update application with approval
    console.log("🔄 Updating application status to approved...")
    const updatedApplication = await updateApplication(applicationId, {
      status: "approved",
      departmentComments: comments,
      approvedBy,
      qrCode,
    })

    if (!updatedApplication) {
      console.log("❌ Failed to update application")
      throw new Error("Failed to update application")
    }

    console.log("✅ Application approved successfully:", updatedApplication)
    return { success: true, application: updatedApplication }
  } catch (error) {
    console.error("💥 Error in approveApplicationAction:", error)
    throw error
  }
}

export async function rejectApplicationAction(formData: FormData) {
  try {
    const applicationId = formData.get("applicationId") as string
    const comments = formData.get("comments") as string
    const approvedBy = formData.get("approvedBy") as string

    console.log("❌ Starting rejection process for application:", applicationId)
    console.log("💬 Comments:", comments)
    console.log("👤 Rejected by:", approvedBy)

    // Check if application exists
    const application = await getApplicationById(applicationId)
    if (!application) {
      console.log("❌ Application not found:", applicationId)
      throw new Error(`Application with ID ${applicationId} not found`)
    }

    console.log("📋 Found application:", application)

    // Update application with rejection
    console.log("🔄 Updating application status to rejected...")
    const updatedApplication = await updateApplication(applicationId, {
      status: "rejected",
      departmentComments: comments,
      approvedBy,
    })

    if (!updatedApplication) {
      console.log("❌ Failed to update application")
      throw new Error("Failed to update application")
    }

    console.log("✅ Application rejected successfully:", updatedApplication)
    return { success: true, application: updatedApplication }
  } catch (error) {
    console.error("💥 Error in rejectApplicationAction:", error)
    throw error
  }
}

export async function logoutAction() {
  await clearUserSession()
  redirect("/login")
}

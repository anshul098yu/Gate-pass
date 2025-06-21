"use server"

import { redirect } from "next/navigation"
import { createApplication } from "@/lib/database"
import { clearUserSession } from "@/lib/auth"

export async function createApplicationAction(formData: FormData) {
  try {
    const applicationData = {
      userId: formData.get("userId") as string,
      userName: formData.get("userName") as string,
      userEmail: formData.get("userEmail") as string,
      userPhone: formData.get("userPhone") as string,
      purpose: formData.get("purpose") as string,
      department: formData.get("department") as string,
      visitDate: formData.get("visitDate") as string,
      visitTime: formData.get("visitTime") as string,
      duration: formData.get("duration") as string,
      vehicleNumber: (formData.get("vehicleNumber") as string) || undefined,
      status: "pending" as const,
    }

    // Validate required fields
    if (!applicationData.userId || !applicationData.purpose || !applicationData.department) {
      throw new Error("Missing required fields")
    }

    const newApplication = await createApplication(applicationData)
    console.log("Application created:", newApplication)

    return { success: true, application: newApplication }
  } catch (error) {
    console.error("Error creating application:", error)
    return { success: false, error: (error as Error).message }
  }
}

export async function logoutAction() {
  await clearUserSession()
  redirect("/login")
}

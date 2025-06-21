"use server"

import { createUser } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function registerAction(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const role = formData.get("role") as "user" | "security" | "department_admin"
    const department = formData.get("department") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    // Validation
    if (!name || !email || !phone || !role || !password || !confirmPassword) {
      return { success: false, error: "All fields are required" }
    }

    if (password !== confirmPassword) {
      return { success: false, error: "Passwords do not match" }
    }

    if (password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long" }
    }

    if (role === "department_admin" && !department) {
      return { success: false, error: "Department is required for department admin role" }
    }

    // Check if email already exists
    const existingUser = await checkUserExists(email)
    if (existingUser) {
      return { success: false, error: "Email already exists" }
    }

    // Create user
    const newUser = await createUser({
      name,
      email,
      phone,
      role,
      department: role === "department_admin" ? department : undefined,
      password,
    })

    if (newUser) {
      return { success: true, user: newUser }
    } else {
      return { success: false, error: "Failed to create user" }
    }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "Registration failed. Please try again." }
  }
}

async function checkUserExists(email: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { email },
  })
  return !!user
}

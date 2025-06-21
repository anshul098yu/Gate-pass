"use server"

import { authenticate, setUserSession } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { success: false, error: "Email and password are required" }
  }

  const user = await authenticate(email, password)

  if (user) {
    await setUserSession(user)
    return { success: true, role: user.role }
  } else {
    return { success: false, error: "Invalid credentials" }
  }
}

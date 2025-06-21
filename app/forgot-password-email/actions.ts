"use server"

export async function sendOTPAction(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get("email") as string

  if (!email) {
    return {
      success: false,
      error: "Email is required",
    }
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: "Please enter a valid email address",
    }
  }

  // Generate a 6-digit OTP for demo
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  return {
    success: true,
    message: "OTP sent successfully to your email",
    otp: otp, // Only for demo purposes
  }
}

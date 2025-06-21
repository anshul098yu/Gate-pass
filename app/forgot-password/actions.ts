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

  try {
    // Generate a 6-digit OTP for demo
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Log the OTP to console for demo purposes
    console.log("==================================================")
    console.log("📧 MOCK EMAIL SENT")
    console.log("==================================================")
    console.log("To:", email)
    console.log("Subject: Your Password Reset OTP - SAIL")
    console.log("OTP:", otp)
    console.log("==================================================")
    console.log("💡 This is a demo mode. Check console for OTP.")
    console.log("==================================================")

    return {
      success: true,
      message: "OTP sent successfully to your email",
      otp: otp, // Only for demo purposes
    }
  } catch (error) {
    console.error("Error sending OTP:", error)
    return {
      success: false,
      error: "Failed to send OTP. Please try again later.",
    }
  }
}

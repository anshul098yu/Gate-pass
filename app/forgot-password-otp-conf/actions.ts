"use server"

export async function resetPasswordAction(formData: FormData) {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get("email") as string
  const otp = formData.get("otp") as string
  const newPassword = formData.get("newPassword") as string
  const storedOTP = formData.get("storedOTP") as string

  if (!email || !otp || !newPassword) {
    return {
      success: false,
      error: "All fields are required",
    }
  }

  // OTP validation (in demo, check against stored OTP or any 6-digit number)
  if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
    return {
      success: false,
      error: "Please enter a valid 6-digit OTP",
    }
  }

  // In demo mode, accept any 6-digit OTP or the stored one
  if (storedOTP && otp !== storedOTP) {
    return {
      success: false,
      error: "Invalid OTP. Please check the console for the correct OTP.",
    }
  }

  // Password validation
  if (newPassword.length < 8) {
    return {
      success: false,
      error: "Password must be at least 8 characters long",
    }
  }

  return {
    success: true,
    message: "Password reset successfully",
  }
}

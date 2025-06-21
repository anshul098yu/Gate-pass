"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"
import { resetPasswordAction } from "./actions"

export default function ForgotPasswordOTPClient() {
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [storedOTP, setStoredOTP] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Get email and OTP from sessionStorage
    const resetEmail = sessionStorage.getItem("resetEmail")
    const resetOTP = sessionStorage.getItem("resetOTP")

    if (!resetEmail) {
      router.push("/forgot-password-email")
      return
    }

    setEmail(resetEmail)
    setStoredOTP(resetOTP || "")
  }, [router])

  async function handleResetPassword(formData: FormData) {
    setLoading(true)
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    const result = await resetPasswordAction(formData)

    if (result.success) {
      // Clear session storage
      sessionStorage.removeItem("resetEmail")
      sessionStorage.removeItem("resetOTP")

      // Redirect to login with success message
      router.push("/login?message=Password reset successful")
    } else {
      setError(result.error || "Failed to reset password")
    }

    setLoading(false)
  }

  async function handleResendOTP() {
    // In a real app, this would call the resend OTP API
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString()
    setStoredOTP(newOTP)
    sessionStorage.setItem("resetOTP", newOTP)
    console.log("New Demo OTP Code:", newOTP)

    // Show success message (you could add a toast here)
    alert("New OTP sent! Check console for demo OTP.")
  }

  if (!email) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SAIL Header */}
      <header className="bg-[#1e40af] text-white">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
                <div className="text-[#1e40af] font-bold text-lg">S</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">
                  This is the official website of Steel Authority of India Limited (SAIL),
                </div>
                <div>a Public Sector Undertaking under the Ministry of Steel, Government of India</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="#" className="text-sm hover:underline">
                Skip to main content
              </Link>
              <div className="flex space-x-2">
                <button className="text-sm hover:underline">English</button>
                <span>|</span>
                <button className="text-sm hover:underline">हिंदी</button>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#1e3a8a] px-4 py-2">
          <div className="container mx-auto">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-white rounded-full mr-3 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#1e40af]" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none text-white placeholder-blue-200 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wider">STEEL AUTHORITY OF INDIA LIMITED</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Form Section */}
            <div className="max-w-md mx-auto md:mx-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Set a password</h2>
              <p className="text-gray-600 mb-8">
                Enter the OTP sent to <span className="text-blue-600 font-medium">{email}</span> and set your new
                password.
              </p>

              <form action={handleResetPassword} className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                      Enter OTP
                    </label>
                    <button type="button" onClick={handleResendOTP} className="text-sm text-blue-600 hover:underline">
                      Resend OTP
                    </button>
                  </div>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Check browser console for OTP in demo mode</p>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Create Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      name="newPassword"
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Re-enter Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="storedOTP" value={storedOTP} />

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !otp || !newPassword || !confirmPassword}
                  className="w-full bg-[#6366f1] hover:bg-[#5b21b6] text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  {loading ? "Setting Password..." : "Set password"}
                </Button>
              </form>

              <div className="text-center mt-6">
                <Link href="/forgot-password-email" className="text-[#6366f1] hover:underline text-sm">
                  Back to email entry
                </Link>
              </div>
            </div>

            {/* Illustration Section */}
            <div className="hidden md:block">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-08%20160312-1GaPE8XmtNyX1m3eo0FS1Has7NBxdE.png"
                  alt="Set Password Illustration"
                  className="w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1e293b] text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Support Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <p>ISPAT BHAWAN, Lodi</p>
                <p>Road, New Delhi-110003</p>
                <p>EPABX: 24367000</p>
                <p>BOARD: 24367000</p>
                <p>CIN: L27109DL1973GOI006454</p>
                <p>0091 24 1100</p>
              </div>
            </div>

            {/* Account Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Account</h3>
              <div className="space-y-2 text-sm">
                <Link href="/dashboard" className="block text-gray-300 hover:text-white">
                  My Account
                </Link>
                <Link href="/login" className="block text-gray-300 hover:text-white">
                  Login
                </Link>
                <Link href="/register" className="block text-gray-300 hover:text-white">
                  Register
                </Link>
              </div>
            </div>

            {/* Quick Links Section */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Link</h3>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-gray-300 hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white">
                  Terms Of Use
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white">
                  FAQ
                </Link>
                <Link href="#" className="block text-gray-300 hover:text-white">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          {/* Social Media and Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017-.001z" />
                  </svg>
                </Link>
              </div>
              <p className="text-sm text-gray-400">© Copyright 2024. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendOTPAction } from "./actions"

export default function ForgotPasswordEmailClient() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSendOTP(formData: FormData) {
    setLoading(true)
    setError("")

    const result = await sendOTPAction(formData)

    if (result.success) {
      // Store email in sessionStorage for next step
      sessionStorage.setItem("resetEmail", email)
      sessionStorage.setItem("resetOTP", result.otp || "")
      console.log("Demo OTP Code:", result.otp)
      router.push("/forgot-password-otp-conf")
    } else {
      setError(result.error || "Failed to send OTP")
    }

    setLoading(false)
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

      {/* Demo Mode Banner */}
      <div className="bg-blue-100 border-l-4 border-blue-500 p-4">
        <div className="container mx-auto">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> This is a working demo. OTP codes will be displayed in the browser console
                (Press F12 to open developer tools).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-2xl font-bold text-gray-800 tracking-wider">STEEL AUTHORITY OF INDIA LIMITED</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Form Section */}
            <div className="max-w-md mx-auto md:mx-0">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Reset your password</h2>
              <p className="text-gray-600 mb-8">
                Enter your email address and we'll send you a 6-digit OTP to reset your{" "}
                <Link href="#" className="text-blue-600 hover:underline">
                  password
                </Link>
                .
              </p>

              <form action={handleSendOTP} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#6366f1] focus:border-transparent"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-[#6366f1] hover:bg-[#5b21b6] text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>

              <div className="text-center mt-6">
                <Link href="/login" className="text-[#6366f1] hover:underline text-sm">
                  Back to login
                </Link>
              </div>
            </div>

            {/* Illustration Section */}
            <div className="hidden md:block">
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-06-08%20160312-1GaPE8XmtNyX1m3eo0FS1Has7NBxdE.png"
                  alt="Password Reset Illustration"
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

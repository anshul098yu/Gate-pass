"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginAction } from "./actions"
import Link from "next/link"

export default function LoginForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const message = searchParams.get("message")
    if (message) {
      setSuccessMessage(message)
      // Clear the message from URL after showing it
      setTimeout(() => {
        setSuccessMessage("")
        router.replace("/login")
      }, 5000)
    }
  }, [searchParams, router])

  const validateForm = () => {
    if (!email) {
      setError("Email is required")
      return false
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    if (!password) {
      setError("Password is required")
      return false
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    const result = await loginAction(formData)

    if (result.success) {
      if (result.role === "user") {
        router.push("/dashboard")
      } else if (result.role === "security") {
        router.push("/security")
      } else if (result.role === "department_admin") {
        router.push("/department")
      }
    } else {
      setError(result.error || "Invalid email or password")
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {successMessage && (
        <div className="text-green-400 text-sm bg-green-900/50 p-3 rounded-md border border-green-700">{successMessage}</div>
      )}

      {error && <div className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md border border-red-700">{error}</div>}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-3 text-base font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-teal-400 hover:text-teal-300 hover:underline"
        >
          Forgot Password?
        </Link>
      </div>

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <p className="text-sm font-medium text-gray-300 mb-3">Demo credentials:</p>
        <div className="space-y-1 text-xs text-gray-400">
          <p>
            <strong>User:</strong> user@example.com / password123
          </p>
          <p>
            <strong>Security:</strong> security@company.com / password123
          </p>
          <p>
            <strong>Department Admin:</strong> hr@company.com / password123
          </p>
        </div>
      </div>

      <div className="text-center mt-4">
        <span className="text-gray-400">Don't have an account? </span>
        <Link href="/register" className="font-medium text-teal-400 hover:underline">
          Create Account
        </Link>
      </div>
    </form>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { registerAction } from "./actions"

export default function RegisterForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [role, setRole] = useState("")
  const [department, setDepartment] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    // Add role and department to form data
    formData.append("role", role)
    if (department) {
      formData.append("department", department)
    }

    const result = await registerAction(formData)

    if (result.success) {
      // Redirect to login page with success message
      router.push("/login?registered=true")
    } else {
      setError(result.error || "Registration failed")
    }

    setLoading(false)
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Full Name"
          className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="Phone Number"
          className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <Select value={role} onValueChange={setRole} required>
          <SelectTrigger className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-white border-gray-600">
            <SelectItem value="user" className="hover:bg-gray-600">User</SelectItem>
            <SelectItem value="security" className="hover:bg-gray-600">Security</SelectItem>
            <SelectItem value="department_admin" className="hover:bg-gray-600">Department Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {role === "department_admin" && (
        <div>
          <Select value={department} onValueChange={setDepartment} required>
            <SelectTrigger className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-white border-gray-600">
              <SelectItem value="HR" className="hover:bg-gray-600">HR</SelectItem>
              <SelectItem value="IT" className="hover:bg-gray-600">IT</SelectItem>
              <SelectItem value="Finance" className="hover:bg-gray-600">Finance</SelectItem>
              <SelectItem value="Operations" className="hover:bg-gray-600">Operations</SelectItem>
              <SelectItem value="Marketing" className="hover:bg-gray-600">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
        />
      </div>
      <div>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          placeholder="Confirm Password"
          className="w-full bg-gray-700 border-gray-600 placeholder-gray-400 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      {error && <div className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md border border-red-700">{error}</div>}

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white py-3 text-base font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Create Account"}
      </Button>

      <div className="text-center pt-4">
        <span className="text-gray-400">Already have an account? </span>
        <Link href="/login" className="font-medium text-teal-400 hover:underline">
          Log in
        </Link>
      </div>
    </form>
  )
}

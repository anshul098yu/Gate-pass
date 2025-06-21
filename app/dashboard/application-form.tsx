"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createApplicationAction } from "./actions"

interface ApplicationFormProps {
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  onClose: () => void
}

export default function ApplicationForm({ userId, userName, userEmail, userPhone, onClose }: ApplicationFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    try {
      // Add the user data to form data
      formData.append("userId", userId)
      formData.append("userName", userName)
      formData.append("userEmail", userEmail)
      formData.append("userPhone", userPhone)

      const result = await createApplicationAction(formData)

      if (result.success) {
        onClose()
        // Refresh the page to show new application
        router.refresh()
      }
    } catch (error) {
      console.error("Error submitting application:", error)
      setError("Failed to submit application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-teal-400">New Gate Pass Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-gray-300">Purpose of Visit</Label>
              <Textarea id="purpose" name="purpose" required placeholder="e.g., Official meeting with HR" className="bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-300">Department</Label>
              <Select name="department" required>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500">
                  <SelectValue placeholder="Select department" />
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
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="visitDate" className="text-gray-300">Visit Date</Label>
              <Input
                id="visitDate"
                name="visitDate"
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="visitTime" className="text-gray-300">Visit Time</Label>
              <Input id="visitTime" name="visitTime" type="time" required className="bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-gray-300">Duration</Label>
              <Select name="duration" required>
                <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 text-white border-gray-600">
                  <SelectItem value="1 hour" className="hover:bg-gray-600">1 hour</SelectItem>
                  <SelectItem value="2 hours" className="hover:bg-gray-600">2 hours</SelectItem>
                  <SelectItem value="Half day" className="hover:bg-gray-600">Half day</SelectItem>
                  <SelectItem value="Full day" className="hover:bg-gray-600">Full day</SelectItem>
                  <SelectItem value="Multiple days" className="hover:bg-gray-600">Multiple days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber" className="text-gray-300">Vehicle Number (Optional)</Label>
              <Input id="vehicleNumber" name="vehicleNumber" placeholder="e.g., JH01AB1234" className="bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500" />
            </div>
          </div>

          {error && <div className="text-red-400 text-sm bg-red-900/50 p-3 rounded-md border border-red-700">{error}</div>}

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading} className="bg-transparent border-gray-600 hover:bg-gray-700">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
              {loading ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User, Application } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Send, Eye } from "lucide-react"
import { forwardApplicationAction, logoutAction } from "./actions"

interface SecurityDashboardProps {
  user: User
  applications: Application[]
}

export default function SecurityDashboard({ user, applications }: SecurityDashboardProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  console.log("🔒 Security Dashboard - All applications:", applications)

  // Show pending applications for review and forwarding
  const pendingApplications = applications.filter((app) => app.status === "pending")

  console.log("🔒 Security Dashboard - Pending applications:", pendingApplications)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-900/50 text-yellow-300 border border-yellow-700"
      case "forwarded":
        return "bg-blue-900/50 text-blue-300 border border-blue-700"
      case "approved":
        return "bg-green-900/50 text-green-300 border border-green-700"
      case "rejected":
        return "bg-red-900/50 text-red-300 border border-red-700"
      default:
        return "bg-gray-700 text-gray-300 border border-gray-600"
    }
  }

  async function handleForward(applicationId: string) {
    setLoading(true)
    const formData = new FormData()
    formData.append("applicationId", applicationId)
    formData.append("comments", comments)

    try {
      console.log("🚀 Forwarding application:", applicationId)
      const result = await forwardApplicationAction(formData)
      console.log("✅ Forward result:", result)

      setSelectedApp(null)
      setComments("")

      // Use router.refresh() instead of window.location.reload()
      router.refresh()
    } catch (error) {
      console.error("💥 Error forwarding application:", error)
      alert("Failed to forward application. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-teal-400">Security Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">Welcome, {user.name}</span>
              <Button asChild variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                <a href="/debug" target="_blank" rel="noreferrer">
                  Debug View
                </a>
              </Button>
              <form action={logoutAction}>
                <Button variant="outline" size="sm" className="bg-gray-700 border-gray-600 hover:bg-gray-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 gap-8">
            {/* Pending Applications */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-6">
                Pending Applications ({pendingApplications.length})
              </h2>
              <div className="space-y-4">
                {pendingApplications.length === 0 ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500">No pending applications</p>
                    </CardContent>
                  </Card>
                ) : (
                  pendingApplications.map((application) => (
                    <Card key={application.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-gray-200">
                            {application.userName} (#{application.id})
                          </CardTitle>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-300">
                          <div>
                            <span className="font-medium text-gray-500">Purpose:</span> {application.purpose}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Department:</span> {application.department}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Time:</span> {application.visitTime}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Duration:</span> {application.duration}
                          </div>
                          {application.vehicleNumber && (
                            <div>
                              <span className="font-medium text-gray-500">Vehicle:</span> {application.vehicleNumber}
                            </div>
                          )}
                        </div>

                        {selectedApp === application.id ? (
                          <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                            <Textarea
                              placeholder="Add comments for the department..."
                              value={comments}
                              onChange={(e) => setComments(e.target.value)}
                              className="bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
                            />
                            <div className="flex space-x-2">
                              <Button
                                onClick={() => handleForward(application.id)}
                                size="sm"
                                disabled={loading}
                                className="bg-teal-600 hover:bg-teal-700"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                {loading ? "Forwarding..." : `Forward to ${application.department}`}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApp(null)}
                                disabled={loading}
                                className="bg-gray-700 border-gray-600 hover:bg-gray-600"
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <Button
                              onClick={() => setSelectedApp(application.id)}
                              size="sm"
                              disabled={loading}
                              className="bg-gray-700 hover:bg-gray-600"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Review & Forward
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

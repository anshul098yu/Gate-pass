"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { User, Application } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { LogOut, Check, X, QrCode } from "lucide-react"
import QRCodeDisplay from "@/components/qr-code-display"
import { approveApplicationAction, rejectApplicationAction, logoutAction } from "./actions"

interface DepartmentDashboardProps {
  user: User
  applications: Application[]
}

export default function DepartmentDashboard({ user, applications }: DepartmentDashboardProps) {
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  console.log(`🏢 ${user.department} Department Dashboard - All applications:`, applications)

  // Only show forwarded applications for review
  const forwardedApplications = applications.filter((app) => app.status === "forwarded");
  const processedApplications = applications.filter((app) => app.status === "approved" || app.status === "rejected");

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

  async function handleDecision(applicationId: string, decision: "approve" | "reject") {
    setLoading(true)
    const formData = new FormData()
    formData.append("applicationId", applicationId)
    formData.append("comments", comments)
    formData.append("approvedBy", user.name)

    try {
      console.log(`🔄 Processing ${decision} for application:`, applicationId)

      let result
      if (decision === "approve") {
        result = await approveApplicationAction(formData)
      } else {
        result = await rejectApplicationAction(formData)
      }

      console.log(`✅ ${decision} result:`, result)

      setSelectedApp(null)
      setComments("")

      // Use router.refresh() instead of window.location.reload()
      router.refresh()
    } catch (error) {
      console.error(`💥 Error processing ${decision}:`, error)
      alert(`Failed to ${decision} application. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-teal-400">{user.department} Department Dashboard</h1>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pending Review */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-6">
                Pending Review ({forwardedApplications.length})
              </h2>
              <div className="space-y-4">
                {forwardedApplications.length === 0 ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500">No applications pending review</p>
                      <p className="text-xs text-gray-600 mt-2">
                        Applications will appear here after security forwards them to {user.department}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  forwardedApplications.map((application) => (
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
                            <span className="font-medium text-gray-500">Email:</span> {application.userEmail}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Phone:</span> {application.userPhone}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Purpose:</span> {application.purpose}
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
                        {application.securityComments && (
                          <div className="mt-4 p-3 bg-blue-900/50 rounded border border-blue-800">
                            <span className="font-medium text-blue-300">Security Comments:</span>
                            <p className="text-blue-200 mt-1">{application.securityComments}</p>
                          </div>
                        )}
                        <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                          <Textarea
                            placeholder={`Add comments for ${application.userName}...`}
                            value={selectedApp === application.id ? comments : ""}
                            onChange={(e) => {
                              setSelectedApp(application.id)
                              setComments(e.target.value)
                            }}
                            onClick={() => setSelectedApp(application.id)}
                            className="bg-gray-700 border-gray-600 text-white rounded-md focus:ring-teal-500 focus:border-teal-500"
                          />
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleDecision(application.id, "approve")}
                              size="sm"
                              disabled={loading || selectedApp !== application.id}
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:text-gray-400"
                            >
                              <Check className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDecision(application.id, "reject")}
                              disabled={loading || selectedApp !== application.id}
                              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:text-gray-400"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
            {/* Processed Applications */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-200 mb-6">
                Processed Applications ({processedApplications.length})
              </h2>
              <div className="space-y-4">
                {processedApplications.length === 0 ? (
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="text-center py-12">
                      <p className="text-gray-500">No processed applications</p>
                    </CardContent>
                  </Card>
                ) : (
                  processedApplications.map((application) => (
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
                            <span className="font-medium text-gray-500">Email:</span> {application.userEmail}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Phone:</span> {application.userPhone}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Purpose:</span> {application.purpose}
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
                        {application.securityComments && (
                          <div className="mt-4 p-3 bg-blue-900/50 rounded border border-blue-800">
                            <span className="font-medium text-blue-300">Security Comments:</span>
                            <p className="text-blue-200 mt-1">{application.securityComments}</p>
                          </div>
                        )}
                        {application.departmentComments && (
                          <div className={`mt-4 p-3 rounded ${application.status === 'approved' ? 'bg-green-900/50 border border-green-800' : 'bg-red-900/50 border border-red-800'}`}>
                            <span className={`font-medium ${application.status === 'approved' ? 'text-green-300' : 'text-red-300'}`}>Your Comments:</span>
                            <p className={`mt-1 ${application.status === 'approved' ? 'text-green-200' : 'text-red-200'}`}>{application.departmentComments}</p>
                            {application.approvedBy && (
                              <p className="text-gray-500 text-xs mt-1">Processed by: {application.approvedBy}</p>
                            )}
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

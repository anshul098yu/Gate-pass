"use client"

import { useState } from "react"
import type { User, Application } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, LogOut, QrCode, X } from "lucide-react"
import ApplicationForm from "./application-form"
import QRCodeDisplay from "@/components/qr-code-display"
import { logoutAction } from "./actions"

interface UserDashboardProps {
  user: User
  applications: Application[]
}

export default function UserDashboard({ user, applications }: UserDashboardProps) {
  const [showForm, setShowForm] = useState(false)

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

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "pending":
        return "Your application is waiting for security review"
      case "forwarded":
        return "Your application has been forwarded to the department for approval"
      case "approved":
        return "Your application has been approved! Use the QR code below for gate entry"
      case "rejected":
        return "Your application has been rejected. Please check the comments below"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-teal-400">User Dashboard</h1>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-200">My Applications</h2>
            <Button onClick={() => setShowForm(true)} className="bg-teal-600 hover:bg-teal-700">
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Button>
          </div>

          {showForm && (
            <div className="mb-6">
              <ApplicationForm
                userId={user.id}
                userName={user.name}
                userEmail={user.email}
                userPhone={user.phone}
                onClose={() => setShowForm(false)}
              />
            </div>
          )}

          <div className="grid gap-6">
            {applications.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700">
                <CardContent className="text-center py-12">
                  <p className="text-gray-500">No applications found. Create your first application!</p>
                </CardContent>
              </Card>
            ) : (
              applications.map((application) => {
                if (application.status === "approved" && application.qrCode) {
                  return (
                    <div key={application.id} className="p-4 sm:p-6 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
                      <div className="flex items-center justify-center mb-6">
                        <QrCode className="h-8 w-8 text-green-400 mr-3" />
                        <span className="font-bold text-green-300 text-2xl">Gate Pass Approved!</span>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-6">
                        <div className="lg:w-2/5 flex flex-col items-center justify-center p-4 bg-gray-900 rounded-xl shadow-inner">
                          <QRCodeDisplay
                            data={application.qrCode}
                            size={180}
                            applicationId={application.id}
                            userName={application.userName}
                            department={application.department}
                            visitDate={application.visitDate}
                            visitTime={application.visitTime}
                          />
                        </div>

                        <div className="lg:w-3/5 p-6 bg-gray-900 rounded-xl shadow-inner space-y-3 text-sm">
                          <h3 className="text-lg font-semibold text-gray-200 mb-3 border-b border-gray-700 pb-2">
                            Application Details
                          </h3>

                          <div>
                            <span className="font-medium text-gray-400">Applicant:</span> {application.userName}
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Email:</span> {application.userEmail}
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Phone:</span> {application.userPhone}
                          </div>
                          <div className="pt-2 mt-2 border-t border-gray-700">
                            <span className="font-medium text-gray-400">Purpose of Visit:</span> {application.purpose}
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Department:</span> {application.department}
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Visit Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Visit Time:</span> {application.visitTime}
                          </div>
                          <div>
                            <span className="font-medium text-gray-400">Duration:</span> {application.duration}
                          </div>
                          {application.vehicleNumber && (
                            <div>
                              <span className="font-medium text-gray-400">Vehicle Number:</span>{" "}
                              {application.vehicleNumber}
                            </div>
                          )}
                          {application.createdAt && (
                            <div>
                              <span className="font-medium text-gray-400">Applied On:</span>{' '}
                              {new Date(application.createdAt).toISOString().split('T')[0]}
                            </div>
                          )}

                          {application.securityComments && (
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <h4 className="font-medium text-gray-400 text-xs mb-1">Security Comments:</h4>
                              <p className="text-gray-300 text-xs p-2 bg-blue-900/50 rounded border border-blue-800">
                                {application.securityComments}
                              </p>
                            </div>
                          )}

                          {application.departmentComments && (
                            <div className="mt-3 pt-3 border-t border-gray-700">
                              <h4 className="font-medium text-gray-400 text-xs mb-1">
                                {application.department} Department Comments:
                              </h4>
                              <p className="text-gray-300 text-xs p-2 bg-green-900/50 rounded border border-green-800">
                                {application.departmentComments}
                              </p>
                              {application.approvedBy && (
                                <p className="text-gray-500 text-xs mt-1">Processed by: {application.approvedBy}</p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <Card key={application.id} className="bg-gray-800 border-gray-700">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-gray-200">
                            {application.purpose} (#{application.id})
                          </CardTitle>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">{getStatusMessage(application.status)}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                          <div>
                            <span className="font-medium text-gray-500">Department:</span> {application.department}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Visit Date:</span> {application.visitDate}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Visit Time:</span> {application.visitTime}
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">Duration:</span> {application.duration}
                          </div>
                          {application.vehicleNumber && (
                            <div>
                              <span className="font-medium text-gray-500">Vehicle:</span> {application.vehicleNumber}
                            </div>
                          )}
                          {application.createdAt && (
                            <div>
                              <span className="font-medium text-gray-500">Applied:</span>{' '}
                              {new Date(application.createdAt).toISOString().split('T')[0]}
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
                          <div className={`mt-4 p-3 rounded ${application.status === 'approved' ? 'bg-green-900/50 border border-green-800' : application.status === 'rejected' ? 'bg-red-900/50 border border-red-800' : 'bg-gray-900/50 border border-gray-800'}`}>
                            <span className={`font-medium ${application.status === 'approved' ? 'text-green-300' : application.status === 'rejected' ? 'text-red-300' : 'text-gray-300'}`}>
                              {application.department} Department Comments:
                            </span>
                            <p className={`mt-1 ${application.status === 'approved' ? 'text-green-200' : application.status === 'rejected' ? 'text-red-200' : 'text-gray-200'}`}>{application.departmentComments}</p>
                            {application.approvedBy && (
                              <p className="text-gray-500 text-sm mt-1">Processed by: {application.approvedBy}</p>
                            )}
                          </div>
                        )}

                        {application.status === 'rejected' && application.departmentComments && (
                          <div className="mt-4 p-3 bg-red-900/50 rounded border border-red-800">
                            <span className="font-medium text-red-300">Rejection Reason:</span>
                            <p className="text-red-200 mt-1">{application.departmentComments}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                }
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

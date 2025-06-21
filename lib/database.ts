import { prisma } from "./db"
import type { Application, Department } from "./types"

let applicationIdCounter = 3 // Start from 3 since we have test data

const departments: Department[] = [
  { id: "1", name: "HR", adminId: "3" },
  { id: "2", name: "IT", adminId: "4" },
  { id: "3", name: "Finance" },
  { id: "4", name: "Operations" },
  { id: "5", name: "Marketing" },
]

export async function createApplication(application: Omit<Application, "id" | "createdAt" | "updatedAt">): Promise<Application> {
  const newApplication = await prisma.application.create({
    data: {
      userId: application.userId,
      userName: application.userName,
      userEmail: application.userEmail,
      userPhone: application.userPhone,
      purpose: application.purpose,
      department: application.department,
      visitDate: application.visitDate,
      visitTime: application.visitTime,
      duration: application.duration,
      vehicleNumber: application.vehicleNumber,
      status: application.status,
      securityComments: application.securityComments,
      departmentComments: application.departmentComments,
      approvedBy: application.approvedBy,
      qrCode: application.qrCode,
    },
  })
  return newApplication as Application
}

export async function getApplications(): Promise<Application[]> {
  return await prisma.application.findMany({ orderBy: { createdAt: "desc" } })
}

export async function getApplicationById(id: string): Promise<Application | null> {
  return await prisma.application.findUnique({ where: { id } })
}

export async function getApplicationsByUser(userId: string): Promise<Application[]> {
  return await prisma.application.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  })
}

export async function getApplicationsByDepartment(department: string): Promise<Application[]> {
  return await prisma.application.findMany({
    where: {
      department,
      OR: [
        { status: "forwarded" },
        { status: "approved" },
        { status: "rejected" },
      ],
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getAllApplicationsByDepartment(department: string): Promise<Application[]> {
  return await prisma.application.findMany({
    where: { department },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateApplication(id: string, updates: Partial<Application>): Promise<Application | null> {
  return await prisma.application.update({
    where: { id },
    data: { ...updates, updatedAt: new Date() },
  })
}

export function getDepartments(): Department[] {
  return departments
}

export function generateQRCode(application: Application): string {
  console.log("🔄 Generating QR code for application:", application.id)

  // Create comprehensive QR code data
  const qrData = {
    type: "GATE_PASS",
    id: application.id,
    name: application.userName,
    email: application.userEmail,
    phone: application.userPhone,
    department: application.department,
    purpose: application.purpose,
    visitDate: application.visitDate,
    visitTime: application.visitTime,
    duration: application.duration,
    approvedBy: application.approvedBy,
    approvedAt: new Date().toISOString(),
    vehicleNumber: application.vehicleNumber || null,
    companyName: "Your Company Name",
    validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Valid for 24 hours
  }

  // Create a JSON string for the QR code
  const qrCodeData = JSON.stringify(qrData)
  console.log("✅ QR code data generated:", qrCodeData.slice(0, 100) + "...")

  return qrCodeData
}

// Add a function to get applications by status for debugging
export async function getApplicationsByStatus(status: string): Promise<Application[]> {
  return await prisma.application.findMany({ where: { status }, orderBy: { createdAt: "desc" } })
}

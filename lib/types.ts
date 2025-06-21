export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: "user" | "security" | "department_admin"
  department?: string
  createdAt: Date
}

export interface Application {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhone: string
  purpose: string
  department: string
  visitDate: string
  visitTime: string
  duration: string
  vehicleNumber?: string
  status: "pending" | "forwarded" | "approved" | "rejected"
  securityComments?: string
  departmentComments?: string
  approvedBy?: string
  qrCode?: string
  createdAt: Date
  updatedAt: Date
}

export interface Department {
  id: string
  name: string
  adminId?: string
}

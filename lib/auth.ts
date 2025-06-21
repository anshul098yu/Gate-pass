import { cookies } from "next/headers"
import { prisma } from "./db"
import bcrypt from "bcryptjs"
import type { User } from "./types"

export async function authenticate(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role as "user" | "security" | "department_admin",
      department: user.department || undefined,
      createdAt: user.createdAt
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userCookie = cookieStore.get("user")
  if (userCookie) {
    try {
      return JSON.parse(userCookie.value)
    } catch {
      return null
    }
  }
  return null
}

export async function setUserSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })
}

export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
}

// Add createUser function
export async function createUser(userData: {
  name: string
  email: string
  phone: string
  role: "user" | "security" | "department_admin"
  department?: string
  password: string
}): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email }
    })

    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        department: userData.department,
        password: hashedPassword
      }
    })

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      role: newUser.role as "user" | "security" | "department_admin",
      department: newUser.department || undefined,
      createdAt: newUser.createdAt
    }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

"use client"

import RegisterForm from "./register-form"
import Image from "next/image"
import { UserPlus } from "lucide-react"

export default function RegisterPageClient() {
  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.8) rotate(-45deg); opacity: 0; }
          to { transform: scale(1) rotate(-45deg); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 1.5s ease-in-out forwards; }
        .animate-slide-up { animation: slideUp 1.2s ease-in-out 0.4s forwards; opacity: 0; }
        .animate-zoom-in { animation: zoomIn 1.2s ease-in-out 0.8s forwards; opacity: 0; }
      `}</style>
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 animate-fade-in">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden bg-gray-800 border border-gray-700">
          {/* Left Side: Branding */}
          <div className="relative bg-gradient-to-br from-sky-500 to-blue-800 p-8 flex flex-col justify-center items-center text-center">
            <div className="w-36 h-36 bg-white rounded-lg rotate-45 flex items-center justify-center animate-zoom-in shadow-2xl mb-8">
              <Image
                src="/sail-logo.png"
                alt="SAIL Logo"
                width={96}
                height={48}
                className="w-24 h-auto rotate-45"
              />
            </div>
            <div className="animate-slide-up">
              <h1 className="text-4xl font-bold tracking-tight mb-2 text-white drop-shadow-lg">
                Gate Pass System
              </h1>
              <p className="text-lg font-medium text-gray-300 drop-shadow-lg">
                Streamlined Access. Enhanced Security.
              </p>
            </div>
            <div className="absolute bottom-4 text-center text-sm text-blue-200">
              &copy; {new Date().getFullYear()} Steel Authority of India Limited
            </div>
          </div>

          {/* Right Side: Registration Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full animate-slide-up" style={{ animationDelay: '1.2s' }}>
              <div className="text-center mb-8">
                <UserPlus size={40} className="mx-auto text-sky-400 mb-2" />
                <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
                <p className="text-gray-400">Join us to get started.</p>
              </div>
              <RegisterForm />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

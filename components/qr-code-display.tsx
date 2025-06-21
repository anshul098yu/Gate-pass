"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Copy, Printer, RefreshCw } from "lucide-react"
import QRCode from "qrcode"

interface QRCodeDisplayProps {
  data: string
  size?: number
  applicationId: string
  userName: string
  department: string
  visitDate: string
  visitTime: string
}

export default function QRCodeDisplay({
  data,
  size = 200,
  applicationId,
  userName,
  department,
  visitDate,
  visitTime,
}: QRCodeDisplayProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted first
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Generate QR code as data URL
  useEffect(() => {
    if (!mounted) return

    let isMounted = true
    setIsReady(false)
    setError(null)

    const generateQR = async () => {
      try {
        console.log("Generating QR code for data:", data.substring(0, 50) + "...")

        // Create a simplified version of the data if it's too long
        let qrData = data
        if (data.length > 500) {
          // Parse the JSON and simplify it
          try {
            const jsonData = JSON.parse(data)
            const simplifiedData = {
              id: jsonData.id,
              name: jsonData.name,
              department: jsonData.department,
              visitDate: jsonData.visitDate,
              visitTime: jsonData.visitTime,
              purpose: jsonData.purpose?.substring(0, 50),
              approvedBy: jsonData.approvedBy,
            }
            qrData = JSON.stringify(simplifiedData)
            console.log("Simplified QR data:", qrData)
          } catch (e) {
            console.log("Could not parse JSON, using original data")
          }
        }

        // Generate QR code as data URL
        const url = await QRCode.toDataURL(qrData, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        })

        if (isMounted) {
          console.log("QR code generated successfully")
          setQrDataUrl(url)
          setIsReady(true)
        }
      } catch (err) {
        console.error("QR Code generation error:", err)
        if (isMounted) {
          setError("Failed to generate QR code: " + (err as Error).message)
        }
      }
    }

    // Try to generate with retries
    let attempts = 0
    const maxAttempts = 3

    const tryGenerate = () => {
      if (!isMounted) return

      generateQR().catch((err) => {
        console.error("QR generation attempt failed:", err)
        if (attempts < maxAttempts && isMounted) {
          attempts++
          setTimeout(tryGenerate, 1000)
        }
      })
    }

    tryGenerate()

    return () => {
      isMounted = false
    }
  }, [data, size, mounted])

  const downloadQRCode = () => {
    if (!qrDataUrl) return

    const link = document.createElement("a")
    link.download = `gate-pass-${applicationId}.png`
    link.href = qrDataUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyQRData = async () => {
    try {
      await navigator.clipboard.writeText(data)
      alert("QR data copied to clipboard!")
    } catch {
      try {
        const textArea = document.createElement("textarea")
        textArea.value = data
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
        alert("QR data copied to clipboard!")
      } catch {
        alert("Could not copy to clipboard")
      }
    }
  }

  const printQRCode = () => {
    if (!qrDataUrl) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const printContent = `
      <html>
        <head>
          <title>Gate Pass ${applicationId}</title>
          <style>
            body { 
              text-align: center; 
              font-family: Arial; 
              padding: 20px; 
              margin: 0;
            }
            .header { 
              border-bottom: 2px solid #000; 
              padding-bottom: 10px; 
              margin-bottom: 20px; 
            }
            .qr-image { 
              border: 2px solid black; 
              margin: 20px; 
              max-width: 300px;
            }
            .details { 
              margin: 20px; 
              text-align: left; 
              max-width: 300px; 
              margin-left: auto; 
              margin-right: auto; 
              border: 1px solid #ccc; 
              padding: 15px; 
            }
            .detail { 
              margin: 5px 0; 
              padding: 3px 0; 
              border-bottom: 1px solid #eee; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>🏢 GATE PASS</h2>
            <h3>Your Company Name</h3>
          </div>
          
          <img src="${qrDataUrl}" alt="QR Code" class="qr-image" />
          
          <div class="details">
            <div class="detail"><strong>ID:</strong> ${applicationId}</div>
            <div class="detail"><strong>Name:</strong> ${userName}</div>
            <div class="detail"><strong>Department:</strong> ${department}</div>
            <div class="detail"><strong>Date:</strong> ${visitDate}</div>
            <div class="detail"><strong>Time:</strong> ${visitTime}</div>
            <div class="detail"><strong>Generated:</strong> ${new Date().toLocaleString()}</div>
          </div>
          
          <p style="margin-top: 20px; font-size: 12px;">
            Present this pass at security checkpoint
          </p>
        </body>
        <script>
          window.onload = function() { 
            setTimeout(function() {
              window.print();
            }, 500); 
          };
          window.onafterprint = function() {
            window.close();
          };
        </script>
      </html>
    `

    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  const retryGeneration = () => {
    setError(null)
    setIsReady(false)
    setQrDataUrl("")
    setMounted(false)
    setTimeout(() => setMounted(true), 100)
  }

  // Don't render until mounted (prevents SSR issues)
  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-lg bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse w-[260px] h-[260px] bg-gray-200 rounded mb-4"></div>
          <p className="text-gray-500">Loading QR generator...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center space-y-4 p-6 border-2 border-red-300 rounded-lg bg-red-50">
        <div className="text-center">
          <p className="text-2xl mb-2">❌</p>
          <p className="font-bold text-red-800">QR Generation Failed</p>
          <p className="text-sm text-red-600 mt-2">{error}</p>
        </div>
        <Button onClick={retryGeneration} size="sm" variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    )
  }

  // Loading state
  if (!isReady) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto"></div>
          <p className="text-gray-400 mt-4">Generating Gate Pass...</p>
        </div>
      </div>
    )
  }

  // Success state
  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-800 shadow-lg text-center">
      <div className="border-4 border-white p-2 inline-block rounded-lg">
        <img src={qrDataUrl} alt="QR Code for Gate Pass" width={size} height={size} />
      </div>
      <div className="mt-4 text-center">
        <p className="font-bold text-lg text-green-300">✓ Gate Pass Ready!</p>
        <p className="text-xs text-gray-400 break-all mt-1">ID: {applicationId}</p>

        <div className="text-xs text-gray-400 mt-3 border-t border-gray-700 pt-3">
          <p>Valid: {visitDate} at {visitTime}</p>
          <p>Department: {department}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-4">
        <Button onClick={downloadQRCode} size="sm" className="bg-teal-600 hover:bg-teal-700">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button onClick={copyQRData} size="sm" variant="secondary" className="bg-gray-700 hover:bg-gray-600">
          <Copy className="mr-2 h-4 w-4" />
          Copy Data
        </Button>
      </div>

      <div className="mt-4 text-xs text-gray-500 p-2 bg-gray-900/50 rounded border border-gray-700">
        <p className="font-semibold">Instructions:</p>
        <p>Scan this QR code with any QR scanner app.</p>
        <p>Present at security for gate entry verification.</p>
      </div>
    </div>
  )
}

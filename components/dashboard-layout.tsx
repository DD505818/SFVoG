"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Sidebar } from "@/components/sidebar"
import { ErrorBoundary } from "@/components/error-boundary"
import { useWebSocket } from "@/lib/websocket-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const { connectionStatus } = useWebSocket()
  const [showConnectionAlert, setShowConnectionAlert] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Show connection alert after a delay if still not connected
    const timer = setTimeout(() => {
      if (connectionStatus === "disconnected" || connectionStatus === "reconnecting") {
        setShowConnectionAlert(true)
      }
    }, 5000)

    return () => {
      setMounted(false)
      clearTimeout(timer)
    }
  }, [connectionStatus])

  // Hide alert when connection is established
  useEffect(() => {
    if (connectionStatus === "connected") {
      setShowConnectionAlert(false)
    }
  }, [connectionStatus])

  // Return a skeleton layout with the same structure to prevent layout shift
  if (!mounted) {
    return (
      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
        <div className="h-14 border-b border-border/40"></div>
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[16rem] hidden md:block"></div>
          <main className="flex-1 overflow-auto">{/* Content will be hydrated */}</main>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          {showConnectionAlert && (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Connection Issue</AlertTitle>
              <AlertDescription>
                Unable to establish real-time data connection. Some features may be limited. The application will
                continue to function with periodic updates.
              </AlertDescription>
            </Alert>
          )}
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  )
}

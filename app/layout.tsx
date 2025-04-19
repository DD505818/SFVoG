import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { WebSocketProvider } from "@/lib/websocket-context"
import { KeyboardShortcutsProvider } from "@/lib/keyboard-shortcuts-context"
import { ReactQueryProvider } from "@/lib/react-query-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DDx Control Board",
  description: "Cutting-edge financial AI dashboard for high-frequency trading",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ReactQueryProvider>
            <WebSocketProvider>
              <KeyboardShortcutsProvider>
                {children}
                <Toaster />
              </KeyboardShortcutsProvider>
            </WebSocketProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

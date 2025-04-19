import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check system health
    const health = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      status: "ok",
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV,
      version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
    }

    // Check if required environment variables are set
    const requiredEnvVars = ["NEXT_PUBLIC_API_URL", "NEXT_PUBLIC_WS_URL"]
    const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingEnvVars.length > 0) {
      health.status = "warning"
      Object.assign(health, {
        warnings: {
          missingEnvVars,
        },
      })
    }

    return NextResponse.json(health, { status: 200 })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

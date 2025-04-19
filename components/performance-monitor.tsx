"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Activity, AlertTriangle, ArrowDown, ArrowUp, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebSocket } from "@/lib/websocket-context"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface PerformanceData {
  timestamp: string
  cpu: number
  memory: number
  latency: number
  throughput: number
}

interface Alert {
  id: string
  timestamp: string
  message: string
  level: "info" | "warning" | "critical"
}

export function PerformanceMonitor() {
  const [activeTab, setActiveTab] = useState("realtime")
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const { subscribe, unsubscribe } = useWebSocket()
  const chartContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Subscribe to performance metrics
    subscribe("performance_metrics")

    // Generate initial data
    const initialData: PerformanceData[] = []
    const now = Date.now()

    for (let i = 0; i < 20; i++) {
      initialData.push({
        timestamp: new Date(now - (19 - i) * 15000).toISOString(),
        cpu: Math.floor(Math.random() * 30) + 40,
        memory: Math.floor(Math.random() * 20) + 60,
        latency: Math.floor(Math.random() * 50) + 20,
        throughput: Math.floor(Math.random() * 200) + 800,
      })
    }

    setPerformanceData(initialData)

    // Generate sample alerts
    setAlerts([
      {
        id: "alert-1",
        timestamp: new Date(now - 300000).toISOString(),
        message: "Memory usage spike detected",
        level: "warning",
      },
      {
        id: "alert-2",
        timestamp: new Date(now - 900000).toISOString(),
        message: "High CPU utilization",
        level: "info",
      },
      {
        id: "alert-3",
        timestamp: new Date(now - 1800000).toISOString(),
        message: "Network latency exceeding threshold",
        level: "critical",
      },
    ])

    // Simulate real-time updates
    const interval = setInterval(() => {
      setPerformanceData((prev) => {
        const newData = [...prev.slice(1)]
        const lastTimestamp = new Date(prev[prev.length - 1].timestamp)

        newData.push({
          timestamp: new Date(lastTimestamp.getTime() + 15000).toISOString(),
          cpu: Math.min(100, Math.max(10, prev[prev.length - 1].cpu + (Math.random() * 10 - 5))),
          memory: Math.min(100, Math.max(40, prev[prev.length - 1].memory + (Math.random() * 6 - 3))),
          latency: Math.min(200, Math.max(10, prev[prev.length - 1].latency + (Math.random() * 20 - 10))),
          throughput: Math.min(1500, Math.max(500, prev[prev.length - 1].throughput + (Math.random() * 100 - 50))),
        })

        return newData
      })

      // Occasionally add new alerts
      if (Math.random() > 0.9) {
        const levels = ["info", "warning", "critical"] as const
        const level = levels[Math.floor(Math.random() * levels.length)]
        const messages = [
          "Memory usage spike detected",
          "High CPU utilization",
          "Network latency exceeding threshold",
          "Database connection pool near capacity",
          "API rate limit approaching threshold",
        ]

        setAlerts((prev) => [
          {
            id: `alert-${Date.now()}`,
            timestamp: new Date().toISOString(),
            message: messages[Math.floor(Math.random() * messages.length)],
            level,
          },
          ...prev.slice(0, 9), // Keep only the 10 most recent alerts
        ])
      }
    }, 15000)

    return () => {
      clearInterval(interval)
      unsubscribe("performance_metrics")
    }
  }, [subscribe, unsubscribe])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    return date.toLocaleDateString()
  }

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      case "critical":
        return "bg-red-500/20 text-red-500 hover:bg-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium">Performance Monitor</CardTitle>
        </div>
        <CardDescription>System metrics and alerts</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="realtime" value={activeTab} onValueChange={setActiveTab} className="px-4 pt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="realtime">Real-time Metrics</TabsTrigger>
            <TabsTrigger value="alerts">Alerts ({alerts.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "realtime" ? (
          <div className="p-4">
            <div ref={chartContainerRef} className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={formatTime}
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
                    labelFormatter={formatTime}
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "4px",
                      color: "hsl(var(--foreground))",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="cpu"
                    name="CPU"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="memory"
                    name="Memory"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">CPU Usage</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {performanceData[performanceData.length - 1]?.cpu.toFixed(1)}%
                  </span>
                  {performanceData[performanceData.length - 1]?.cpu >
                  performanceData[performanceData.length - 2]?.cpu ? (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Memory Usage</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold">
                    {performanceData[performanceData.length - 1]?.memory.toFixed(1)}%
                  </span>
                  {performanceData[performanceData.length - 1]?.memory >
                  performanceData[performanceData.length - 2]?.memory ? (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  ) : (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-border max-h-[250px] overflow-y-auto">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge className={getAlertLevelColor(alert.level)}>
                    {alert.level.charAt(0).toUpperCase() + alert.level.slice(1)}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimestamp(alert.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm">{alert.message}</p>
              </motion.div>
            ))}

            {alerts.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No alerts to display</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

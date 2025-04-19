"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { RefreshCw, Link, AlertTriangle, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWebSocket } from "@/lib/websocket-context"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

interface BrokerConnection {
  id: string
  name: string
  status: "connected" | "disconnected" | "error"
  latency: number
  lastSync: string
}

export function BrokerSync() {
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [brokers, setBrokers] = useState<BrokerConnection[]>([])
  const { sendMessage } = useWebSocket()

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setBrokers([
        {
          id: "broker-1",
          name: "Binance",
          status: "connected",
          latency: 45,
          lastSync: new Date().toISOString(),
        },
        {
          id: "broker-2",
          name: "Kraken",
          status: "connected",
          latency: 78,
          lastSync: new Date(Date.now() - 120000).toISOString(),
        },
        {
          id: "broker-3",
          name: "Coinbase",
          status: "error",
          latency: 0,
          lastSync: new Date(Date.now() - 3600000).toISOString(),
        },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  const handleSync = () => {
    setSyncing(true)

    // Simulate sync process
    setTimeout(() => {
      setBrokers((prev) =>
        prev.map((broker) => ({
          ...broker,
          lastSync: new Date().toISOString(),
          status: Math.random() > 0.2 ? "connected" : broker.status,
        })),
      )
      setSyncing(false)

      toast({
        title: "Broker Sync Complete",
        description: "All broker connections have been synchronized",
      })

      // Send WebSocket message
      sendMessage({
        action: "sync_brokers",
        result: "success",
      })
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "disconnected":
        return <Link className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "connected":
        return "Connected"
      case "disconnected":
        return "Disconnected"
      case "error":
        return "Error"
      default:
        return "Unknown"
    }
  }

  const formatTime = (timestamp: string) => {
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

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">Broker Sync</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleSync} disabled={syncing}>
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>Exchange connection status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-3">
            {brokers.map((broker) => (
              <motion.div
                key={broker.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(broker.status)}
                  <span className="font-medium text-sm">{broker.name}</span>
                </div>
                <div className="flex flex-col items-end">
                  <Badge
                    variant="outline"
                    className={
                      broker.status === "connected"
                        ? "border-green-500/20 text-green-500"
                        : broker.status === "error"
                          ? "border-red-500/20 text-red-500"
                          : "border-yellow-500/20 text-yellow-500"
                    }
                  >
                    {getStatusText(broker.status)}
                  </Badge>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    {broker.status === "connected" && <span>{broker.latency}ms</span>}
                    <span>Synced: {formatTime(broker.lastSync)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

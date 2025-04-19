"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Briefcase, ArrowRight, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWebSocket } from "@/lib/websocket-context"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FeedbackItem {
  id: string
  timestamp: string
  message: string
  type: "suggestion" | "warning" | "improvement"
  status: "pending" | "approved" | "rejected"
  source: string
}

export function FeedbackLoop() {
  const [loading, setLoading] = useState(true)
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([])
  const { subscribe, unsubscribe, sendMessage } = useWebSocket()

  useEffect(() => {
    // Subscribe to feedback updates
    subscribe("feedback_updates")

    // Simulate initial data loading
    setTimeout(() => {
      setFeedbackItems([
        {
          id: "fb-1",
          timestamp: new Date().toISOString(),
          message: "Increase position size for BTC/USD strategy",
          type: "suggestion",
          status: "pending",
          source: "Performance Analyzer",
        },
        {
          id: "fb-2",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          message: "Reduce exposure to high volatility assets",
          type: "warning",
          status: "pending",
          source: "Risk Monitor",
        },
        {
          id: "fb-3",
          timestamp: new Date(Date.now() - 600000).toISOString(),
          message: "Optimize order execution timing",
          type: "improvement",
          status: "approved",
          source: "Latency Analyzer",
        },
        {
          id: "fb-4",
          timestamp: new Date(Date.now() - 900000).toISOString(),
          message: "Add correlation analysis to strategy",
          type: "suggestion",
          status: "rejected",
          source: "Strategy Evolver",
        },
      ])
      setLoading(false)
    }, 1500)

    // Cleanup subscription
    return () => {
      unsubscribe("feedback_updates")
    }
  }, [subscribe, unsubscribe])

  // Simulate real-time feedback
  useEffect(() => {
    if (loading) return

    const interval = setInterval(() => {
      const types = ["suggestion", "warning", "improvement"] as const
      const sources = ["Performance Analyzer", "Risk Monitor", "Latency Analyzer", "Strategy Evolver"]
      const messages = [
        "Adjust stop-loss parameters for ETH/USD",
        "Consider adding SOL to portfolio mix",
        "Increase signal threshold for low liquidity pairs",
        "Optimize execution timing for large orders",
        "Reduce position size during high volatility",
      ]

      if (Math.random() > 0.7) {
        // 30% chance of new feedback
        const newFeedback: FeedbackItem = {
          id: `fb-${Date.now()}`,
          timestamp: new Date().toISOString(),
          message: messages[Math.floor(Math.random() * messages.length)],
          type: types[Math.floor(Math.random() * types.length)],
          status: "pending",
          source: sources[Math.floor(Math.random() * sources.length)],
        }

        setFeedbackItems((prev) => [newFeedback, ...prev].slice(0, 20))
      }
    }, 20000)

    return () => clearInterval(interval)
  }, [loading])

  const handleFeedbackAction = (id: string, action: "approve" | "reject") => {
    setFeedbackItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action === "approve" ? "approved" : "rejected" } : item)),
    )

    // Send WebSocket message
    sendMessage({
      action: "feedback_action",
      feedbackId: id,
      status: action,
    })
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "suggestion":
        return "bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
      case "improvement":
        return "bg-green-500/20 text-green-500 hover:bg-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-500 hover:bg-gray-500/30"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4 text-green-500" />
      case "rejected":
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <ArrowRight className="h-4 w-4 text-blue-500" />
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium">Feedback Loop</CardTitle>
        </div>
        <CardDescription>AI-generated trading improvements</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-8 w-8" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {feedbackItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Badge className={getTypeColor(item.type)}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatTime(item.timestamp)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.source}</span>
                  </div>
                  <p className="text-sm mb-2">{item.message}</p>
                  {item.status === "pending" ? (
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleFeedbackAction(item.id, "reject")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleFeedbackAction(item.id, "approve")}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</span>
                      {getStatusIcon(item.status)}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

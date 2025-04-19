"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Zap, ChevronDown, ChevronUp, Play, Pause, Plus, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWebSocket } from "@/lib/websocket-context"
import { Skeleton } from "@/components/ui/skeleton"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Strategy {
  id: string
  name: string
  status: "active" | "paused" | "error"
  type: string
  performance: number
  signals: number
  allocation: number
  pnl: number
  pnlHistory: { time: string; value: number }[]
}

function generatePnlHistory(points: number, min: number, max: number) {
  const history = []
  let lastValue = (min + max) / 2

  for (let i = 0; i < points; i++) {
    const time = new Date(Date.now() - (points - i) * 15 * 60000).toISOString()
    const change = (Math.random() - 0.5) * (max - min) * 0.1
    lastValue = Math.max(min, Math.min(max, lastValue + change))

    history.push({
      time: time.substring(11, 16), // Extract HH:MM
      value: lastValue,
    })
  }

  return history
}

const initialStrategies: Strategy[] = [
  {
    id: "strat-1",
    name: "Momentum Alpha",
    status: "active",
    type: "ML",
    performance: 78,
    signals: 42,
    allocation: 25,
    pnl: 4325.75,
    pnlHistory: generatePnlHistory(20, 4000, 5000),
  },
  {
    id: "strat-2",
    name: "Volatility Edge",
    status: "active",
    type: "HF",
    performance: 92,
    signals: 67,
    allocation: 35,
    pnl: 6782.5,
    pnlHistory: generatePnlHistory(20, 6000, 7000),
  },
  {
    id: "strat-3",
    name: "Mean Reversion",
    status: "paused",
    type: "AI",
    performance: 45,
    signals: 12,
    allocation: 0,
    pnl: -1250.25,
    pnlHistory: generatePnlHistory(20, -2000, -500),
  },
]

export function StrategyConsole() {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null)
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const { subscribe, unsubscribe, sendMessage } = useWebSocket()
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    // Subscribe to strategy updates
    subscribe("strategy_updates")

    // Simulate initial data loading
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setStrategies(initialStrategies)
        setLoading(false)
      }
    }, 1500)

    // Cleanup subscription and timer
    return () => {
      isMountedRef.current = false
      unsubscribe("strategy_updates")
      clearTimeout(timer)
    }
  }, [subscribe, unsubscribe])

  const toggleStrategy = useCallback(
    (strategyId: string) => {
      setStrategies((prevStrategies) =>
        prevStrategies.map((strategy) => {
          if (strategy.id === strategyId) {
            const newStatus = strategy.status === "active" ? "paused" : "active"
            return {
              ...strategy,
              status: newStatus,
              allocation: newStatus === "active" ? (strategy.performance > 70 ? 25 : 15) : 0,
            }
          }
          return strategy
        }),
      )

      // Send WebSocket message
      sendMessage({
        action: "toggle_strategy",
        strategyId,
        status: strategies.find((s) => s.id === strategyId)?.status === "active" ? "paused" : "active",
      })
    },
    [sendMessage, strategies],
  )

  const toggleExpandStrategy = useCallback((strategyId: string) => {
    setExpandedStrategy((prev) => (prev === strategyId ? null : strategyId))
  }, [])

  // Use memoized filtered strategies to prevent unnecessary re-renders
  const filteredStrategies = strategies.filter((strategy) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return strategy.status === "active"
    if (activeTab === "paused") return strategy.status === "paused"
    if (activeTab === "error") return strategy.status === "error"
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Active</Badge>
      case "paused":
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">Paused</Badge>
      case "error":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">Error</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle>Strategy Console</CardTitle>
          </div>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Strategy
          </Button>
        </div>
        <CardDescription>Manage and monitor trading strategies</CardDescription>
      </CardHeader>
      <div className="px-4 pt-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({strategies.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({strategies.filter((s) => s.status === "active").length})</TabsTrigger>
            <TabsTrigger value="paused">Paused ({strategies.filter((s) => s.status === "paused").length})</TabsTrigger>
            <TabsTrigger value="error">Error ({strategies.filter((s) => s.status === "error").length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CardContent className="p-0 pt-4">
        <div className="divide-y divide-border">
          {loading
            ? Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-40" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))
            : filteredStrategies.map((strategy) => (
                <motion.div
                  key={strategy.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between p-4">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${getStatusColor(strategy.status)}`} />
                        <span className="font-medium">{strategy.name}</span>
                        <Badge variant="outline" className="ml-1">
                          {strategy.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div>Performance: {strategy.performance}%</div>
                        <div>Signals: {strategy.signals}</div>
                        <div>Allocation: {strategy.allocation}%</div>
                      </div>
                      {strategy.status === "active" && <Progress value={strategy.performance} className="h-1 mt-2" />}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`font-bold ${strategy.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                        {formatCurrency(strategy.pnl)}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleExpandStrategy(strategy.id)}
                        >
                          {expandedStrategy === strategy.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => toggleStrategy(strategy.id)}
                        >
                          {strategy.status === "active" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {expandedStrategy === strategy.id && (
                    <div className="px-4 pb-4">
                      <Card className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{strategy.name} Performance</h4>
                              {getStatusBadge(strategy.status)}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Settings className="mr-2 h-3 w-3" />
                              Configure
                            </Button>
                          </div>
                          <div className="h-40">
                            <ChartContainer
                              config={{
                                pnl: {
                                  label: "P&L",
                                  color: strategy.pnl >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))",
                                },
                              }}
                            >
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={strategy.pnlHistory}>
                                  <defs>
                                    <linearGradient id={`gradient-${strategy.id}`} x1="0" y1="0" x2="0" y2="1">
                                      <stop
                                        offset="5%"
                                        stopColor={strategy.pnl >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))"}
                                        stopOpacity={0.8}
                                      />
                                      <stop
                                        offset="95%"
                                        stopColor={strategy.pnl >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))"}
                                        stopOpacity={0}
                                      />
                                    </linearGradient>
                                  </defs>
                                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                                  <XAxis
                                    dataKey="time"
                                    stroke="var(--muted-foreground)"
                                    fontSize={10}
                                    tickLine={false}
                                  />
                                  <YAxis
                                    stroke="var(--muted-foreground)"
                                    fontSize={10}
                                    tickLine={false}
                                    tickFormatter={(value) => `${value.toLocaleString()}`}
                                  />
                                  <ChartTooltip content={<ChartTooltipContent />} />
                                  <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={strategy.pnl >= 0 ? "hsl(var(--chart-1))" : "hsl(var(--chart-3))"}
                                    fillOpacity={1}
                                    fill={`url(#gradient-${strategy.id})`}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            </ChartContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </motion.div>
              ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 py-2">
        <div className="text-xs text-muted-foreground">
          {strategies.filter((s) => s.status === "active").length} of {strategies.length} strategies active
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="mr-2 h-3 w-3" />
          Manage All
        </Button>
      </CardFooter>
    </Card>
  )
}

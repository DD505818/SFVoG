"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, ArrowUp, ArrowDown, Clock, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWebSocket } from "@/lib/websocket-context"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AlphaSignal {
  id: string
  timestamp: string
  symbol: string
  direction: "buy" | "sell"
  confidence: number
  source: string
  price: number
  timeframe: string
}

const initialSignals: AlphaSignal[] = [
  {
    id: "signal-1",
    timestamp: new Date().toISOString(),
    symbol: "BTC/USD",
    direction: "buy",
    confidence: 87,
    source: "QRA",
    price: 42568.75,
    timeframe: "5m",
  },
  {
    id: "signal-2",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    symbol: "ETH/USD",
    direction: "sell",
    confidence: 92,
    source: "SAmp",
    price: 2345.5,
    timeframe: "15m",
  },
  {
    id: "signal-3",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    symbol: "XRP/USD",
    direction: "buy",
    confidence: 65,
    source: "VH",
    price: 0.5423,
    timeframe: "1h",
  },
]

export function AlphaFeed() {
  const [loading, setLoading] = useState(true)
  const [signals, setSignals] = useState<AlphaSignal[]>([])
  const [filters, setFilters] = useState({
    buy: true,
    sell: true,
    highConfidence: false,
  })
  const { subscribe, unsubscribe } = useWebSocket()
  const containerRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)

  // Load initial data
  useEffect(() => {
    isMountedRef.current = true

    // Subscribe to alpha signals
    subscribe("alpha_signals")

    // Simulate initial data loading
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setSignals(initialSignals)
        setLoading(false)
      }
    }, 1500)

    // Cleanup subscription and timer
    return () => {
      isMountedRef.current = false
      unsubscribe("alpha_signals")
      clearTimeout(timer)
    }
  }, [subscribe, unsubscribe])

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof typeof filters, value: boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }, [])

  // Memoize filtered signals to prevent unnecessary re-renders
  const filteredSignals = useMemo(() => {
    return signals.filter((signal) => {
      if (!filters.buy && signal.direction === "buy") return false
      if (!filters.sell && signal.direction === "sell") return false
      if (filters.highConfidence && signal.confidence < 80) return false
      return true
    })
  }, [signals, filters])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const formatPrice = (price: number) => {
    if (price < 0.01) return price.toFixed(6)
    if (price < 1) return price.toFixed(4)
    if (price < 100) return price.toFixed(2)
    return price.toFixed(2)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            <CardTitle>Alpha Feed</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Signals</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.buy}
                onCheckedChange={(checked) => handleFilterChange("buy", !!checked)}
              >
                Buy Signals
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.sell}
                onCheckedChange={(checked) => handleFilterChange("sell", !!checked)}
              >
                Sell Signals
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.highConfidence}
                onCheckedChange={(checked) => handleFilterChange("highConfidence", !!checked)}
              >
                High Confidence Only (80%+)
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>Real-time trading signals</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={containerRef} className="max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-10 w-20" />
                  </div>
                ))}
            </div>
          ) : (
            <AnimatePresence>
              {filteredSignals.length > 0 ? (
                <div className="divide-y divide-border">
                  {filteredSignals.map((signal) => (
                    <motion.div
                      key={signal.id}
                      initial={{
                        opacity: 0,
                        backgroundColor:
                          signal.direction === "buy" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      }}
                      animate={{ opacity: 1, backgroundColor: "transparent" }}
                      transition={{ duration: 2 }}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{signal.symbol}</span>
                          <Badge
                            variant="outline"
                            className={
                              signal.direction === "buy"
                                ? "border-green-500 text-green-500"
                                : "border-red-500 text-red-500"
                            }
                          >
                            {signal.direction.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">{signal.timeframe}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(signal.timestamp)}
                          </div>
                          <div>Source: {signal.source}</div>
                          <div>Confidence: {signal.confidence}%</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-mono font-bold">{formatPrice(signal.price)}</div>
                        <div
                          className={`flex items-center text-xs ${signal.direction === "buy" ? "text-green-500" : "text-red-500"}`}
                        >
                          {signal.direction === "buy" ? (
                            <ArrowUp className="h-3 w-3 mr-1" />
                          ) : (
                            <ArrowDown className="h-3 w-3 mr-1" />
                          )}
                          {signal.direction === "buy" ? "Long" : "Short"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-8 text-muted-foreground">
                  No signals match the current filters
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

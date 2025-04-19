"use client"

import { useState, useEffect, useRef } from "react"
import { BarChart3 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWebSocket } from "@/lib/websocket-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"

interface AssetAllocation {
  asset: string
  allocation: number
  value: number
  change: number
}

const initialAllocations: AssetAllocation[] = [
  { asset: "BTC", allocation: 35, value: 350000, change: 2.4 },
  { asset: "ETH", allocation: 25, value: 250000, change: -1.2 },
  { asset: "USDT", allocation: 20, value: 200000, change: 0 },
  { asset: "SOL", allocation: 15, value: 150000, change: 4.7 },
  { asset: "Other", allocation: 5, value: 50000, change: 1.3 },
]

export function CapitalMatrix() {
  const [loading, setLoading] = useState(true)
  const [totalCapital, setTotalCapital] = useState(0)
  const [allocations, setAllocations] = useState<AssetAllocation[]>([])
  const { subscribe, unsubscribe } = useWebSocket()
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    // Subscribe to capital updates
    subscribe("capital_updates")

    // Simulate initial data loading
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setTotalCapital(1000000)
        setAllocations(initialAllocations)
        setLoading(false)
      }
    }, 1500)

    // Cleanup subscription
    return () => {
      isMountedRef.current = false
      unsubscribe("capital_updates")
      clearTimeout(timer)
    }
  }, [subscribe, unsubscribe])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-medium">Capital Matrix</CardTitle>
        </div>
        <CardDescription>Asset allocation and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-8 w-32" />
            <div className="space-y-3">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold">{formatCurrency(totalCapital)}</div>
            <div className="space-y-3">
              {allocations.map((item) => (
                <div key={item.asset} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <div className="font-medium">{item.asset}</div>
                    <div className="flex items-center gap-2">
                      <span>{item.allocation}%</span>
                      <span
                        className={`${item.change > 0 ? "text-green-500" : item.change < 0 ? "text-red-500" : "text-muted-foreground"}`}
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </span>
                    </div>
                  </div>
                  <Progress value={item.allocation} className="h-1" />
                  <div className="text-xs text-muted-foreground text-right">{formatCurrency(item.value)}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

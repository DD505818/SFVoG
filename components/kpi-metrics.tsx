"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function KpiMetrics() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    dailyPnL: 12458.75,
    dailyPnLPercent: 3.2,
    winRate: 68.5,
    activeStrategies: 7,
    totalTrades: 342,
    avgTradeTime: 47,
  })

  // Simple loading simulation with no dependencies
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Key Performance Metrics</CardTitle>
        <CardDescription>Trading performance</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        {/* Daily P&L */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Daily P&L</p>
          {loading ? (
            <Skeleton className="h-7 w-24" />
          ) : (
            <div className="text-lg font-bold text-green-500">{formatCurrency(data.dailyPnL)}</div>
          )}
        </div>

        {/* Win Rate */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Win Rate</p>
          {loading ? <Skeleton className="h-7 w-16" /> : <div className="text-lg font-bold">{data.winRate}%</div>}
        </div>

        {/* Active Strategies */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Active Strategies</p>
          {loading ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <div className="text-lg font-bold">{data.activeStrategies}</div>
          )}
        </div>

        {/* Total Trades */}
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Total Trades</p>
          {loading ? <Skeleton className="h-7 w-16" /> : <div className="text-lg font-bold">{data.totalTrades}</div>}
        </div>
      </CardContent>
    </Card>
  )
}

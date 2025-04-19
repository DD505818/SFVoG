"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion } from "framer-motion"
import { Database, CheckCircle, XCircle, Search, ExternalLink } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useWebSocket } from "@/lib/websocket-context"
import { Skeleton } from "@/components/ui/skeleton"

interface Transaction {
  id: string
  hash: string
  timestamp: string
  status: "verified" | "pending" | "failed"
  type: string
  amount: number
  asset: string
}

const initialTransactions: Transaction[] = [
  {
    id: "tx-1",
    hash: "0x7a69d2c57b6d53e9c0896b7131a74e4b5d3e1f97",
    timestamp: new Date().toISOString(),
    status: "verified",
    type: "trade",
    amount: 1.25,
    asset: "BTC",
  },
  {
    id: "tx-2",
    hash: "0x3e8c4d2f1a6b7e9d0c5f2a3b1d8e7f6a5b4c3d2e",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    status: "verified",
    type: "withdrawal",
    amount: 15.75,
    asset: "ETH",
  },
  {
    id: "tx-3",
    hash: "0x9b8a7c6d5e4f3g2h1i0j9k8l7m6n5o4p3q2r1s",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    status: "pending",
    type: "deposit",
    amount: 5000,
    asset: "USDT",
  },
  {
    id: "tx-4",
    hash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    status: "failed",
    type: "trade",
    amount: 0.5,
    asset: "BTC",
  },
]

export function BlockchainVerifier() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { subscribe, unsubscribe } = useWebSocket()
  const isMountedRef = useRef(true)

  useEffect(() => {
    isMountedRef.current = true

    // Subscribe to blockchain transactions
    subscribe("blockchain_transactions")

    // Simulate initial data loading
    const timer = setTimeout(() => {
      if (isMountedRef.current) {
        setTransactions(initialTransactions)
        setLoading(false)
      }
    }, 1500)

    // Cleanup subscription
    return () => {
      isMountedRef.current = false
      unsubscribe("blockchain_transactions")
      clearTimeout(timer)
    }
  }, [subscribe, unsubscribe])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }, [])

  // Memoize filtered transactions to prevent unnecessary re-renders
  const filteredTransactions = useMemo(() => {
    if (!searchQuery) return transactions

    return transactions.filter(
      (tx) =>
        tx.hash.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tx.type.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [transactions, searchQuery])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="h-4 w-4 rounded-full border-2 border-yellow-500 border-t-transparent"
          />
        )
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const truncateHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Blockchain Verifier</CardTitle>
          </div>
        </div>
        <CardDescription>Verify and track blockchain transactions</CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by hash, asset or type..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="max-h-[200px] overflow-y-auto">
          {loading ? (
            <div className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
            </div>
          ) : filteredTransactions.length > 0 ? (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between rounded-md border p-2"
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <span className="font-mono text-sm">{truncateHash(tx.hash)}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTime(tx.timestamp)}</span>
                      <Badge variant="outline">{tx.type}</Badge>
                    </div>
                  </div>
                  <div className="font-mono font-medium">
                    {tx.amount.toFixed(4)} {tx.asset}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 text-muted-foreground">
              No transactions match your search
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

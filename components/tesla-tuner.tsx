"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Layers, RefreshCw, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useWebSocket } from "@/lib/websocket-context"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"

interface TeslaParameter {
  id: string
  name: string
  value: number
  min: number
  max: number
  step: number
  unit: string
}

export function TeslaTuner() {
  const [loading, setLoading] = useState(true)
  const [optimizing, setOptimizing] = useState(false)
  const [parameters, setParameters] = useState<TeslaParameter[]>([])
  const { sendMessage } = useWebSocket()

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
      setParameters([
        {
          id: "param-1",
          name: "Signal Threshold",
          value: 75,
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
        },
        {
          id: "param-2",
          name: "Execution Speed",
          value: 85,
          min: 0,
          max: 100,
          step: 5,
          unit: "ms",
        },
        {
          id: "param-3",
          name: "Risk Tolerance",
          value: 40,
          min: 0,
          max: 100,
          step: 5,
          unit: "%",
        },
      ])
      setLoading(false)
    }, 1500)
  }, [])

  const handleParameterChange = (id: string, value: number) => {
    setParameters(parameters.map((param) => (param.id === id ? { ...param, value } : param)))

    // Send WebSocket message
    sendMessage({
      action: "update_parameter",
      parameterId: id,
      value,
    })
  }

  const handleOptimize = () => {
    setOptimizing(true)

    // Simulate optimization process
    setTimeout(() => {
      setParameters(
        parameters.map((param) => ({
          ...param,
          value: Math.floor(Math.random() * (param.max - param.min)) + param.min,
        })),
      )
      setOptimizing(false)

      toast({
        title: "Tesla Parameters Optimized",
        description: "Parameters have been automatically tuned for optimal performance",
      })

      // Send WebSocket message
      sendMessage({
        action: "optimize_parameters",
        result: "success",
      })
    }, 2000)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle className="text-sm font-medium">Tesla Tuner</CardTitle>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleOptimize} disabled={optimizing}>
            <RefreshCw className={`h-4 w-4 ${optimizing ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>Fine-tune trading parameters</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading
          ? Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-full" />
                </div>
              ))
          : parameters.map((param) => (
              <div key={param.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium">{param.name}</label>
                  <div className="flex items-center gap-1">
                    <motion.span
                      key={param.value}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs font-mono"
                    >
                      {param.value}
                      {param.unit}
                    </motion.span>
                  </div>
                </div>
                <Slider
                  value={[param.value]}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  onValueChange={(values) => handleParameterChange(param.id, values[0])}
                  disabled={optimizing}
                />
              </div>
            ))}
        <Button className="w-full gap-2" size="sm" onClick={handleOptimize} disabled={optimizing}>
          <Zap className="h-4 w-4" />
          {optimizing ? "Optimizing..." : "Auto-Optimize"}
        </Button>
      </CardContent>
    </Card>
  )
}

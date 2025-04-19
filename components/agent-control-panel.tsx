"use client"

import React from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Cpu, RefreshCw, Settings, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import apiService from "@/lib/api-service"
import { useWebSocket } from "@/lib/websocket-context"

interface Agent {
  id: string
  name: string
  status: "active" | "inactive" | "error"
  type: string
  load: number
  signals: number
}

export function AgentControlPanel() {
  const queryClient = useQueryClient()
  const { connectionStatus, subscribe, unsubscribe } = useWebSocket()

  // Fetch agents data
  const {
    data: agents = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["agents"],
    queryFn: apiService.getAgents,
    staleTime: 30000, // 30 seconds
    refetchInterval: 60000, // 1 minute
    retry: 3,
    refetchOnWindowFocus: true,
  })

  // Subscribe to agent updates via WebSocket
  React.useEffect(() => {
    const onStatus = (data: any) => {
      // Optimistically update the agent status in the cache
      queryClient.setQueryData(["agents"], (old: any) => {
        if (!old) return old
        return old.map((agent: Agent) => {
          if (agent.id === data.agent_id) {
            return { ...agent, status: data.status }
          }
          return agent
        })
      })
    }

    subscribe("agent_updates", onStatus)

    // Add a fallback for when WebSocket is not available
    if (connectionStatus === "disconnected" || connectionStatus === "connecting") {
      // If we're in development or the WebSocket is not connected,
      // we'll use the API directly instead of waiting for WebSocket updates
      const fallbackInterval = setInterval(() => {
        refetch()
      }, 30000) // Refetch every 30 seconds as a fallback

      return () => {
        unsubscribe("agent_updates", onStatus)
        clearInterval(fallbackInterval)
      }
    }

    return () => unsubscribe("agent_updates", onStatus)
  }, [subscribe, unsubscribe, connectionStatus, queryClient, refetch])

  // Toggle agent mutation
  const toggleAgentMutation = useMutation({
    mutationFn: ({ agentId, active }: { agentId: string; active: boolean }) => apiService.toggleAgent(agentId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] })
      toast({
        title: "Agent Updated",
        description: "Agent status has been updated successfully",
      })
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update agent status",
        variant: "destructive",
      })
    },
  })

  const toggleAgentStatus = (agentId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"
    toggleAgentMutation.mutate({
      agentId,
      active: newStatus === "active",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "inactive":
        return "bg-gray-400"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  if (isError) {
    return (
      <Card>
        <CardHeader className="bg-muted/50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle>Agent Control</CardTitle>
          </div>
          <CardDescription>Error loading agents</CardDescription>
        </CardHeader>
        <CardContent className="p-4 text-center">
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "Failed to load agent data"}
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <CardTitle>Agent Control</CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={() => refetch()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription>Manage AI trading agents</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))
            : agents.map((agent) => (
                <div key={agent.id} className="flex items-center justify-between p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)}`} />
                      <span className="font-medium">{agent.name}</span>
                      <Badge variant="outline" className="ml-1">
                        {agent.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div>Load: {agent.load}%</div>
                      <div>Signals: {agent.signals}</div>
                    </div>
                    {agent.status === "active" && <Progress value={agent.load} className="h-1 mt-2" />}
                  </div>
                  <Switch
                    checked={agent.status === "active"}
                    onCheckedChange={() => toggleAgentStatus(agent.id, agent.status)}
                    disabled={toggleAgentMutation.isPending}
                  />
                </div>
              ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between bg-muted/30 py-2">
        <div className="text-xs text-muted-foreground">
          {agents.filter((a) => a.status === "active").length} of {agents.length} agents active
        </div>
        <Button variant="ghost" size="sm">
          <Settings className="mr-2 h-3 w-3" />
          Configure
        </Button>
      </CardFooter>
    </Card>
  )
}

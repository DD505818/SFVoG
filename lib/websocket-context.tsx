"use client"

import type React from "react"
import { createContext, useContext, useEffect, useReducer, useCallback, useRef } from "react"
import { toast } from "@/components/ui/use-toast"

// Define types
type ConnectionStatus = "connected" | "disconnected" | "connecting" | "reconnecting"

interface WebSocketState {
  socket: WebSocket | null
  connectionStatus: ConnectionStatus
  lastMessage: any
  subscriptions: Set<string>
}

type WebSocketAction =
  | { type: "SET_SOCKET"; payload: WebSocket | null }
  | { type: "SET_STATUS"; payload: ConnectionStatus }
  | { type: "SET_MESSAGE"; payload: any }
  | { type: "ADD_SUBSCRIPTION"; payload: string }
  | { type: "REMOVE_SUBSCRIPTION"; payload: string }
  | { type: "CLEAR_SUBSCRIPTIONS" }

interface WebSocketContextType {
  state: WebSocketState
  sendMessage: (message: any) => void
  subscribe: (channel: string) => void
  unsubscribe: (channel: string) => void
}

// Create initial state
const initialState: WebSocketState = {
  socket: null,
  connectionStatus: "disconnected",
  lastMessage: null,
  subscriptions: new Set<string>(),
}

// Create reducer
function webSocketReducer(state: WebSocketState, action: WebSocketAction): WebSocketState {
  switch (action.type) {
    case "SET_SOCKET":
      return { ...state, socket: action.payload }
    case "SET_STATUS":
      return { ...state, connectionStatus: action.payload }
    case "SET_MESSAGE":
      return { ...state, lastMessage: action.payload }
    case "ADD_SUBSCRIPTION":
      return {
        ...state,
        subscriptions: new Set([...state.subscriptions, action.payload]),
      }
    case "REMOVE_SUBSCRIPTION":
      const newSubscriptions = new Set(state.subscriptions)
      newSubscriptions.delete(action.payload)
      return { ...state, subscriptions: newSubscriptions }
    case "CLEAR_SUBSCRIPTIONS":
      return { ...state, subscriptions: new Set() }
    default:
      return state
  }
}

// Create context
const WebSocketContext = createContext<WebSocketContextType>({
  state: initialState,
  sendMessage: () => {},
  subscribe: () => {},
  unsubscribe: () => {},
})

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  // Use reducer instead of multiple useState calls
  const [state, dispatch] = useReducer(webSocketReducer, initialState)

  // Refs for cleanup and tracking
  const isMountedRef = useRef(true)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 5
  const reconnectDelay = 2000

  // Use a ref to avoid dependency cycle while still accessing latest subscriptions
  const subscriptionsRef = useRef(state.subscriptions)

  useEffect(() => {
    subscriptionsRef.current = state.subscriptions
  }, [state.subscriptions])

  const connectWebSocket = useCallback(() => {
    try {
      // Get WebSocket URL from environment variable or use a fallback for development
      const wsUrl =
        process.env.NEXT_PUBLIC_WS_URL ||
        (typeof window !== "undefined" && window.location.origin
          ? `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/ws`
          : null)

      if (!wsUrl) {
        console.error("WebSocket URL not defined in environment variables")
        return
      }

      dispatch({ type: "SET_STATUS", payload: "connecting" })

      const socket = new WebSocket(wsUrl)

      socket.onopen = () => {
        if (!isMountedRef.current) return

        dispatch({ type: "SET_SOCKET", payload: socket })
        dispatch({ type: "SET_STATUS", payload: "connected" })
        reconnectAttemptsRef.current = 0

        // Resubscribe to all channels
        subscriptionsRef.current.forEach((channel) => {
          socket.send(JSON.stringify({ action: "subscribe", channel }))
        })

        toast({
          title: "Connection Established",
          description: "Real-time data feed is now active",
        })
      }

      socket.onclose = () => {
        if (!isMountedRef.current) return

        dispatch({ type: "SET_SOCKET", payload: null })
        dispatch({ type: "SET_STATUS", payload: "disconnected" })

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1
          dispatch({ type: "SET_STATUS", payload: "reconnecting" })

          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              connectWebSocket()
            }
          }, reconnectDelay * reconnectAttemptsRef.current)
        } else {
          toast({
            title: "Connection Lost",
            description: "Unable to reconnect to the data feed",
            variant: "destructive",
          })
        }
      }

      socket.onerror = (error) => {
        if (!isMountedRef.current) return

        console.error("WebSocket error:", error)

        // Don't immediately disconnect on error - let the socket's onclose handle disconnection
        // This prevents duplicate error handling

        // Notify user of connection issues
        toast({
          title: "Connection Issue",
          description: "Experiencing difficulties with real-time data connection",
          variant: "destructive",
        })
      }

      socket.onmessage = (event) => {
        if (!isMountedRef.current) return

        try {
          const message = JSON.parse(event.data)
          dispatch({ type: "SET_MESSAGE", payload: message })
        } catch (error) {
          console.error("Error parsing WebSocket message:", error)
        }
      }
    } catch (error) {
      console.error("Error connecting to WebSocket:", error)
      dispatch({ type: "SET_STATUS", payload: "disconnected" })
    }
  }, [])

  // Connect to WebSocket on mount
  useEffect(() => {
    isMountedRef.current = true

    // For development/testing, use a simulated connection
    if (process.env.NODE_ENV === "development" || !process.env.NEXT_PUBLIC_WS_URL) {
      console.log("Using mock WebSocket connection for development")
      dispatch({ type: "SET_STATUS", payload: "connected" })

      // Create a mock interval to simulate receiving messages
      const mockInterval = setInterval(() => {
        if (isMountedRef.current) {
          // Simulate receiving a message
          const mockMessage = {
            type: "mock",
            timestamp: new Date().toISOString(),
            data: { value: Math.random() },
          }
          dispatch({ type: "SET_MESSAGE", payload: mockMessage })
        }
      }, 10000) // Every 10 seconds

      return () => {
        isMountedRef.current = false
        clearInterval(mockInterval)
      }
    } else {
      connectWebSocket()
    }

    return () => {
      isMountedRef.current = false

      // Clean up WebSocket connection
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
        state.socket.close()
      }

      // Clear any pending reconnect attempts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
    }
  }, [connectWebSocket])

  // Stable action creators
  const sendMessage = useCallback(
    (message: any) => {
      if (state.socket && state.connectionStatus === "connected") {
        state.socket.send(JSON.stringify(message))
      } else {
        console.warn("Cannot send message, socket not connected:", message)
      }
    },
    [state.socket, state.connectionStatus],
  )

  const subscribe = useCallback(
    (channel: string) => {
      dispatch({ type: "ADD_SUBSCRIPTION", payload: channel })

      if (state.socket && state.connectionStatus === "connected") {
        state.socket.send(JSON.stringify({ action: "subscribe", channel }))
      }
    },
    [state.socket, state.connectionStatus],
  )

  const unsubscribe = useCallback(
    (channel: string) => {
      dispatch({ type: "REMOVE_SUBSCRIPTION", payload: channel })

      if (state.socket && state.connectionStatus === "connected") {
        state.socket.send(JSON.stringify({ action: "unsubscribe", channel }))
      }
    },
    [state.socket, state.connectionStatus],
  )

  // Create context value
  const contextValue = {
    state,
    sendMessage,
    subscribe,
    unsubscribe,
  }

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>
}

// Custom hook with backward compatibility
export function useWebSocket() {
  const { state, sendMessage, subscribe, unsubscribe } = useContext(WebSocketContext)

  // Return a shape that matches the old API to avoid changing all components
  return {
    socket: state.socket,
    connectionStatus: state.connectionStatus,
    lastMessage: state.lastMessage,
    sendMessage,
    subscribe,
    unsubscribe,
  }
}

import { toast } from "@/components/ui/use-toast"

// Base API URL - can be overridden with environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Generic fetch wrapper with error handling
async function fetchWithErrorHandling<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      let errorMessage = `API error: ${response.status}`
      try {
        const errorData = await response.json()
        if (errorData && errorData.message) {
          errorMessage = errorData.message
        }
      } catch (e) {
        // If parsing JSON fails, use the default error message
      }
      throw new Error(errorMessage)
    }

    return await response.json()
  } catch (error) {
    console.error(`API request failed: ${url}`, error)

    // Don't show toast for aborted requests (user navigated away)
    if (error instanceof Error && error.name !== "AbortError") {
      toast({
        title: "API Request Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      })
    }

    throw error
  }
}

// API endpoints
export const apiService = {
  // Agents
  getAgents: () => fetchWithErrorHandling<any[]>(`${API_BASE_URL}/agents`),

  toggleAgent: (agentId: string, active: boolean) =>
    fetchWithErrorHandling<any>(`${API_BASE_URL}/agents/${agentId}/toggle`, {
      method: "POST",
      body: JSON.stringify({ active }),
    }),

  // Strategies
  getStrategies: () => fetchWithErrorHandling<any[]>(`${API_BASE_URL}/strategies`),

  toggleStrategy: (strategyId: string, active: boolean) =>
    fetchWithErrorHandling<any>(`${API_BASE_URL}/strategies/${strategyId}/toggle`, {
      method: "POST",
      body: JSON.stringify({ active }),
    }),

  // Capital
  getCapitalAllocation: () => fetchWithErrorHandling<any>(`${API_BASE_URL}/capital`),

  // Transactions
  getTransactions: () => fetchWithErrorHandling<any[]>(`${API_BASE_URL}/transactions`),

  // Feedback
  getFeedback: () => fetchWithErrorHandling<any[]>(`${API_BASE_URL}/feedback`),

  processFeedback: (feedbackId: string, approved: boolean) =>
    fetchWithErrorHandling<any>(`${API_BASE_URL}/feedback/${feedbackId}/process`, {
      method: "POST",
      body: JSON.stringify({ approved }),
    }),

  // Brokers
  getBrokers: () => fetchWithErrorHandling<any[]>(`${API_BASE_URL}/brokers`),

  syncBrokers: () =>
    fetchWithErrorHandling<any>(`${API_BASE_URL}/brokers/sync`, {
      method: "POST",
    }),

  // Tesla parameters
  getTeslaParameters: () => fetchWithErrorHandling<any[]>(`${API_BASE_URL}/tesla/parameters`),

  updateTeslaParameter: (parameterId: string, value: number) =>
    fetchWithErrorHandling<any>(`${API_BASE_URL}/tesla/parameters/${parameterId}`, {
      method: "PUT",
      body: JSON.stringify({ value }),
    }),

  optimizeTeslaParameters: () =>
    fetchWithErrorHandling<any>(`${API_BASE_URL}/tesla/optimize`, {
      method: "POST",
    }),
}

// Mock API for development
export const mockApiService = {
  getAgents: async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return [
      { id: "agent-1", name: "Quantum Resonance", status: "active", type: "HF", load: 78, signals: 42 },
      { id: "agent-2", name: "Sentiment Amplifier", status: "active", type: "ML", load: 65, signals: 27 },
      { id: "agent-3", name: "Volatility Harvester", status: "inactive", type: "AI", load: 0, signals: 0 },
      { id: "agent-4", name: "Strategy Evolver", status: "error", type: "GA", load: 95, signals: 13 },
    ]
  },

  // Add other mock implementations as needed
}

// Export the appropriate service based on environment
export default process.env.NODE_ENV === "development" ? mockApiService : apiService

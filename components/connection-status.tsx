import { Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ConnectionStatusProps {
  status: "connected" | "disconnected" | "connecting" | "reconnecting"
}

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  const getStatusDetails = () => {
    switch (status) {
      case "connected":
        return {
          icon: Wifi,
          color: "bg-green-500",
          label: "Connected",
          description: "Real-time data feed active",
        }
      case "disconnected":
        return {
          icon: WifiOff,
          color: "bg-red-500",
          label: "Disconnected",
          description: "No connection to data feed",
        }
      case "connecting":
        return {
          icon: Wifi,
          color: "bg-yellow-500",
          label: "Connecting",
          description: "Establishing connection...",
        }
      case "reconnecting":
        return {
          icon: Wifi,
          color: "bg-yellow-500",
          label: "Reconnecting",
          description: "Attempting to reconnect...",
        }
    }
  }

  const { icon: Icon, color, label, description } = getStatusDetails()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="gap-1 px-2 py-1">
            <span className={`h-2 w-2 rounded-full ${color}`} />
            <span className="text-xs">{label}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <span>{description}</span>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

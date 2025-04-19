import { Suspense } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AgentControlPanel } from "@/components/agent-control-panel"
import { KpiMetrics } from "@/components/kpi-metrics"
import { StrategyConsole } from "@/components/strategy-console"
import { AlphaFeed } from "@/components/alpha-feed"
import { BlockchainVerifier } from "@/components/blockchain-verifier"
import { TeslaTuner } from "@/components/tesla-tuner"
import { CapitalMatrix } from "@/components/capital-matrix"
import { FeedbackLoop } from "@/components/feedback-loop"
import { BrokerSync } from "@/components/broker-sync"
import { CommandMenu } from "@/components/command-menu"
import { PerformanceMonitor } from "@/components/performance-monitor"
import { Skeleton } from "@/components/ui/skeleton"

// Loading fallbacks
const AgentSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-[200px] w-full" />
  </div>
)

const MetricsSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-8 w-36" />
    <Skeleton className="h-[120px] w-full" />
  </div>
)

const StrategySkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-[300px] w-full" />
  </div>
)

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-4 p-4 h-full">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Suspense fallback={<AgentSkeleton />}>
            <AgentControlPanel />
          </Suspense>
          <Suspense fallback={<MetricsSkeleton />}>
            <KpiMetrics />
          </Suspense>
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            }
          >
            <CapitalMatrix />
          </Suspense>
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            }
          >
            <PerformanceMonitor />
          </Suspense>
        </div>

        {/* Middle Column */}
        <div className="col-span-12 lg:col-span-6 space-y-4">
          <Suspense fallback={<StrategySkeleton />}>
            <StrategyConsole />
          </Suspense>
          <div className="grid grid-cols-2 gap-4">
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-[200px] w-full" />
                </div>
              }
            >
              <TeslaTuner />
            </Suspense>
            <Suspense
              fallback={
                <div className="space-y-2">
                  <Skeleton className="h-8 w-36" />
                  <Skeleton className="h-[200px] w-full" />
                </div>
              }
            >
              <FeedbackLoop />
            </Suspense>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-[250px] w-full" />
              </div>
            }
          >
            <AlphaFeed />
          </Suspense>
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-[200px] w-full" />
              </div>
            }
          >
            <BlockchainVerifier />
          </Suspense>
          <Suspense
            fallback={
              <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-[150px] w-full" />
              </div>
            }
          >
            <BrokerSync />
          </Suspense>
        </div>
      </div>

      <CommandMenu />
    </DashboardLayout>
  )
}

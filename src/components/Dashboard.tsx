import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, DollarSign, Percent, Brain, Zap, TrendingUp } from 'lucide-react';
import { Performance } from '../types/trading';
import AgentPerformanceChart from './charts/AgentPerformanceChart';
import ProfitMetrics from './metrics/ProfitMetrics';
import ActiveAgentsGrid from './agents/ActiveAgentsGrid';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="tech-panel">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-indigo-600/10 rounded-lg">
              <DollarSign className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +24.5%
            </span>
          </div>
          <h3 className="text-sm text-gray-400">Total Profit</h3>
          <p className="text-2xl font-bold text-white mt-1">$158,942.67</p>
        </div>

        <div className="tech-panel">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-indigo-600/10 rounded-lg">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-indigo-400 text-sm">12 Active</span>
          </div>
          <h3 className="text-sm text-gray-400">AI Agents</h3>
          <p className="text-2xl font-bold text-white mt-1">92% Success</p>
        </div>

        <div className="tech-panel">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-indigo-600/10 rounded-lg">
              <Activity className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-indigo-400 text-sm">Real-time</span>
          </div>
          <h3 className="text-sm text-gray-400">Win Rate</h3>
          <p className="text-2xl font-bold text-white mt-1">78.5%</p>
        </div>

        <div className="tech-panel">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-indigo-600/10 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-indigo-400 text-sm">24h Volume</span>
          </div>
          <h3 className="text-sm text-gray-400">Trading Volume</h3>
          <p className="text-2xl font-bold text-white mt-1">$2.8M</p>
        </div>
      </div>

      {/* Main Performance Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 tech-panel">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Performance Overview</h2>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-sm">
                +18.4% This Month
              </span>
            </div>
          </div>
          <div className="h-80">
            <AgentPerformanceChart />
          </div>
        </div>

        {/* Top Performing Agents */}
        <div className="tech-panel">
          <h2 className="text-lg font-semibold text-white mb-4">Top Agents</h2>
          <div className="space-y-4">
            {/* Add agent cards here */}
          </div>
        </div>
      </div>

      {/* Active Agents Grid */}
      <div className="tech-panel">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Active Trading Agents</h2>
          <button className="tech-button">
            Manage Agents
          </button>
        </div>
        <ActiveAgentsGrid />
      </div>
    </div>
  );
}
import React from 'react';
import { DollarSign, TrendingUp, Activity, BarChart2 } from 'lucide-react';
import type { Performance } from '../../types/trading';

const mockPerformance: Performance = {
  daily: 2.45,
  weekly: 8.72,
  monthly: 24.56,
  total: 158942.67,
  trades: 1247,
  winRate: 0.785
};

export default function ProfitMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-purple-900/90 to-blue-900/90 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <DollarSign className="w-6 h-6 text-purple-300" />
          </div>
          <span className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{mockPerformance.monthly}%
          </span>
        </div>
        <h3 className="text-sm text-gray-300">Total Profit</h3>
        <p className="text-2xl font-bold text-white mt-1">
          ${mockPerformance.total.toLocaleString()}
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-900/90 to-cyan-900/90 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <Activity className="w-6 h-6 text-blue-300" />
          </div>
          <span className="text-blue-300 text-sm">Last 24h</span>
        </div>
        <h3 className="text-sm text-gray-300">Daily Performance</h3>
        <p className="text-2xl font-bold text-white mt-1">+{mockPerformance.daily}%</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-900/90 to-teal-900/90 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <BarChart2 className="w-6 h-6 text-emerald-300" />
          </div>
          <span className="text-emerald-300 text-sm">7 Days</span>
        </div>
        <h3 className="text-sm text-gray-300">Weekly Growth</h3>
        <p className="text-2xl font-bold text-white mt-1">+{mockPerformance.weekly}%</p>
      </div>

      <div className="bg-gradient-to-br from-amber-900/90 to-orange-900/90 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <div className="p-2 bg-white/10 rounded-lg">
            <TrendingUp className="w-6 h-6 text-amber-300" />
          </div>
          <span className="text-amber-300 text-sm">{mockPerformance.trades} Trades</span>
        </div>
        <h3 className="text-sm text-gray-300">Win Rate</h3>
        <p className="text-2xl font-bold text-white mt-1">
          {(mockPerformance.winRate * 100).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}
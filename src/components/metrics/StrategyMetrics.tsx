import React from 'react';
import { Brain, Zap, TrendingUp, BarChart2 } from 'lucide-react';

interface StrategyMetric {
  name: string;
  type: string;
  performance: number;
  trades: number;
  winRate: number;
  status: 'active' | 'paused' | 'optimizing';
}

const mockStrategies: StrategyMetric[] = [
  {
    name: 'Quantum Momentum',
    type: 'trend',
    performance: 28.4,
    trades: 342,
    winRate: 0.82,
    status: 'active'
  },
  {
    name: 'Neural Breakout',
    type: 'breakout',
    performance: 22.6,
    trades: 256,
    winRate: 0.78,
    status: 'active'
  },
  {
    name: 'Mean Reversion AI',
    type: 'reversion',
    performance: 18.9,
    trades: 189,
    winRate: 0.75,
    status: 'optimizing'
  }
];

export default function StrategyMetrics() {
  return (
    <div className="space-y-4">
      {mockStrategies.map((strategy, index) => (
        <div 
          key={index}
          className="bg-gray-900/50 rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-900/30 rounded-lg">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
                <p className="text-sm text-gray-400">{strategy.type.toUpperCase()}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2
              ${strategy.status === 'active' 
                ? 'bg-green-900/30 text-green-400' 
                : strategy.status === 'paused'
                ? 'bg-yellow-900/30 text-yellow-400'
                : 'bg-blue-900/30 text-blue-400'}`}
            >
              <Zap className="w-4 h-4" />
              {strategy.status}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Performance</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-xl font-bold text-white">+{strategy.performance}%</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Trades</span>
                <BarChart2 className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-xl font-bold text-white">{strategy.trades}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Win Rate</span>
                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-blue-400" />
              </div>
              <p className="text-xl font-bold text-white">
                {(strategy.winRate * 100).toFixed(1)}%
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                style={{ width: `${strategy.winRate * 100}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
import React from 'react';
import { useRiskMetrics } from '../../hooks/useRiskMetrics';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

export default function RiskMetrics() {
  const metrics = useRiskMetrics();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Volatility</span>
          {metrics.volatility > 0.2 ? (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          ) : (
            <TrendingUp className="w-4 h-4 text-green-500" />
          )}
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {(metrics.volatility * 100).toFixed(2)}%
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Sharpe Ratio</span>
          {metrics.sharpeRatio > 1.5 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {metrics.sharpeRatio.toFixed(2)}
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Max Drawdown</span>
          {metrics.maxDrawdown > 0.15 ? (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          ) : (
            <TrendingUp className="w-4 h-4 text-green-500" />
          )}
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {(metrics.maxDrawdown * 100).toFixed(2)}%
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Win Rate</span>
          {metrics.winRate > 0.6 ? (
            <TrendingUp className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-500" />
          )}
        </div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          {(metrics.winRate * 100).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}
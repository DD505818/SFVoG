import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Brain } from 'lucide-react';
import { useMarketAlerts } from '../../hooks/useMarketAlerts';

export default function MarketAlerts() {
  const { alerts } = useMarketAlerts();

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div 
          key={alert.id} 
          className={`p-4 rounded-lg border ${
            alert.type === 'positive'
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : alert.type === 'negative'
              ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'
              : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
          }`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {alert.type === 'positive' ? (
                <TrendingUp className="w-5 h-5 text-green-500" />
              ) : alert.type === 'negative' ? (
                <TrendingDown className="w-5 h-5 text-red-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              )}
            </div>
            <div className="ml-3 flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`text-sm font-medium ${
                  alert.type === 'positive'
                    ? 'text-green-800 dark:text-green-200'
                    : alert.type === 'negative'
                    ? 'text-red-800 dark:text-red-200'
                    : 'text-yellow-800 dark:text-yellow-200'
                }`}>
                  {alert.title}
                </h3>
                {alert.aiGenerated && (
                  <Brain className="w-4 h-4 text-purple-500 ml-2" />
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {alert.message}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
                {alert.confidence && (
                  <span className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-full">
                    {alert.confidence}% confidence
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
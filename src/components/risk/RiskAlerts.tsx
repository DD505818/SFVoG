import React from 'react';
import { useRiskAlerts } from '../../hooks/useRiskAlerts';
import { AlertTriangle } from 'lucide-react';

export default function RiskAlerts() {
  const { alerts } = useRiskAlerts();

  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div 
          key={alert.id}
          className={`p-4 rounded-lg ${
            alert.level === 'high'
              ? 'bg-red-50 dark:bg-red-900/20'
              : alert.level === 'medium'
              ? 'bg-yellow-50 dark:bg-yellow-900/20'
              : 'bg-blue-50 dark:bg-blue-900/20'
          }`}
        >
          <div className="flex items-center">
            <AlertTriangle className={`w-5 h-5 mr-3 ${
              alert.level === 'high'
                ? 'text-red-500'
                : alert.level === 'medium'
                ? 'text-yellow-500'
                : 'text-blue-500'
            }`} />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {alert.message}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
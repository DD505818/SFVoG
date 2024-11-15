import React from 'react';
import { Shield, AlertTriangle, TrendingDown } from 'lucide-react';
import RiskMetrics from './RiskMetrics';
import RiskAlerts from './RiskAlerts';

export default function RiskManagement() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Risk Management
        </h2>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Emergency Stop
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Metrics</h3>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <RiskMetrics />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Risk Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <RiskAlerts />
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Globe, TrendingUp, AlertTriangle, Brain, ChartLine } from 'lucide-react';
import MarketChart from './MarketChart';
import MarketAlerts from './MarketAlerts';

export default function MarketOverview() {
  return (
    <div className="p-6">
      {/* Market Wisdom Banner */}
      <div className="mb-6 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <Brain className="w-6 h-6 text-purple-300" />
          <h3 className="text-lg font-medium">Market Insight</h3>
        </div>
        <p className="text-purple-100 italic">
          "The market is a reflection of collective consciousness. True mastery comes from understanding both data and intuition."
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Globe className="w-6 h-6" />
          Market Overview
        </h2>
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2 shadow-lg">
            <ChartLine className="w-4 h-4" />
            Advanced Analysis
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Market Performance
            </h3>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-lg text-sm">
                Live Data
              </span>
            </div>
          </div>
          <div className="h-80">
            <MarketChart />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-purple-500" />
              Market Alerts
            </h3>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-lg text-sm">
                Real-time
              </span>
            </div>
          </div>
          <MarketAlerts />
        </div>
      </div>

      {/* Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Market Sentiment</h4>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Bullish</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">AI Confidence</h4>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">92%</span>
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Trading Volume</h4>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">$2.8M</span>
            <ChartLine className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
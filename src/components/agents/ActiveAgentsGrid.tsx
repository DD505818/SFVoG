import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  performance: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  trades: number;
  successRate: number;
}

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Quantum Analysis',
    type: 'quantum',
    status: 'active',
    performance: {
      daily: 2.4,
      weekly: 8.7,
      monthly: 24.5
    },
    trades: 156,
    successRate: 92
  },
  {
    id: '2',
    name: 'Deep Learning Oracle',
    type: 'ml',
    status: 'active',
    performance: {
      daily: 1.8,
      weekly: 6.5,
      monthly: 18.2
    },
    trades: 234,
    successRate: 88
  },
  {
    id: '3',
    name: 'Sentiment Fusion',
    type: 'nlp',
    status: 'active',
    performance: {
      daily: 1.2,
      weekly: 5.8,
      monthly: 15.4
    },
    trades: 189,
    successRate: 85
  },
  {
    id: '4',
    name: 'Market Pattern Recognition',
    type: 'technical',
    status: 'active',
    performance: {
      daily: 1.5,
      weekly: 7.2,
      monthly: 21.8
    },
    trades: 312,
    successRate: 90
  }
];

export default function ActiveAgentsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {mockAgents.map((agent) => (
        <div 
          key={agent.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
              ${agent.status === 'active' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                : agent.status === 'paused'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
              <Activity className="w-3 h-3" />
              {agent.status}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            {agent.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {agent.type.toUpperCase()}
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Success Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${agent.successRate}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {agent.successRate}%
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Trades</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {agent.trades}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Performance</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  +{agent.performance.monthly}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    style={{ width: `${(agent.performance.monthly / 30) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">30d</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
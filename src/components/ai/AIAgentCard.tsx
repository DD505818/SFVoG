import React from 'react';
import { Brain, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import type { AIAgent } from '../../services/ai/types';

interface AIAgentCardProps {
  agent: AIAgent;
}

export default function AIAgentCard({ agent }: AIAgentCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
            <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{agent.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{agent.type.toUpperCase()}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
          ${agent.status === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
            : agent.status === 'loading' 
            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
          {agent.status === 'active' && <Zap className="w-3 h-3" />}
          {agent.status}
        </span>
      </div>

      {agent.lastPrediction && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last Insight</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(agent.lastPrediction.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className={`w-5 h-5 ${
              agent.lastPrediction.action === 'buy' ? 'text-green-500' :
              agent.lastPrediction.action === 'sell' ? 'text-red-500' : 'text-yellow-500'
            }`} />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {agent.lastPrediction.action.toUpperCase()} {agent.lastPrediction.asset}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Confidence
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-24 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className="bg-purple-600 h-2 rounded-full" 
                  style={{ width: `${agent.lastPrediction.confidence * 100}%` }}
                ></div>
              </div>
              <span className="text-purple-600 dark:text-purple-400">
                {(agent.lastPrediction.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
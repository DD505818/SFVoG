import React from 'react';
import AIAgentCard from './AIAgentCard';
import type { AIAgent } from '../../services/ai/types';
import { Brain } from 'lucide-react';

const mockAgents: AIAgent[] = [
  {
    id: '1',
    name: 'Quantum Analysis Agent',
    type: 'quantum',
    status: 'active',
    lastPrediction: {
      timestamp: Date.now() - 300000,
      confidence: 0.92,
      action: 'buy',
      asset: 'BTC/USD'
    }
  },
  {
    id: '2',
    name: 'Deep Learning Oracle',
    type: 'deep-learning',
    status: 'active',
    lastPrediction: {
      timestamp: Date.now() - 600000,
      confidence: 0.88,
      action: 'sell',
      asset: 'ETH/USD'
    }
  },
  {
    id: '3',
    name: 'Sentiment Fusion Agent',
    type: 'sentiment',
    status: 'active',
    lastPrediction: {
      timestamp: Date.now() - 900000,
      confidence: 0.85,
      action: 'hold',
      asset: 'SOL/USD'
    }
  },
  {
    id: '4',
    name: 'Quantum Entanglement Agent',
    type: 'quantum',
    status: 'active',
    lastPrediction: {
      timestamp: Date.now() - 1200000,
      confidence: 0.95,
      action: 'buy',
      asset: 'MATIC/USD'
    }
  }
];

export default function AIAgentList() {
  return (
    <div className="p-6">
      {/* Wisdom Banner */}
      <div className="mb-6 bg-gradient-to-r from-purple-900/90 to-indigo-900/90 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center space-x-3 mb-3">
          <Brain className="w-6 h-6 text-purple-300" />
          <h3 className="text-lg font-medium">Quantum Wisdom</h3>
        </div>
        <p className="text-purple-100 italic">
          "In the quantum realm of trading, possibilities exist in superposition. True enlightenment comes from understanding both classical and quantum patterns."
        </p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Brain className="w-6 h-6 text-purple-500" />
          AI Trading Agents
        </h2>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-lg text-sm">
            Quantum Coherence: 95%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockAgents.map(agent => (
          <AIAgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Agent Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quantum State</h4>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Coherent</span>
            <Brain className="w-5 h-5 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Entanglement</h4>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">Optimal</span>
            <Brain className="w-5 h-5 text-purple-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 dark:bg-gray-800 border border-purple-100 dark:border-purple-900/20">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Quantum Edge</h4>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">97%</span>
            <Brain className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
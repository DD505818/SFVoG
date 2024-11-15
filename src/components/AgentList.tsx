import React from 'react';
import { Play, Pause, AlertTriangle } from 'lucide-react';
import { Agent } from '../types/trading';

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Crypto Arbitrage Agent',
    type: 'crypto',
    status: 'active',
    profit: 12456.78,
    trades: 245,
    winRate: 72.4,
    allocation: 20
  },
  {
    id: '2',
    name: 'Options Trading Agent',
    type: 'options',
    status: 'active',
    profit: 8234.56,
    trades: 156,
    winRate: 65.8,
    allocation: 15
  },
  {
    id: '3',
    name: 'Forex Sentiment Agent',
    type: 'forex',
    status: 'error',
    profit: -234.12,
    trades: 89,
    winRate: 48.2,
    allocation: 10
  },
  {
    id: '4',
    name: 'DeFi Yield Optimization',
    type: 'defi',
    status: 'paused',
    profit: 4567.89,
    trades: 34,
    winRate: 88.2,
    allocation: 25
  }
];

export default function AgentList() {
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Trading Agents</h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Trades
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Win Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Allocation
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {mockAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{agent.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{agent.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${agent.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        agent.status === 'paused' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                      {agent.status === 'active' ? <Play className="w-3 h-3 mr-1" /> :
                        agent.status === 'paused' ? <Pause className="w-3 h-3 mr-1" /> :
                          <AlertTriangle className="w-3 h-3 mr-1" />}
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${agent.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      ${agent.profit.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {agent.trades}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-600">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${agent.winRate}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{agent.winRate}%</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {agent.allocation}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
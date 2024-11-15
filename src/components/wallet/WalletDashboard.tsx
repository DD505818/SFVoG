import React from 'react';
import { Wallet, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Asset } from '../../types/trading';
import { useWallet } from '../../hooks/useWallet';

export default function WalletDashboard() {
  const { wallet } = useWallet();

  const renderAssetDistribution = (assets: Asset[]) => {
    const total = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    return (
      <div className="space-y-2">
        {assets.map((asset) => (
          <div key={asset.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {asset.symbol}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {((asset.value / total) * 100).toFixed(1)}%
              </span>
              <span className={`text-xs flex items-center ${
                asset.change24h >= 0
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}>
                {asset.change24h >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {Math.abs(asset.change24h)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Wallet className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Balance</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          ${wallet.balance.toLocaleString()}
        </p>
        <div className="mt-2 flex items-center gap-1 text-green-500">
          <ArrowUpRight className="w-4 h-4" />
          <span className="text-sm">+{wallet.performance24h}%</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Performance</span>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Daily</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">+2.4%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Weekly</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">+8.7%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">Monthly</span>
            <span className="text-sm font-medium text-gray-900 dark:text-white">+24.5%</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <PieChart className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Asset Distribution</span>
        </div>
        {wallet.assets && renderAssetDistribution(wallet.assets)}
      </div>
    </div>
  );
}
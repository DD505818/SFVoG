import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useMarketData } from '../../hooks/useMarketData';
import { Clock, TrendingUp } from 'lucide-react';

const timeframes = ['1H', '4H', '1D', '1W', '1M'] as const;
type Timeframe = typeof timeframes[number];

export default function MarketChart() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const { data, isLoading } = useMarketData(selectedTimeframe);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div className="flex space-x-1">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  selectedTimeframe === timeframe
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span className="text-sm text-green-500">+2.45%</span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              className="dark:stroke-gray-700"
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              className="dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              className="dark:text-gray-400"
              tick={{ fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              width={60}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgb(31, 41, 55)',
                border: 'none',
                borderRadius: '0.5rem',
                color: 'white',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              verticalAlign="top"
              height={36}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="btc" 
              stroke="#ff9f00" 
              name="BTC/USD"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="eth" 
              stroke="#3b82f6" 
              name="ETH/USD"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="sp500" 
              stroke="#10b981" 
              name="S&P 500"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
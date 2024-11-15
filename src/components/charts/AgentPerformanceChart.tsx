import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
  quantum: Math.random() * 30 + 70,
  deepLearning: Math.random() * 25 + 65,
  sentiment: Math.random() * 20 + 60,
  ensemble: Math.random() * 22 + 62
}));

export default function AgentPerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={mockData}>
        <CartesianGrid 
          strokeDasharray="3 3" 
          className="dark:stroke-gray-700"
          vertical={false}
        />
        <XAxis 
          dataKey="date" 
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
          dataKey="quantum" 
          stroke="#8b5cf6" 
          name="Quantum Agent"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="deepLearning" 
          stroke="#3b82f6" 
          name="Deep Learning"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="sentiment" 
          stroke="#10b981" 
          name="Sentiment Analysis"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="ensemble" 
          stroke="#f59e0b" 
          name="Ensemble Strategy"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
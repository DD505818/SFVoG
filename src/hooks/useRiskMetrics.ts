import { useState, useEffect } from 'react';
import type { RiskMetrics } from '../services/trading/types';

export function useRiskMetrics() {
  const [metrics, setMetrics] = useState<RiskMetrics>({
    volatility: 0,
    sharpeRatio: 0,
    maxDrawdown: 0,
    winRate: 0
  });

  useEffect(() => {
    // Simulate real-time risk metrics
    const updateMetrics = () => {
      setMetrics({
        volatility: 0.15 + Math.random() * 0.1,
        sharpeRatio: 1.8 + Math.random() * 0.4,
        maxDrawdown: 0.12 + Math.random() * 0.05,
        winRate: 0.68 + Math.random() * 0.1
      });
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
}
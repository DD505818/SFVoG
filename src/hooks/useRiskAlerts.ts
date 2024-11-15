import { useState, useEffect } from 'react';

interface RiskAlert {
  id: string;
  level: 'high' | 'medium' | 'low';
  message: string;
  timestamp: number;
}

export function useRiskAlerts() {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);

  useEffect(() => {
    // Simulate real-time risk alerts
    const mockAlerts: RiskAlert[] = [
      {
        id: '1',
        level: 'high',
        message: 'Portfolio exposure exceeds risk threshold',
        timestamp: Date.now() - 300000
      },
      {
        id: '2',
        level: 'medium',
        message: 'Increased market volatility detected',
        timestamp: Date.now() - 600000
      }
    ];

    setAlerts(mockAlerts);
  }, []);

  return { alerts };
}
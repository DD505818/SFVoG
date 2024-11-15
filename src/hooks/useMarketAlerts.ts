import { useState, useEffect } from 'react';

interface Alert {
  id: string;
  type: 'positive' | 'negative' | 'warning';
  title: string;
  message: string;
  timestamp: number;
  aiGenerated: boolean;
  confidence?: number;
}

export function useMarketAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    let mounted = true;

    const mockAlerts: Alert[] = [
      {
        id: '1',
        type: 'positive',
        title: 'BTC Breakout Detected',
        message: 'Bitcoin price breaks above key resistance level at $45,000',
        timestamp: Date.now() - 300000,
        aiGenerated: true,
        confidence: 92
      },
      {
        id: '2',
        type: 'warning',
        title: 'Market Volatility Alert',
        message: 'Increased market volatility detected across major pairs',
        timestamp: Date.now() - 600000,
        aiGenerated: true,
        confidence: 88
      },
      {
        id: '3',
        type: 'negative',
        title: 'Risk Level Elevated',
        message: 'Market conditions indicate increased risk. Consider adjusting positions.',
        timestamp: Date.now() - 900000,
        aiGenerated: true,
        confidence: 85
      }
    ];

    const timeoutId = setTimeout(() => {
      if (mounted) {
        setAlerts(mockAlerts);
      }
    }, 1000);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return { alerts };
}
import { useState, useEffect } from 'react';

interface MarketDataPoint {
  time: string;
  btc: number;
  eth: number;
  sp500: number;
}

export function useMarketData(timeframe: string) {
  const [data, setData] = useState<MarketDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const generateMockData = () => {
      const now = new Date();
      const points: MarketDataPoint[] = [];
      
      for (let i = 0; i < 24; i++) {
        const time = new Date(now.getTime() - i * 3600000);
        points.push({
          time: time.toLocaleTimeString(),
          btc: 40000 + Math.random() * 2000,
          eth: 2200 + Math.random() * 100,
          sp500: 4800 + Math.random() * 50
        });
      }
      
      return points.reverse();
    };

    const fetchData = () => {
      if (!mounted) return;
      
      setIsLoading(true);
      // Simulate API call delay
      const timeoutId = setTimeout(() => {
        if (mounted) {
          setData(generateMockData());
          setIsLoading(false);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    };

    const cleanup = fetchData();
    const intervalId = setInterval(fetchData, 30000); // Update every 30 seconds

    return () => {
      mounted = false;
      clearInterval(intervalId);
      if (cleanup) cleanup();
    };
  }, [timeframe]);

  return { data, isLoading };
}
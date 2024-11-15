export interface BacktestResult {
  finalCapital: number;
  totalTrades: number;
  metrics: PerformanceMetrics;
  trades: any[];
}

export interface PerformanceMetrics {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  returns: number[];
  winningTrades: number;
  losingTrades: number;
  totalReturn?: number;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  confidence: number;
}
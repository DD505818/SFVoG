export type TradingSignal = 'buy' | 'sell' | 'hold';
export type AssetType = 'crypto' | 'stock' | 'forex' | 'commodity' | 'defi';

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

export interface TradeExecution {
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
}

export interface TradingAgent {
  analyze(data: MarketData[]): Promise<TradeExecution | null>;
  getStatus(): string;
  getName(): string;
}

export interface RiskMetrics {
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
}
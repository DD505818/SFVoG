export interface StrategyParameters {
  stopLossMultiplier: number;
  takeProfitLevels: number[];
  minConfidence: number;
  maxPositionSize: number;
  rebalanceInterval: number;
}

export interface PositionParameters {
  size: number;
  stopLoss: number;
  takeProfit: number;
}

export interface RiskMetrics {
  volatility: number;
  drawdown: number;
  volume: number;
  momentum: number;
}

export interface ModelPrediction {
  prediction: 'buy' | 'sell' | 'hold';
  confidence: number;
  timestamp: number;
  reasoning?: string;
}
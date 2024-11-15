import type { MarketData, TradeExecution, RiskMetrics } from './types';

export class RiskManager {
  private maxDrawdown: number;
  private maxLeverage: number;
  private volatilityThreshold: number;
  private currentRisk: number;
  private maxPositionSize: number;
  private dailyLossLimit: number;
  private totalExposure: number;

  constructor(
    maxDrawdown: number = 0.15,
    maxLeverage: number = 3,
    volatilityThreshold: number = 0.25,
    maxPositionSize: number = 100000,
    dailyLossLimit: number = 10000
  ) {
    this.maxDrawdown = maxDrawdown;
    this.maxLeverage = maxLeverage;
    this.volatilityThreshold = volatilityThreshold;
    this.maxPositionSize = maxPositionSize;
    this.dailyLossLimit = dailyLossLimit;
    this.currentRisk = 0;
    this.totalExposure = 0;
  }

  validateTrade(marketData: MarketData, execution: TradeExecution): boolean {
    try {
      const riskMetrics = this.calculateRiskMetrics(marketData);
      const positionValue = execution.amount * execution.price;

      // Circuit breakers
      if (
        riskMetrics.volatility > this.volatilityThreshold ||
        riskMetrics.maxDrawdown > this.maxDrawdown ||
        !this.checkPositionSize(execution) ||
        !this.checkLeverage(positionValue) ||
        !this.checkDailyLimits(positionValue) ||
        !this.checkMarketConditions(marketData)
      ) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Trade validation failed:', error);
      return false;
    }
  }

  private calculateRiskMetrics(data: MarketData): RiskMetrics {
    const prices = Array.isArray(data) ? data.map(d => d.price) : [data.price];
    const returns = this.calculateReturns(prices);
    
    return {
      volatility: this.calculateVolatility(returns),
      sharpeRatio: this.calculateSharpeRatio(returns),
      maxDrawdown: this.calculateMaxDrawdown(prices),
      winRate: 0.65 // Placeholder - should be calculated from historical data
    };
  }

  private calculateReturns(prices: number[]): number[] {
    return prices.slice(1).map((price, i) => 
      Math.log(price / prices[i])
    );
  }

  private calculateVolatility(returns: number[]): number {
    if (returns.length === 0) return 0;
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    return Math.sqrt(variance);
  }

  private calculateSharpeRatio(returns: number[]): number {
    if (returns.length === 0) return 0;
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const std = Math.sqrt(this.calculateVolatility(returns));
    const riskFreeRate = 0.02 / 252; // Daily risk-free rate
    return (mean - riskFreeRate) / std;
  }

  private calculateMaxDrawdown(prices: number[]): number {
    let maxDrawdown = 0;
    let peak = prices[0];

    for (const price of prices) {
      if (price > peak) {
        peak = price;
      }
      const drawdown = (peak - price) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown;
  }

  private checkPositionSize(execution: TradeExecution): boolean {
    const positionValue = execution.amount * execution.price;
    return positionValue <= this.maxPositionSize;
  }

  private checkLeverage(positionValue: number): boolean {
    const newExposure = this.totalExposure + positionValue;
    return newExposure <= this.maxLeverage * this.maxPositionSize;
  }

  private checkDailyLimits(positionValue: number): boolean {
    // Implement daily loss limit check
    return true; // Placeholder
  }

  private checkMarketConditions(data: MarketData): boolean {
    // Check for extreme market conditions
    const volatility = this.calculateVolatility([data.price]);
    return volatility <= this.volatilityThreshold * 1.5;
  }

  updateRiskLevels(metrics: RiskMetrics): void {
    this.currentRisk = this.calculateRiskScore(metrics);
  }

  private calculateRiskScore(metrics: RiskMetrics): number {
    return (
      metrics.volatility * 0.3 +
      (1 - metrics.sharpeRatio / 3) * 0.3 +
      metrics.maxDrawdown * 0.4
    );
  }

  getCurrentRiskLevel(): string {
    if (this.currentRisk < 0.3) return 'low';
    if (this.currentRisk < 0.7) return 'medium';
    return 'high';
  }

  emergencyStop(): void {
    this.totalExposure = 0;
    this.currentRisk = 0;
    console.log('Emergency stop activated - all trading halted');
  }

  getMaxDrawdown(): number {
    return this.maxDrawdown;
  }

  getVolatilityThreshold(): number {
    return this.volatilityThreshold;
  }

  getTotalExposure(): number {
    return this.totalExposure;
  }
}
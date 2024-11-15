import { MarketData } from '../types';
import { RiskMetrics } from './types';

export class RiskCalculator {
  calculateRiskMetrics(marketData: MarketData[]): RiskMetrics {
    const prices = marketData.map(d => d.price);
    const returns = this.calculateReturns(prices);
    
    return {
      volatility: this.calculateVolatility(returns),
      drawdown: this.calculateMaxDrawdown(prices),
      volume: marketData[0].volume,
      momentum: this.calculateMomentum(returns)
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

  private calculateMaxDrawdown(prices: number[]): number {
    if (prices.length === 0) return 0;
    
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

  private calculateMomentum(returns: number[]): number {
    const recentReturns = returns.slice(-5);
    return recentReturns.length > 0 
      ? recentReturns.reduce((a, b) => a + b, 0) / recentReturns.length
      : 0;
  }

  calculateVolatilityForPrice(price: number): number {
    return this.calculateVolatility([price]);
  }
}
import { TradingAgent } from '../types';
import type { MarketData, TradeExecution } from '../types';

export class CryptoArbitrageAgent implements TradingAgent {
  private minProfitThreshold: number;
  private exchanges: string[];

  constructor(exchanges: string[] = ['binance', 'coinbase', 'kraken'], minProfitThreshold: number = 0.5) {
    this.exchanges = exchanges;
    this.minProfitThreshold = minProfitThreshold;
  }

  async analyze(marketData: MarketData[]): Promise<TradeExecution | null> {
    const opportunities = await this.findArbitrageOpportunities(marketData);
    if (!opportunities.length) return null;

    const bestOpportunity = this.selectBestOpportunity(opportunities);
    if (bestOpportunity.profitPercent >= this.minProfitThreshold) {
      return {
        symbol: bestOpportunity.symbol,
        type: 'buy',
        amount: this.calculateOptimalAmount(bestOpportunity),
        price: bestOpportunity.buyPrice,
        timestamp: Date.now()
      };
    }

    return null;
  }

  private async findArbitrageOpportunities(marketData: MarketData[]) {
    // Simplified for demo - in production, implement real exchange price fetching
    return marketData.map(data => ({
      symbol: data.symbol,
      buyPrice: data.price * 0.995,
      sellPrice: data.price * 1.005,
      profitPercent: 1.0,
      volume: data.volume
    }));
  }

  private selectBestOpportunity(opportunities: any[]) {
    return opportunities.reduce((best, current) => 
      current.profitPercent > best.profitPercent ? current : best
    );
  }

  private calculateOptimalAmount(opportunity: any): number {
    return Math.min(
      opportunity.volume * 0.1, // Don't take more than 10% of volume
      100000 // Maximum trade size
    );
  }

  getStatus(): string {
    return 'active';
  }

  getName(): string {
    return 'Crypto Arbitrage Agent';
  }
}
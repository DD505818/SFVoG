import { TradingAgent } from '../types';
import type { MarketData, TradeExecution } from '../types';

interface MacroIndicator {
  name: string;
  value: number;
  impact: 'high' | 'medium' | 'low';
  sentiment: 'positive' | 'negative' | 'neutral';
}

export class MacroAgent implements TradingAgent {
  private indicators: MacroIndicator[];
  private lastUpdate: number;
  private updateInterval: number;

  constructor(updateInterval: number = 3600000) { // 1 hour default
    this.indicators = [];
    this.lastUpdate = 0;
    this.updateInterval = updateInterval;
  }

  async analyze(marketData: MarketData[]): Promise<TradeExecution | null> {
    await this.updateMacroIndicators();
    
    const sentiment = this.calculateMacroSentiment();
    if (Math.abs(sentiment) >= 0.6) { // Strong signal threshold
      return {
        symbol: marketData[0].symbol,
        type: sentiment > 0 ? 'buy' : 'sell',
        amount: this.calculatePositionSize(marketData[0], Math.abs(sentiment)),
        price: marketData[0].price,
        timestamp: Date.now()
      };
    }

    return null;
  }

  private async updateMacroIndicators() {
    const now = Date.now();
    if (now - this.lastUpdate < this.updateInterval) {
      return;
    }

    // Simulated macro indicators - in production, fetch real data
    this.indicators = [
      {
        name: 'GDP Growth',
        value: 2.5,
        impact: 'high',
        sentiment: 'positive'
      },
      {
        name: 'Inflation Rate',
        value: 3.2,
        impact: 'high',
        sentiment: 'negative'
      },
      {
        name: 'Unemployment',
        value: 3.8,
        impact: 'medium',
        sentiment: 'neutral'
      }
    ];

    this.lastUpdate = now;
  }

  private calculateMacroSentiment(): number {
    const weights = { high: 1, medium: 0.6, low: 0.3 };
    let weightedSum = 0;
    let totalWeight = 0;

    for (const indicator of this.indicators) {
      const weight = weights[indicator.impact];
      const sentiment = indicator.sentiment === 'positive' ? 1 :
                       indicator.sentiment === 'negative' ? -1 : 0;
      
      weightedSum += weight * sentiment;
      totalWeight += weight;
    }

    return weightedSum / totalWeight;
  }

  private calculatePositionSize(data: MarketData, sentimentStrength: number): number {
    const baseSize = Math.min(data.volume * 0.05, 100000);
    return baseSize * sentimentStrength;
  }

  getStatus(): string {
    return 'active';
  }

  getName(): string {
    return 'Macro Analysis Agent';
  }
}
import { TradingAgent } from '../types';
import type { MarketData, TradeExecution } from '../types';

interface VWAPData {
  price: number;
  volume: number;
  timestamp: number;
}

export class HFTAgent implements TradingAgent {
  private windowSize: number;
  private vwapHistory: VWAPData[];
  private minVolume: number;

  constructor(windowSize: number = 20, minVolume: number = 1000) {
    this.windowSize = windowSize;
    this.vwapHistory = [];
    this.minVolume = minVolume;
  }

  async analyze(marketData: MarketData[]): Promise<TradeExecution | null> {
    this.updateVWAP(marketData[0]);
    
    if (marketData[0].volume < this.minVolume) {
      return null;
    }

    const signal = this.analyzeVWAPCrossover();
    if (signal) {
      return {
        symbol: marketData[0].symbol,
        type: signal,
        amount: this.calculateTradeSize(marketData[0]),
        price: marketData[0].price,
        timestamp: Date.now()
      };
    }

    return null;
  }

  private updateVWAP(data: MarketData) {
    this.vwapHistory.push({
      price: data.price,
      volume: data.volume,
      timestamp: data.timestamp
    });

    if (this.vwapHistory.length > this.windowSize) {
      this.vwapHistory.shift();
    }
  }

  private calculateVWAP(): number {
    const totalVolume = this.vwapHistory.reduce((sum, data) => sum + data.volume, 0);
    const sumPriceVolume = this.vwapHistory.reduce(
      (sum, data) => sum + data.price * data.volume, 
      0
    );
    return sumPriceVolume / totalVolume;
  }

  private analyzeVWAPCrossover(): 'buy' | 'sell' | null {
    if (this.vwapHistory.length < this.windowSize) {
      return null;
    }

    const vwap = this.calculateVWAP();
    const currentPrice = this.vwapHistory[this.vwapHistory.length - 1].price;
    const previousPrice = this.vwapHistory[this.vwapHistory.length - 2].price;

    if (previousPrice < vwap && currentPrice > vwap) {
      return 'buy';
    } else if (previousPrice > vwap && currentPrice < vwap) {
      return 'sell';
    }

    return null;
  }

  private calculateTradeSize(data: MarketData): number {
    const volatility = this.calculateVolatility();
    const baseSize = Math.min(data.volume * 0.01, 10000);
    return baseSize * (1 - volatility); // Reduce size in high volatility
  }

  private calculateVolatility(): number {
    if (this.vwapHistory.length < 2) return 0;

    const returns = this.vwapHistory.slice(1).map((data, i) => 
      Math.log(data.price / this.vwapHistory[i].price)
    );

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }

  getStatus(): string {
    return 'active';
  }

  getName(): string {
    return 'HFT VWAP Agent';
  }
}
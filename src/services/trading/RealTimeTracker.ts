import { EventEmitter } from 'events';
import type { MarketData, TradeExecution, Asset } from './types';

export class RealTimeTracker extends EventEmitter {
  private positions: Map<string, Asset>;
  private lastPrices: Map<string, number>;
  private updateInterval: number;
  private intervalId?: NodeJS.Timer;

  constructor(updateInterval: number = 1000) { // 1 second default
    super();
    this.positions = new Map();
    this.lastPrices = new Map();
    this.updateInterval = updateInterval;
  }

  start(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      this.updatePositions();
      this.checkAlerts();
    }, this.updateInterval);
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  updatePosition(asset: Asset): void {
    this.positions.set(asset.symbol, asset);
    this.emit('position_update', asset);
  }

  updatePrice(symbol: string, price: number): void {
    this.lastPrices.set(symbol, price);
    
    const position = this.positions.get(symbol);
    if (position) {
      const previousValue = position.value;
      const newValue = position.amount * price;
      const change = ((newValue - previousValue) / previousValue) * 100;

      this.emit('price_update', {
        symbol,
        price,
        change,
        value: newValue
      });
    }
  }

  private updatePositions(): void {
    for (const [symbol, position] of this.positions) {
      const currentPrice = this.lastPrices.get(symbol);
      if (currentPrice) {
        const updatedPosition = {
          ...position,
          value: position.amount * currentPrice,
          lastUpdated: new Date()
        };
        this.positions.set(symbol, updatedPosition);
        this.emit('position_update', updatedPosition);
      }
    }
  }

  private checkAlerts(): void {
    for (const [symbol, position] of this.positions) {
      const currentPrice = this.lastPrices.get(symbol);
      if (!currentPrice) continue;

      // Check for significant price movements
      const priceChange = ((currentPrice - position.value / position.amount) / (position.value / position.amount)) * 100;
      
      if (Math.abs(priceChange) >= 5) {
        this.emit('alert', {
          type: priceChange > 0 ? 'positive' : 'negative',
          symbol,
          message: `${symbol} price ${priceChange > 0 ? 'up' : 'down'} ${Math.abs(priceChange).toFixed(2)}%`,
          timestamp: Date.now()
        });
      }
    }
  }

  getPosition(symbol: string): Asset | undefined {
    return this.positions.get(symbol);
  }

  getAllPositions(): Asset[] {
    return Array.from(this.positions.values());
  }

  getLastPrice(symbol: string): number | undefined {
    return this.lastPrices.get(symbol);
  }
}
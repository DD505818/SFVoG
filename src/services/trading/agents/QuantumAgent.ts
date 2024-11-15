import { TradingAgent } from '../types';
import type { MarketData, TradeExecution } from '../types';
import { QuantumTradingStrategy } from '../../quantum/QuantumStrategy';
import { QuantumOptimizer } from '../../quantum/QuantumOptimizer';
import type { QuantumStrategy } from '../../quantum/types';

export class QuantumAgent implements TradingAgent {
  private strategy: QuantumTradingStrategy;
  private optimizer: QuantumOptimizer;
  private lastOptimization: number;
  private optimizationInterval: number;

  constructor(optimizationInterval: number = 3600000) { // 1 hour default
    const initialStrategy: QuantumStrategy = {
      name: 'Quantum Market Analysis',
      description: 'Advanced quantum circuit for market pattern recognition',
      params: {
        depth: 4,
        shots: 1000,
        optimization: 'QAOA'
      }
    };

    this.strategy = new QuantumTradingStrategy(initialStrategy);
    this.optimizer = new QuantumOptimizer();
    this.lastOptimization = 0;
    this.optimizationInterval = optimizationInterval;
  }

  async analyze(marketData: MarketData[]): Promise<TradeExecution | null> {
    try {
      // Check if optimization is needed
      await this.checkOptimization();

      // Get quantum trading signal
      const signal = await this.strategy.analyze(marketData);

      if (signal.confidence >= 0.75) {
        return {
          symbol: marketData[0].symbol,
          type: signal.type.toLowerCase() as 'buy' | 'sell',
          amount: this.calculatePositionSize(marketData[0], signal.confidence),
          price: marketData[0].price,
          timestamp: Date.now()
        };
      }

      return null;
    } catch (error) {
      console.error('Quantum analysis failed:', error);
      return null;
    }
  }

  private async checkOptimization(): Promise<void> {
    const now = Date.now();
    if (now - this.lastOptimization >= this.optimizationInterval) {
      try {
        const optimizedStrategy = await this.optimizer.optimizeStrategy(
          this.strategy['strategy'] // Access the private strategy property
        );
        this.strategy = new QuantumTradingStrategy(optimizedStrategy);
        this.lastOptimization = now;
      } catch (error) {
        console.error('Strategy optimization failed:', error);
      }
    }
  }

  private calculatePositionSize(data: MarketData, confidence: number): number {
    // Base position size on confidence and market data
    const baseSize = Math.min(data.volume * 0.01, 10000);
    return baseSize * confidence;
  }

  getStatus(): string {
    return 'active';
  }

  getName(): string {
    return 'Quantum Trading Agent';
  }
}
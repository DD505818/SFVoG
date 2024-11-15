import { MarketData } from '../types';
import { QuantumOptimizer } from '../../quantum/QuantumOptimizer';
import { PositionParameters, StrategyParameters } from './types';
import { RiskCalculator } from './RiskCalculator';

export class PositionCalculator {
  private quantumOptimizer: QuantumOptimizer;
  private riskCalculator: RiskCalculator;
  private params: StrategyParameters;

  constructor(params: StrategyParameters) {
    this.params = params;
    this.quantumOptimizer = new QuantumOptimizer();
    this.riskCalculator = new RiskCalculator();
  }

  async calculatePositionParameters(
    data: MarketData,
    confidence: number
  ): Promise<PositionParameters> {
    try {
      const assets = [{
        symbol: data.symbol,
        weight: confidence,
        risk: this.riskCalculator.calculateVolatilityForPrice(data.price)
      }];

      const result = await this.quantumOptimizer.optimizePortfolio(assets);
      const optimalWeight = result.weights.find(w => w.symbol === data.symbol)?.weight || 0;
      
      const baseSize = Math.min(data.volume * 0.01, this.params.maxPositionSize);
      const size = baseSize * optimalWeight * confidence;

      return {
        size,
        stopLoss: data.price * (1 - this.params.stopLossMultiplier),
        takeProfit: data.price * (1 + this.params.takeProfitLevels[2])
      };
    } catch (error) {
      console.error('Position parameter calculation failed:', error);
      return this.getFallbackParameters(data, confidence);
    }
  }

  private getFallbackParameters(
    data: MarketData,
    confidence: number
  ): PositionParameters {
    return {
      size: Math.min(data.volume * 0.005, this.params.maxPositionSize) * confidence,
      stopLoss: data.price * 0.98,
      takeProfit: data.price * 1.05
    };
  }
}
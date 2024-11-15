import { MarketData, TradeExecution } from '../types';
import { TransformerAgent } from '../../ai/transformerAgent';
import { RAGAgent } from '../../ai/ragAgent';
import { RiskManager } from '../RiskManager';
import { StrategyParameters, ModelPrediction } from './types';
import { RiskCalculator } from './RiskCalculator';
import { PositionCalculator } from './PositionCalculator';

export class AdvancedTradingStrategy {
  private transformerAgent: TransformerAgent;
  private ragAgent: RAGAgent;
  private riskManager: RiskManager;
  private riskCalculator: RiskCalculator;
  private positionCalculator: PositionCalculator;
  private params: StrategyParameters;
  private lastOptimization: number;

  constructor(params?: Partial<StrategyParameters>) {
    this.params = {
      stopLossMultiplier: 0.02,
      takeProfitLevels: [0.236, 0.382, 0.5, 0.618, 0.786],
      minConfidence: 0.75,
      maxPositionSize: 100000,
      rebalanceInterval: 3600000,
      ...params
    };

    this.transformerAgent = new TransformerAgent();
    this.ragAgent = new RAGAgent();
    this.riskManager = new RiskManager();
    this.riskCalculator = new RiskCalculator();
    this.positionCalculator = new PositionCalculator(this.params);
    this.lastOptimization = 0;
  }

  async analyze(marketData: MarketData[]): Promise<TradeExecution | null> {
    try {
      if (!this.validateMarketData(marketData)) {
        console.warn('Invalid market data provided');
        return null;
      }

      const [transformerPrediction, ragPrediction] = await Promise.all([
        this.getTransformerPrediction(marketData),
        this.getRAGPrediction(marketData)
      ]);

      if (!this.validatePredictions(transformerPrediction, ragPrediction)) {
        return null;
      }

      const riskMetrics = this.riskCalculator.calculateRiskMetrics(marketData);
      if (!this.riskManager.validateTrade(marketData[0], riskMetrics)) {
        return null;
      }

      const positionParams = await this.positionCalculator.calculatePositionParameters(
        marketData[0],
        transformerPrediction.confidence
      );

      return {
        symbol: marketData[0].symbol,
        type: transformerPrediction.prediction,
        amount: positionParams.size,
        price: marketData[0].price,
        timestamp: Date.now(),
        stopLoss: positionParams.stopLoss,
        takeProfit: positionParams.takeProfit
      };
    } catch (error) {
      console.error('Advanced trading analysis failed:', error);
      return null;
    }
  }

  private validateMarketData(marketData: MarketData[]): boolean {
    return Array.isArray(marketData) && 
           marketData.length > 0 && 
           marketData.every(data => 
             data.symbol && 
             typeof data.price === 'number' && 
             typeof data.volume === 'number'
           );
  }

  private async getTransformerPrediction(marketData: MarketData[]): Promise<ModelPrediction> {
    return this.transformerAgent.predict({
      asset: marketData[0].symbol,
      timeframe: '1h',
      indicators: ['trend', 'momentum', 'volatility']
    });
  }

  private async getRAGPrediction(marketData: MarketData[]): Promise<ModelPrediction> {
    return this.ragAgent.predict({
      asset: marketData[0].symbol,
      timeframe: '1h',
      indicators: ['sentiment', 'volume', 'correlation']
    });
  }

  private validatePredictions(
    transformerPrediction: ModelPrediction,
    ragPrediction: ModelPrediction
  ): boolean {
    return (
      transformerPrediction.prediction === ragPrediction.prediction &&
      transformerPrediction.confidence >= this.params.minConfidence &&
      ragPrediction.confidence >= this.params.minConfidence
    );
  }
}
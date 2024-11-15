import { pipeline } from '@xenova/transformers';
import type { PredictionRequest, PredictionResponse } from './types';

export class TransformerAgent {
  private classifier: any;
  private initialized: boolean = false;

  async initialize() {
    if (!this.initialized) {
      try {
        this.classifier = await pipeline('text-classification', 'Xenova/finbert');
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize transformer:', error);
        throw new Error('Transformer initialization failed');
      }
    }
  }

  async predict(request: PredictionRequest): Promise<PredictionResponse> {
    await this.initialize();

    try {
      const input = `Analysis for ${request.asset} on ${request.timeframe} timeframe using ${request.indicators.join(', ')}`;
      const result = await this.classifier(input);
      
      const prediction = this.interpretPrediction(result[0]);

      return {
        prediction: prediction.action,
        confidence: prediction.confidence,
        reasoning: `Based on ${request.indicators.length} technical indicators over ${request.timeframe} timeframe`,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Prediction failed:', error);
      throw new Error('Failed to generate prediction');
    }
  }

  private interpretPrediction(result: any): { action: 'buy' | 'sell' | 'hold', confidence: number } {
    const { label, score } = result;
    
    if (label.includes('positive')) {
      return { action: 'buy', confidence: score };
    } else if (label.includes('negative')) {
      return { action: 'sell', confidence: score };
    }
    
    return { action: 'hold', confidence: score };
  }
}
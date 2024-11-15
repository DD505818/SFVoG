import { PredictionRequest, PredictionResponse } from './types';

export class OllamaAgent {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  async predict(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `Analyze ${request.asset} for ${request.timeframe} timeframe using ${request.indicators.join(', ')}`,
          stream: false
        })
      });

      const data = await response.json();
      const prediction = this.parsePrediction(data.response);

      return {
        prediction: prediction.action,
        confidence: prediction.confidence,
        reasoning: data.response,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Ollama prediction failed:', error);
      throw new Error('Failed to generate Ollama prediction');
    }
  }

  private parsePrediction(content: string): { action: 'buy' | 'sell' | 'hold', confidence: number } {
    const lowered = content.toLowerCase();
    if (lowered.includes('buy')) return { action: 'buy', confidence: 0.8 };
    if (lowered.includes('sell')) return { action: 'sell', confidence: 0.8 };
    return { action: 'hold', confidence: 0.6 };
  }
}
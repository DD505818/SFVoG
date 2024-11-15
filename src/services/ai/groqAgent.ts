import { Groq } from "@groq/groq-sdk";
import { PredictionRequest, PredictionResponse } from './types';

export class GroqAgent {
  private client: Groq;

  constructor(apiKey: string) {
    this.client = new Groq({
      apiKey: apiKey
    });
  }

  async predict(request: PredictionRequest): Promise<PredictionResponse> {
    try {
      const completion = await this.client.chat.completions.create({
        messages: [{
          role: "system",
          content: "You are an expert trading analyst. Analyze the given market data and provide trading recommendations."
        }, {
          role: "user",
          content: `Analyze ${request.asset} for ${request.timeframe} timeframe using ${request.indicators.join(', ')}`
        }],
        model: "mixtral-8x7b-32768",
        temperature: 0.5
      });

      const prediction = this.parsePrediction(completion.choices[0]?.message?.content || '');

      return {
        prediction: prediction.action,
        confidence: prediction.confidence,
        reasoning: completion.choices[0]?.message?.content || '',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Groq prediction failed:', error);
      throw new Error('Failed to generate Groq prediction');
    }
  }

  private parsePrediction(content: string): { action: 'buy' | 'sell' | 'hold', confidence: number } {
    // Simple parsing logic - in production, use more sophisticated NLP
    const lowered = content.toLowerCase();
    if (lowered.includes('buy')) return { action: 'buy', confidence: 0.8 };
    if (lowered.includes('sell')) return { action: 'sell', confidence: 0.8 };
    return { action: 'hold', confidence: 0.6 };
  }
}
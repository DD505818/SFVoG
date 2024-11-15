import { ChromaClient } from 'chromadb';
import { RAGResponse, PredictionRequest, PredictionResponse } from './types';

export class RAGAgent {
  private chroma: ChromaClient;
  private collection: any;

  constructor() {
    this.chroma = new ChromaClient();
    this.initializeCollection();
  }

  private async initializeCollection() {
    try {
      this.collection = await this.chroma.createCollection({
        name: "trading_knowledge",
        metadata: { "description": "Trading strategies and market analysis" }
      });
    } catch (error) {
      console.error('Failed to initialize RAG collection:', error);
    }
  }

  async query(question: string): Promise<RAGResponse> {
    try {
      const results = await this.collection.query({
        queryTexts: [question],
        nResults: 3
      });

      return {
        answer: "Analysis based on historical patterns...",
        sources: results.documents[0],
        confidence: 0.85
      };
    } catch (error) {
      console.error('RAG query failed:', error);
      throw new Error('Failed to process RAG query');
    }
  }

  async predict(request: PredictionRequest): Promise<PredictionResponse> {
    const { asset, timeframe, indicators } = request;
    
    try {
      const analysis = await this.query(
        `Analyze ${asset} for ${timeframe} timeframe using ${indicators.join(', ')}`
      );

      return {
        prediction: 'buy',
        confidence: analysis.confidence,
        reasoning: analysis.answer,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Prediction failed:', error);
      throw new Error('Failed to generate prediction');
    }
  }
}
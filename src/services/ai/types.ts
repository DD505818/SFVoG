export interface RAGResponse {
  answer: string;
  sources: string[];
  confidence: number;
}

export interface AIAgent {
  id: string;
  name: string;
  type: 'transformer' | 'ensemble' | 'sentiment';
  status: 'active' | 'loading' | 'error';
  lastPrediction?: {
    timestamp: number;
    confidence: number;
    action: 'buy' | 'sell' | 'hold';
    asset: string;
  };
}

export interface PredictionRequest {
  asset: string;
  timeframe: '1h' | '4h' | '1d';
  indicators: string[];
}

export interface PredictionResponse {
  prediction: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning: string;
  timestamp: number;
}
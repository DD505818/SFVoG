export interface User {
  id: string;
  username: string;
  email: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  name: string;
  balance: number;
  created_at: string;
}

export interface Asset {
  id: string;
  wallet_id: string;
  symbol: string;
  name: string;
  amount: number;
  type: 'crypto' | 'stock' | 'forex' | 'commodity';
  created_at: string;
}

export interface Trade {
  id: string;
  wallet_id: string;
  asset_id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export interface AIPrediction {
  id: string;
  agent_id: string;
  asset_id: string;
  prediction: 'buy' | 'sell' | 'hold';
  confidence: number;
  reasoning?: string;
  created_at: string;
}
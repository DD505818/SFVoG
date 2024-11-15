export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'error';
  profit: number;
  trades: number;
  winRate: number;
  allocation: number;
}

export interface Trade {
  id: string;
  agentId: string;
  type: 'buy' | 'sell';
  asset: string;
  amount: number;
  price: number;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
  profit?: number;
}

export interface Performance {
  daily: number;
  weekly: number;
  monthly: number;
  total: number;
  trades: number;
  winRate: number;
}

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change24h: number;
  allocation: number;
  type: 'crypto' | 'stock' | 'forex' | 'commodity';
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  assets: Asset[];
  performance24h: number;
  lastUpdated?: Date;
  transactions?: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'trade';
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  description?: string;
}
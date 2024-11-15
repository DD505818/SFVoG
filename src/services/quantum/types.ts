export interface Complex {
  real: number;
  imag: number;
}

export interface QuantumState {
  amplitudes: Complex[];
  numQubits: number;
}

export interface QuantumResult {
  measurements: number[];
  probability: number;
  executionTime: number;
}

export interface QuantumStrategy {
  name: string;
  description: string;
  params: {
    depth: number;
    shots: number;
    optimization: 'QAOA' | 'VQE' | 'CUSTOM';
  };
}

export type QuantumSignal = {
  type: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  timestamp: number;
  metadata: {
    circuit: string;
    measurements: number[];
    executionTime: number;
  };
};
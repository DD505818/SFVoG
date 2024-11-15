import { QuantumCircuit } from './QuantumCircuit';
import { QuantumSimulator } from './QuantumSimulator';
import type { QuantumStrategy, OptimizationResult, QuantumState } from './types';

export class QuantumOptimizer {
  private circuit: QuantumCircuit;
  private simulator: QuantumSimulator;
  private maxIterations: number;
  private convergenceThreshold: number;

  constructor(numQubits: number = 8, maxIterations: number = 100, convergenceThreshold: number = 1e-6) {
    this.circuit = new QuantumCircuit(numQubits);
    this.simulator = new QuantumSimulator(numQubits);
    this.maxIterations = maxIterations;
    this.convergenceThreshold = convergenceThreshold;
  }

  async optimizePortfolio(assets: Array<{ symbol: string; weight: number; risk: number }>): Promise<OptimizationResult> {
    try {
      // Initialize quantum state with portfolio data
      const initialState = this.encodePortfolio(assets);
      this.circuit.reset();
      
      // Apply quantum operations
      this.circuit.hadamard(0); // Create superposition
      this.applyRiskConstraints(assets);
      this.applyReturnOptimization(assets);
      
      // Run quantum simulation
      const result = await this.simulator.simulate(this.circuit);
      
      return this.decodeResult(result, assets);
    } catch (error) {
      console.error('Quantum portfolio optimization failed:', error);
      throw new Error('Failed to optimize portfolio using quantum algorithm');
    }
  }

  async optimizeStrategy(strategy: QuantumStrategy): Promise<QuantumStrategy> {
    let currentStrategy = { ...strategy };
    let iteration = 0;
    let converged = false;

    while (iteration < this.maxIterations && !converged) {
      try {
        // Perform QAOA optimization
        const result = await this.performQAOAIteration(currentStrategy);
        
        // Update strategy parameters
        currentStrategy = this.updateStrategy(currentStrategy, result);
        
        // Check convergence
        converged = this.checkConvergence(result);
        
        iteration++;
      } catch (error) {
        console.error('Strategy optimization failed:', error);
        break;
      }
    }

    return currentStrategy;
  }

  private encodePortfolio(assets: Array<{ symbol: string; weight: number; risk: number }>): QuantumState {
    // Encode classical portfolio data into quantum state
    const numQubits = Math.ceil(Math.log2(assets.length));
    const amplitudes = new Array(2 ** numQubits).fill({ real: 0, imag: 0 });
    
    assets.forEach((asset, index) => {
      amplitudes[index] = {
        real: Math.sqrt(asset.weight),
        imag: 0
      };
    });

    return { amplitudes, numQubits };
  }

  private applyRiskConstraints(assets: Array<{ symbol: string; weight: number; risk: number }>): void {
    assets.forEach((asset, index) => {
      // Apply risk-based rotation
      const theta = Math.asin(Math.sqrt(asset.risk));
      this.circuit.rotateX(index, theta);
      
      // Apply entanglement between correlated assets
      if (index > 0) {
        this.circuit.cnot(index - 1, index);
      }
    });
  }

  private applyReturnOptimization(assets: Array<{ symbol: string; weight: number; risk: number }>): void {
    // Apply quantum fourier transform for return optimization
    this.applyQFT();
    
    // Apply phase shifts based on expected returns
    assets.forEach((asset, index) => {
      const phi = Math.atan2(asset.weight, asset.risk);
      this.circuit.phase(index, phi);
    });
    
    // Inverse QFT
    this.applyInverseQFT();
  }

  private applyQFT(): void {
    const n = this.circuit.getNumQubits();
    for (let i = 0; i < n; i++) {
      this.circuit.hadamard(i);
      for (let j = i + 1; j < n; j++) {
        const theta = Math.PI / Math.pow(2, j - i);
        this.circuit.controlledPhase(i, j, theta);
      }
    }
  }

  private applyInverseQFT(): void {
    const n = this.circuit.getNumQubits();
    for (let i = n - 1; i >= 0; i--) {
      for (let j = n - 1; j > i; j--) {
        const theta = -Math.PI / Math.pow(2, j - i);
        this.circuit.controlledPhase(i, j, theta);
      }
      this.circuit.hadamard(i);
    }
  }

  private async performQAOAIteration(strategy: QuantumStrategy): Promise<any> {
    // Simulate QAOA optimization step
    return {
      cost: Math.random(),
      gradients: Array(strategy.params.depth).fill(0)
        .map(() => Math.random() - 0.5)
    };
  }

  private updateStrategy(strategy: QuantumStrategy, result: any): QuantumStrategy {
    return {
      ...strategy,
      params: {
        ...strategy.params,
        depth: Math.max(2, strategy.params.depth + 
          (result.gradients[0] > 0 ? 1 : -1))
      }
    };
  }

  private checkConvergence(result: any): boolean {
    return Math.abs(result.cost) < this.convergenceThreshold;
  }

  private decodeResult(result: any, assets: Array<{ symbol: string; weight: number; risk: number }>): OptimizationResult {
    const optimizedWeights = result.measurements.map((measurement: number, index: number) => ({
      symbol: assets[index].symbol,
      weight: measurement / result.measurements.reduce((a: number, b: number) => a + b, 0)
    }));

    return {
      weights: optimizedWeights,
      confidence: result.probability,
      executionTime: result.executionTime,
      iterations: this.maxIterations
    };
  }
}
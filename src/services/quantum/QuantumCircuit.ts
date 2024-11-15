import { Complex } from './types';

export class QuantumCircuit {
  private numQubits: number;
  private gates: Array<{ type: string; qubits: number[]; params?: number[] }>;

  constructor(numQubits: number) {
    this.numQubits = numQubits;
    this.gates = [];
  }

  hadamard(qubit: number): void {
    this.gates.push({ type: 'H', qubits: [qubit] });
  }

  cnot(control: number, target: number): void {
    this.gates.push({ type: 'CNOT', qubits: [control, target] });
  }

  rotateX(qubit: number, theta: number): void {
    this.gates.push({ type: 'RX', qubits: [qubit], params: [theta] });
  }

  measure(qubit: number): void {
    this.gates.push({ type: 'M', qubits: [qubit] });
  }

  getCircuitDepth(): number {
    return this.gates.length;
  }

  getNumQubits(): number {
    return this.numQubits;
  }

  reset(): void {
    this.gates = [];
  }
}
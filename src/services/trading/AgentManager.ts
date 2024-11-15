import type { MarketData, TradeExecution, TradingAgent } from './types';
import { CryptoArbitrageAgent } from './agents/CryptoArbitrageAgent';
import { OptionsAgent } from './agents/OptionsAgent';
import { ForexAgent } from './agents/ForexAgent';
import { DeFiAgent } from './agents/DeFiAgent';
import { HFTAgent } from './agents/HFTAgent';
import { MacroAgent } from './agents/MacroAgent';
import { QuantumAgent } from './agents/QuantumAgent';
import { MemeTokenAgent } from './agents/MemeTokenAgent';

export class AgentManager {
  private agents: Map<string, TradingAgent> = new Map();
  private riskLimits: Map<string, number> = new Map();
  private isInitialized: boolean = false;

  constructor() {
    this.initializeAgents();
    this.initializeRiskLimits();
  }

  private async initializeAgents() {
    if (this.isInitialized) return;

    try {
      this.addAgent('crypto', new CryptoArbitrageAgent());
      this.addAgent('options', new OptionsAgent());
      this.addAgent('forex', new ForexAgent());
      this.addAgent('defi', new DeFiAgent());
      this.addAgent('hft', new HFTAgent());
      this.addAgent('macro', new MacroAgent());
      this.addAgent('quantum', new QuantumAgent());
      this.addAgent('meme', new MemeTokenAgent());

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize agents:', error);
      throw new Error('Agent initialization failed');
    }
  }

  private initializeRiskLimits() {
    this.riskLimits.set('crypto', 100000);
    this.riskLimits.set('options', 50000);
    this.riskLimits.set('forex', 75000);
    this.riskLimits.set('defi', 25000);
    this.riskLimits.set('hft', 10000);
    this.riskLimits.set('macro', 150000);
    this.riskLimits.set('quantum', 200000);
    this.riskLimits.set('meme', 5000); // Conservative limit for high-risk meme tokens
  }

  addAgent(id: string, agent: TradingAgent) {
    if (!agent) {
      throw new Error(`Invalid agent provided for ID: ${id}`);
    }
    this.agents.set(id, agent);
  }

  removeAgent(id: string) {
    if (!this.agents.has(id)) {
      throw new Error(`Agent not found with ID: ${id}`);
    }
    this.agents.delete(id);
    this.riskLimits.delete(id);
  }

  async analyzeMarket(marketData: MarketData[]): Promise<TradeExecution[]> {
    if (!marketData?.length) {
      throw new Error('Invalid market data provided');
    }

    const executions: TradeExecution[] = [];
    const totalRisk = this.calculateTotalRisk(executions);

    for (const [id, agent] of this.agents.entries()) {
      try {
        if (totalRisk >= this.getMaxTotalRisk()) {
          console.log('Total risk limit reached, skipping remaining agents');
          break;
        }

        const execution = await agent.analyze(marketData);
        if (execution && this.validateRiskLimit(id, execution)) {
          executions.push(execution);
        }
      } catch (error) {
        console.error(`Agent ${agent.getName()} analysis failed:`, error);
      }
    }

    return this.prioritizeExecutions(executions);
  }

  private validateRiskLimit(agentId: string, execution: TradeExecution): boolean {
    const riskLimit = this.riskLimits.get(agentId) || 0;
    const executionValue = execution.amount * execution.price;
    return executionValue <= riskLimit;
  }

  private calculateTotalRisk(executions: TradeExecution[]): number {
    return executions.reduce((total, exec) => total + (exec.amount * exec.price), 0);
  }

  private getMaxTotalRisk(): number {
    return Array.from(this.riskLimits.values()).reduce((sum, limit) => sum + limit, 0) * 0.75;
  }

  private prioritizeExecutions(executions: TradeExecution[]): TradeExecution[] {
    return executions.sort((a, b) => {
      const valueA = a.amount * a.price;
      const valueB = b.amount * b.price;
      return valueB - valueA;
    });
  }

  getAgentStatus(): Array<{ name: string; status: string }> {
    return Array.from(this.agents.values()).map(agent => ({
      name: agent.getName(),
      status: agent.getStatus()
    }));
  }

  getActiveAgents(): number {
    return Array.from(this.agents.values()).filter(
      agent => agent.getStatus() === 'active'
    ).length;
  }

  getTotalAgents(): number {
    return this.agents.size;
  }
}
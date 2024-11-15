import { MarketData, TradeExecution } from '../trading/types';
import { TechnicalAnalyzer } from './TechnicalAnalyzer';

export class BacktestEngine {
  private analyzer: TechnicalAnalyzer;
  private initialCapital: number;
  private commission: number;

  constructor(initialCapital: number = 100000, commission: number = 0.001) {
    this.analyzer = new TechnicalAnalyzer();
    this.initialCapital = initialCapital;
    this.commission = commission;
  }

  async runBacktest(
    strategy: any,
    historicalData: MarketData[],
    params: Record<string, any>
  ): Promise<BacktestResult> {
    let capital = this.initialCapital;
    const trades: TradeExecution[] = [];
    const metrics: PerformanceMetrics = this.initializeMetrics();

    for (let i = 50; i < historicalData.length; i++) {
      const windowData = historicalData.slice(0, i + 1);
      const signal = await strategy.analyze(windowData);

      if (signal) {
        const trade = this.executeTrade(signal, capital);
        trades.push(trade);
        capital = this.updateCapital(capital, trade);
        this.updateMetrics(metrics, trade, windowData);
      }
    }

    return {
      finalCapital: capital,
      totalTrades: trades.length,
      metrics: this.finalizeMetrics(metrics, capital),
      trades
    };
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      winRate: 0,
      profitFactor: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
      returns: [],
      winningTrades: 0,
      losingTrades: 0
    };
  }

  private executeTrade(signal: any, capital: number): TradeExecution {
    const size = this.calculatePositionSize(signal, capital);
    const commission = size * signal.price * this.commission;

    return {
      symbol: signal.symbol,
      type: signal.type,
      amount: size,
      price: signal.price,
      timestamp: Date.now(),
      commission
    };
  }

  private calculatePositionSize(signal: any, capital: number): number {
    const riskPerTrade = 0.02; // 2% risk per trade
    const availableCapital = capital * riskPerTrade;
    return availableCapital / signal.price;
  }

  private updateCapital(capital: number, trade: TradeExecution): number {
    const tradeValue = trade.amount * trade.price;
    return trade.type === 'buy'
      ? capital - tradeValue - trade.commission
      : capital + tradeValue - trade.commission;
  }

  private updateMetrics(
    metrics: PerformanceMetrics,
    trade: TradeExecution,
    data: MarketData[]
  ): void {
    const profit = this.calculateTradeProfit(trade, data);
    
    if (profit > 0) {
      metrics.winningTrades++;
    } else {
      metrics.losingTrades++;
    }

    metrics.returns.push(profit);
    metrics.maxDrawdown = Math.min(
      metrics.maxDrawdown,
      profit / this.initialCapital
    );
  }

  private calculateTradeProfit(
    trade: TradeExecution,
    data: MarketData[]
  ): number {
    const exitPrice = data[data.length - 1].price;
    const entryValue = trade.amount * trade.price;
    const exitValue = trade.amount * exitPrice;
    
    return trade.type === 'buy'
      ? exitValue - entryValue - trade.commission
      : entryValue - exitValue - trade.commission;
  }

  private finalizeMetrics(
    metrics: PerformanceMetrics,
    finalCapital: number
  ): PerformanceMetrics {
    const totalTrades = metrics.winningTrades + metrics.losingTrades;
    
    return {
      ...metrics,
      winRate: metrics.winningTrades / totalTrades,
      profitFactor: this.calculateProfitFactor(metrics.returns),
      sharpeRatio: this.calculateSharpeRatio(metrics.returns),
      totalReturn: (finalCapital - this.initialCapital) / this.initialCapital
    };
  }

  private calculateProfitFactor(returns: number[]): number {
    const profits = returns.filter(r => r > 0).reduce((a, b) => a + b, 0);
    const losses = Math.abs(returns.filter(r => r < 0).reduce((a, b) => a + b, 0));
    return losses === 0 ? profits : profits / losses;
  }

  private calculateSharpeRatio(returns: number[]): number {
    const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    const riskFreeRate = 0.02; // 2% annual risk-free rate
    
    return (mean - riskFreeRate) / Math.sqrt(variance);
  }
}
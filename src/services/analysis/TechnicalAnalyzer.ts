import { MarketData } from '../trading/types';

export class TechnicalAnalyzer {
  // Fibonacci levels
  private readonly fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

  calculateFibonacciLevels(high: number, low: number): number[] {
    const diff = high - low;
    return this.fibLevels.map(level => low + diff * level);
  }

  findPivotPoints(data: MarketData[]): { support: number; resistance: number } {
    const prices = data.map(d => d.price);
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    const close = prices[prices.length - 1];

    const pivot = (high + low + close) / 3;
    const support = 2 * pivot - high;
    const resistance = 2 * pivot - low;

    return { support, resistance };
  }

  calculateTeslaWaves(data: MarketData[]): {
    primaryWave: number;
    secondaryWave: number;
  } {
    const prices = data.map(d => d.price);
    const periods = [3, 7, 11]; // Tesla's numbers

    const waves = periods.map(period => {
      const sum = prices.slice(-period).reduce((a, b) => a + b, 0);
      return sum / period;
    });

    return {
      primaryWave: waves[0],
      secondaryWave: waves[1]
    };
  }

  calculateHarmonicPatterns(data: MarketData[]): {
    pattern: string;
    confidence: number;
    priceTarget: number;
  } | null {
    const prices = data.map(d => d.price);
    const moves = this.calculatePriceMoves(prices);
    
    // Check for Gartley pattern
    const gartleyRatios = this.checkGartleyPattern(moves);
    if (gartleyRatios.isValid) {
      return {
        pattern: 'Gartley',
        confidence: gartleyRatios.confidence,
        priceTarget: this.calculatePriceTarget(prices, gartleyRatios)
      };
    }

    return null;
  }

  private calculatePriceMoves(prices: number[]): number[] {
    const moves: number[] = [];
    for (let i = 1; i < prices.length; i++) {
      moves.push(prices[i] - prices[i - 1]);
    }
    return moves;
  }

  private checkGartleyPattern(moves: number[]): {
    isValid: boolean;
    confidence: number;
  } {
    // Gartley pattern ratios
    const idealRatios = {
      xA: 1,
      AB: 0.618,
      BC: 0.382,
      CD: 1.272
    };

    const actualRatios = this.calculateMoveRatios(moves);
    const tolerance = 0.1;
    
    const isValid = Object.keys(idealRatios).every(key => 
      Math.abs(actualRatios[key] - idealRatios[key]) <= tolerance
    );

    const confidence = isValid ? 
      this.calculatePatternConfidence(actualRatios, idealRatios) : 0;

    return { isValid, confidence };
  }

  private calculateMoveRatios(moves: number[]): Record<string, number> {
    // Simplified ratio calculation
    return {
      xA: 1,
      AB: Math.abs(moves[1] / moves[0]),
      BC: Math.abs(moves[2] / moves[1]),
      CD: Math.abs(moves[3] / moves[2])
    };
  }

  private calculatePatternConfidence(
    actual: Record<string, number>,
    ideal: Record<string, number>
  ): number {
    const deviations = Object.keys(ideal).map(key =>
      Math.abs(actual[key] - ideal[key]) / ideal[key]
    );
    
    const avgDeviation = deviations.reduce((a, b) => a + b) / deviations.length;
    return Math.max(0, 1 - avgDeviation);
  }

  private calculatePriceTarget(
    prices: number[],
    ratios: { confidence: number }
  ): number {
    const lastPrice = prices[prices.length - 1];
    const volatility = this.calculateVolatility(prices);
    
    return lastPrice * (1 + volatility * ratios.confidence);
  }

  private calculateVolatility(prices: number[]): number {
    const returns = prices.slice(1).map((price, i) => 
      Math.log(price / prices[i])
    );
    
    const mean = returns.reduce((a, b) => a + b) / returns.length;
    const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / returns.length;
    
    return Math.sqrt(variance);
  }
}
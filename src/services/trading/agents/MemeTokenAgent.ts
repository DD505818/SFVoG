import { TradingAgent } from '../types';
import type { MarketData, TradeExecution } from '../types';

interface CommunityMetrics {
  socialVolume: number;
  sentimentScore: number;
  influencerMentions: number;
  holdersGrowth: number;
  telegramActivity: number;
}

interface TokenMetrics {
  liquidityUSD: number;
  marketCap: number;
  holders: number;
  buyTaxBPS: number;
  sellTaxBPS: number;
}

export class MemeTokenAgent implements TradingAgent {
  private minLiquidityUSD: number;
  private maxBuyTaxBPS: number;
  private minHolders: number;
  private minSentimentScore: number;
  private stopLossPercent: number;
  private takeProfitMultiplier: number;

  constructor() {
    // Conservative safety parameters
    this.minLiquidityUSD = 50000; // Minimum liquidity to consider
    this.maxBuyTaxBPS = 200; // Maximum 20% buy tax
    this.minHolders = 100; // Minimum holder count
    this.minSentimentScore = 0.7; // Minimum community sentiment (0-1)
    this.stopLossPercent = 15; // 15% stop loss
    this.takeProfitMultiplier = 2; // 2x take profit
  }

  async analyze(marketData: MarketData[]): Promise<TradeExecution | null> {
    try {
      const tokenMetrics = await this.getTokenMetrics(marketData[0].symbol);
      if (!this.validateTokenMetrics(tokenMetrics)) {
        return null;
      }

      const communityMetrics = await this.analyzeCommunityMetrics(marketData[0].symbol);
      if (!this.validateCommunityMetrics(communityMetrics)) {
        return null;
      }

      const momentum = this.calculateMomentumScore(marketData, communityMetrics);
      if (momentum.score >= 0.8) {
        return {
          symbol: marketData[0].symbol,
          type: 'buy',
          amount: this.calculatePositionSize(marketData[0], tokenMetrics, momentum.confidence),
          price: marketData[0].price,
          timestamp: Date.now()
        };
      }

      return null;
    } catch (error) {
      console.error('Meme token analysis failed:', error);
      return null;
    }
  }

  private async getTokenMetrics(symbol: string): Promise<TokenMetrics> {
    // Simulated metrics - in production, fetch from blockchain/APIs
    return {
      liquidityUSD: 150000,
      marketCap: 1000000,
      holders: 500,
      buyTaxBPS: 100, // 10%
      sellTaxBPS: 100  // 10%
    };
  }

  private validateTokenMetrics(metrics: TokenMetrics): boolean {
    return (
      metrics.liquidityUSD >= this.minLiquidityUSD &&
      metrics.buyTaxBPS <= this.maxBuyTaxBPS &&
      metrics.holders >= this.minHolders
    );
  }

  private async analyzeCommunityMetrics(symbol: string): Promise<CommunityMetrics> {
    // Simulated metrics - in production, fetch from social APIs
    return {
      socialVolume: 1000,
      sentimentScore: 0.85,
      influencerMentions: 5,
      holdersGrowth: 50,
      telegramActivity: 800
    };
  }

  private validateCommunityMetrics(metrics: CommunityMetrics): boolean {
    return (
      metrics.sentimentScore >= this.minSentimentScore &&
      metrics.socialVolume > 500 &&
      metrics.telegramActivity > 100
    );
  }

  private calculateMomentumScore(
    marketData: MarketData[],
    communityMetrics: CommunityMetrics
  ): { score: number; confidence: number } {
    // Price momentum
    const priceChanges = marketData.slice(1).map((data, i) => 
      (data.price - marketData[i].price) / marketData[i].price
    );
    
    const volumeIncrease = marketData[marketData.length - 1].volume / 
      marketData[0].volume;

    // Weighted scoring system
    const weights = {
      priceMovement: 0.3,
      volumeChange: 0.2,
      socialMetrics: 0.3,
      influencerImpact: 0.2
    };

    const scores = {
      priceMovement: Math.min(1, Math.max(0, priceChanges.reduce((a, b) => a + b, 0))),
      volumeChange: Math.min(1, volumeIncrease / 5),
      socialMetrics: communityMetrics.sentimentScore,
      influencerImpact: Math.min(1, communityMetrics.influencerMentions / 10)
    };

    const totalScore = Object.entries(weights).reduce(
      (sum, [key, weight]) => sum + scores[key as keyof typeof scores] * weight,
      0
    );

    const confidence = Math.min(
      1,
      (communityMetrics.sentimentScore + (volumeIncrease / 10)) / 2
    );

    return { score: totalScore, confidence };
  }

  private calculatePositionSize(
    data: MarketData,
    metrics: TokenMetrics,
    confidence: number
  ): number {
    // Risk-adjusted position sizing
    const maxRiskUSD = 1000; // Maximum USD risk per trade
    const liquidityRatio = Math.min(1, metrics.liquidityUSD / 1000000);
    const positionSize = maxRiskUSD * liquidityRatio * confidence;

    // Ensure position size doesn't impact price too much
    const maxImpactSize = metrics.liquidityUSD * 0.02; // Max 2% of liquidity
    return Math.min(positionSize, maxImpactSize);
  }

  getStatus(): string {
    return 'active';
  }

  getName(): string {
    return 'Meme Token Sniper';
  }
}
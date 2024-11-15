import { Brain } from 'lucide-react';

export interface KnowledgeSource {
  id: string;
  type: 'research' | 'industry' | 'academic' | 'case-study' | 'framework';
  title: string;
  summary: string;
  confidence: number;
  lastUpdated: Date;
  tags: string[];
}

export interface ResearchPaper extends KnowledgeSource {
  authors: string[];
  journal: string;
  year: number;
  doi: string;
  citations: number;
}

export interface CaseStudy extends KnowledgeSource {
  industry: string;
  outcome: string;
  metrics: Record<string, number>;
  lessons: string[];
}

export class KnowledgeBase {
  private sources: Map<string, KnowledgeSource>;
  private lastSync: Date;

  constructor() {
    this.sources = new Map();
    this.lastSync = new Date();
    this.initializeKnowledge();
  }

  private initializeKnowledge() {
    // Research Papers
    this.addSource({
      id: 'paper-001',
      type: 'research',
      title: 'Deep Reinforcement Learning in Algorithmic Trading',
      summary: 'Novel approach combining DRL with market microstructure',
      confidence: 0.92,
      lastUpdated: new Date('2024-01-15'),
      tags: ['DRL', 'algorithmic-trading', 'market-microstructure'],
      authors: ['Smith, J.', 'Johnson, M.'],
      journal: 'Journal of Financial ML',
      year: 2024,
      doi: '10.1234/jfml.2024.001',
      citations: 45
    } as ResearchPaper);

    // Case Studies
    this.addSource({
      id: 'case-001',
      type: 'case-study',
      title: 'High-Frequency Trading Risk Management',
      summary: 'Analysis of risk management in HFT systems',
      confidence: 0.88,
      lastUpdated: new Date('2024-02-01'),
      tags: ['HFT', 'risk-management', 'market-making'],
      industry: 'Finance',
      outcome: 'Reduced trading risks by 65%',
      metrics: {
        riskReduction: 65,
        performanceImprovement: 42,
        costSaving: 28
      },
      lessons: [
        'Importance of real-time risk monitoring',
        'Need for circuit breakers',
        'Value of diversified strategies'
      ]
    } as CaseStudy);
  }

  addSource(source: KnowledgeSource) {
    this.sources.set(source.id, source);
  }

  async queryKnowledge(query: string, context: string[]): Promise<KnowledgeSource[]> {
    // Semantic search through knowledge base
    const relevantSources = Array.from(this.sources.values())
      .filter(source => 
        source.tags.some(tag => context.includes(tag)) ||
        source.title.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => b.confidence - a.confidence);

    return relevantSources;
  }

  async getRecommendations(context: string[]): Promise<KnowledgeSource[]> {
    return Array.from(this.sources.values())
      .filter(source => 
        source.tags.some(tag => context.includes(tag)) &&
        source.confidence > 0.8
      )
      .sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime())
      .slice(0, 5);
  }

  async validateStrategy(strategy: any): Promise<{
    isValid: boolean;
    confidence: number;
    recommendations: string[];
  }> {
    const relevantSources = await this.queryKnowledge(
      strategy.name,
      strategy.tags || []
    );

    const confidence = relevantSources.reduce(
      (acc, source) => acc + source.confidence,
      0
    ) / Math.max(1, relevantSources.length);

    return {
      isValid: confidence > 0.7,
      confidence,
      recommendations: relevantSources
        .flatMap(source => 
          source.type === 'case-study' 
            ? (source as CaseStudy).lessons 
            : [source.summary]
        )
    };
  }
}
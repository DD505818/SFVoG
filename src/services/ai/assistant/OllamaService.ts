import { AssistantResponse, QueryContext } from './types';

export class OllamaService {
  private baseUrl: string;
  private model: string;

  constructor(baseUrl: string = 'http://localhost:11434', model: string = 'llama2') {
    this.baseUrl = baseUrl;
    this.model = model;
  }

  async query(
    prompt: string,
    context: QueryContext,
    systemPrompt?: string
  ): Promise<AssistantResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: this.constructPrompt(prompt, context, systemPrompt),
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
            top_k: 40,
            num_ctx: 4096
          }
        })
      });

      const data = await response.json();
      return this.parseResponse(data.response);
    } catch (error) {
      console.error('Ollama query failed:', error);
      throw new Error('Failed to generate response');
    }
  }

  private constructPrompt(
    prompt: string,
    context: QueryContext,
    systemPrompt?: string
  ): string {
    const parts = [];

    if (systemPrompt) {
      parts.push(`System: ${systemPrompt}`);
    }

    if (context.previousQueries?.length) {
      parts.push('Previous context:');
      parts.push(context.previousQueries.join('\n'));
    }

    if (context.systemState) {
      parts.push('Current system state:');
      parts.push(JSON.stringify(context.systemState, null, 2));
    }

    parts.push(`User: ${prompt}`);
    return parts.join('\n\n');
  }

  private parseResponse(response: string): AssistantResponse {
    // Basic confidence scoring based on response characteristics
    const confidence = this.calculateConfidence(response);

    return {
      answer: response,
      confidence,
      sources: [],
      suggestedActions: this.extractSuggestedActions(response)
    };
  }

  private calculateConfidence(response: string): number {
    const factors = {
      length: Math.min(response.length / 500, 1) * 0.3,
      specificity: (response.match(/\b(specifically|precisely|exactly)\b/g)?.length || 0) * 0.1,
      technicalTerms: (response.match(/\b(config|system|process|function)\b/g)?.length || 0) * 0.05
    };

    return Math.min(
      1,
      Object.values(factors).reduce((sum, value) => sum + value, 0.5)
    );
  }

  private extractSuggestedActions(response: string): AssistantResponse['suggestedActions'] {
    const actions = [];
    
    // Extract configuration suggestions
    const configMatches = response.match(/configure\s+([a-zA-Z_]+)/g);
    if (configMatches) {
      actions.push({
        type: 'config',
        action: 'update_config',
        description: 'Update system configuration'
      });
    }

    // Extract command suggestions
    const commandMatches = response.match(/run\s+`([^`]+)`/g);
    if (commandMatches) {
      actions.push({
        type: 'command',
        action: 'execute_command',
        description: 'Execute recommended command'
      });
    }

    return actions;
  }
}
export interface Document {
  id: string;
  content: string;
  metadata: {
    title: string;
    source: string;
    category: string;
    timestamp: number;
  };
}

export interface QueryContext {
  userId?: string;
  systemState?: Record<string, any>;
  previousQueries?: string[];
}

export interface AssistantResponse {
  answer: string;
  confidence: number;
  sources: Document[];
  suggestedActions?: {
    type: 'command' | 'config' | 'diagnostic';
    action: string;
    description: string;
  }[];
}

export interface VectorStore {
  addDocuments(documents: Document[]): Promise<void>;
  search(query: string, limit?: number): Promise<Document[]>;
  delete(documentId: string): Promise<void>;
  clear(): Promise<void>;
}

export interface EmbeddingResult {
  vector: number[];
  text: string;
}
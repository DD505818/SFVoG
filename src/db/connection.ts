import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', '..', 'data', 'ddgpt.db');

let db: Database.Database | null = null;
let isInitialized = false;

export async function initializeDatabase(): Promise<void> {
  if (isInitialized) return;

  try {
    if (!db) {
      db = new Database(dbPath);
      db.pragma('journal_mode = WAL');
      db.pragma('foreign_keys = ON');
    }
    isInitialized = true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw new Error('Failed to initialize database');
  }
}

export function getConnection(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.');
  }
  return db;
}

export function closeConnection(): void {
  if (db) {
    try {
      db.close();
      db = null;
      isInitialized = false;
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
}
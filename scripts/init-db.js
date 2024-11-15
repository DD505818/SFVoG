import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = join(__dirname, '..', 'data', 'ddgpt.db');

try {
  const db = new Database(dbPath);
  
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Wallets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  // Assets table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assets (
      id TEXT PRIMARY KEY,
      wallet_id TEXT NOT NULL,
      symbol TEXT NOT NULL,
      name TEXT NOT NULL,
      amount REAL DEFAULT 0,
      type TEXT CHECK(type IN ('crypto', 'stock', 'forex', 'commodity')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wallet_id) REFERENCES wallets(id)
    );
  `);

  // Trades table
  db.exec(`
    CREATE TABLE IF NOT EXISTS trades (
      id TEXT PRIMARY KEY,
      wallet_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      type TEXT CHECK(type IN ('buy', 'sell')) NOT NULL,
      amount REAL NOT NULL,
      price REAL NOT NULL,
      status TEXT CHECK(status IN ('pending', 'completed', 'failed')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (wallet_id) REFERENCES wallets(id),
      FOREIGN KEY (asset_id) REFERENCES assets(id)
    );
  `);

  // AI Predictions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ai_predictions (
      id TEXT PRIMARY KEY,
      agent_id TEXT NOT NULL,
      asset_id TEXT NOT NULL,
      prediction TEXT CHECK(prediction IN ('buy', 'sell', 'hold')) NOT NULL,
      confidence REAL NOT NULL,
      reasoning TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (asset_id) REFERENCES assets(id)
    );
  `);

  console.log('Database schema created successfully');
  db.close();
} catch (error) {
  console.error('Error initializing database:', error);
  process.exit(1);
}
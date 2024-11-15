import { getConnection } from '../connection';
import type { Wallet } from '../types';

export class WalletRepository {
  private db = getConnection();

  async createWallet(wallet: Omit<Wallet, 'id' | 'created_at'>): Promise<Wallet> {
    const stmt = this.db.prepare(`
      INSERT INTO wallets (id, user_id, name, balance, created_at)
      VALUES ($id, $userId, $name, $balance, datetime('now'))
    `);

    const id = crypto.randomUUID();
    stmt.run({
      id,
      userId: wallet.user_id,
      name: wallet.name,
      balance: wallet.balance || 0
    });

    return this.getWalletById(id);
  }

  async getWalletById(id: string): Promise<Wallet> {
    const stmt = this.db.prepare('SELECT * FROM wallets WHERE id = ?');
    return stmt.get(id);
  }

  async getWalletsByUserId(userId: string): Promise<Wallet[]> {
    const stmt = this.db.prepare('SELECT * FROM wallets WHERE user_id = ?');
    return stmt.all(userId);
  }

  async updateWalletBalance(id: string, balance: number): Promise<Wallet> {
    const stmt = this.db.prepare(`
      UPDATE wallets
      SET balance = $balance
      WHERE id = $id
    `);

    stmt.run({ id, balance });
    return this.getWalletById(id);
  }

  async deleteWallet(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM wallets WHERE id = ?');
    stmt.run(id);
  }
}
import { getConnection } from '../connection';
import type { User } from '../types';

export class UserRepository {
  private db = getConnection();

  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const stmt = this.db.prepare(`
      INSERT INTO users (id, username, email, created_at)
      VALUES ($id, $username, $email, datetime('now'))
    `);

    const id = crypto.randomUUID();
    stmt.run({
      id,
      username: user.username,
      email: user.email
    });

    return this.getUserById(id);
  }

  async getUserById(id: string): Promise<User> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const stmt = this.db.prepare(`
      UPDATE users
      SET username = COALESCE($username, username),
          email = COALESCE($email, email)
      WHERE id = $id
    `);

    stmt.run({ id, ...data });
    return this.getUserById(id);
  }

  async deleteUser(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    stmt.run(id);
  }
}
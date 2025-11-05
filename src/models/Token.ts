import db from '../config/database';

export interface Token {
  id: number;
  token: string;
  email: string;
  wordCount: number;
  lastReset: string;
  createdAt?: string;
}

export interface TokenResponse {
  token: string;
}

export class TokenModel {
  static create(token: string, email: string): Token | null {
    const stmt = db.prepare(`
      INSERT INTO tokens (token, email, word_count, last_reset)
      VALUES (?, ?, 0, DATE('now'))
    `);
    
    try {
      stmt.run(token, email);
      return this.findByToken(token);
    } catch (error) {
      console.error('Error creating token:', error);
      return null;
    }
  }

  static findByToken(token: string): Token | null {
    const stmt = db.prepare('SELECT * FROM tokens WHERE token = ?');
    const row = stmt.get(token) as any;
    
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      token: row.token,
      email: row.email,
      wordCount: row.word_count,
      lastReset: row.last_reset,
      createdAt: row.created_at
    };
  }

  static updateWordCount(token: string, wordCount: number): boolean {
    const stmt = db.prepare(`
      UPDATE tokens 
      SET word_count = ? 
      WHERE token = ?
    `);
    
    try {
      const result = stmt.run(wordCount, token);
      return result.changes > 0;
    } catch (error) {
      console.error('Error updating word count:', error);
      return false;
    }
  }

  static resetWordCount(token: string): boolean {
    const stmt = db.prepare(`
      UPDATE tokens 
      SET word_count = 0, last_reset = DATE('now')
      WHERE token = ?
    `);
    
    try {
      const result = stmt.run(token);
      return result.changes > 0;
    } catch (error) {
      console.error('Error resetting word count:', error);
      return false;
    }
  }

  static deleteToken(token: string): boolean {
    const stmt = db.prepare('DELETE FROM tokens WHERE token = ?');
    
    try {
      const result = stmt.run(token);
      return result.changes > 0;
    } catch (error) {
      console.error('Error deleting token:', error);
      return false;
    }
  }

  static deleteTokensByEmail(email: string): boolean {
    const stmt = db.prepare('DELETE FROM tokens WHERE email = ?');
    
    try {
      const result = stmt.run(email);
      return result.changes >= 0; // Return true even if no tokens were found (0 changes is valid)
    } catch (error) {
      console.error('Error deleting tokens by email:', error);
      return false;
    }
  }

  static getAllTokens(): Token[] {
    const stmt = db.prepare('SELECT * FROM tokens');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      id: row.id,
      token: row.token,
      email: row.email,
      wordCount: row.word_count,
      lastReset: row.last_reset,
      createdAt: row.created_at
    }));
  }
}

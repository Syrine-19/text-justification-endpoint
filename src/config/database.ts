import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(__dirname, '../../database.sqlite');
const db: Database.Database = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    word_count INTEGER DEFAULT 0,
    last_reset DATE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_token ON tokens(token);
`);

export default db;

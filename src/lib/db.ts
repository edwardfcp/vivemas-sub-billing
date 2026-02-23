import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    stripe_customer_id TEXT,
    subscription_status TEXT DEFAULT 'inactive',
    price_id TEXT,
    period_end INTEGER
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    amount INTEGER,
    currency TEXT,
    status TEXT,
    created_at INTEGER,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`);

// Seed initial users if they don't exist
const seedUsers = [
  { id: 'user_001', name: 'Juan del Pueblo', email: 'juan@test.com' },
  { id: 'user_002', name: 'Maria Rodriguez', email: 'maria@test.com' },
  { id: 'user_003', name: 'Carlos Rivera', email: 'carlos@test.com' },
];

const insertUser = db.prepare('INSERT OR IGNORE INTO users (id, name, email) VALUES (?, ?, ?)');

seedUsers.forEach(user => {
  insertUser.run(user.id, user.name, user.email);
});

export default db;

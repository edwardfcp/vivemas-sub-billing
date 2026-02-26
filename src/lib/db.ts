import { sql } from '@vercel/postgres';
import Database from 'better-sqlite3';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.POSTGRES_URL;

// Initial mockup data
const seedUsers = [
  { id: 'user_001', name: 'Juan del Pueblo', email: 'juan@test.com' },
  { id: 'user_002', name: 'Maria Rodriguez', email: 'maria@test.com' },
  { id: 'user_003', name: 'Carlos Rivera', email: 'carlos@test.com' },
  { id: 'user_004', name: 'Ana García', email: 'ana@test.com' },
  { id: 'user_005', name: 'Roberto Mejia', email: 'roberto@test.com' },
  { id: 'user_006', name: 'Elena Santos', email: 'elena@test.com' },
];

let sqliteDb: any;

if (!isProduction) {
  const dbPath = path.join(process.cwd(), 'database.sqlite');
  sqliteDb = new Database(dbPath);

  // Sync init for SQLite
  sqliteDb.exec(`
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

  const insertUser = sqliteDb.prepare('INSERT OR IGNORE INTO users (id, name, email) VALUES (?, ?, ?)');
  seedUsers.forEach(user => {
    insertUser.run(user.id, user.name, user.email);
  });
}

// Async Bridge for Postgres vs SQLite
export const db = {
  async query(queryString: string, params: any[] = []) {
    if (isProduction) {
      // Convert ? to $1, $2, etc for Postgres
      let count = 0;
      const pgQuery = queryString.replace(/\?/g, () => `$${++count}`);
      const result = await sql.query(pgQuery, params);
      return result.rows;
    } else {
      // Note: better-sqlite3 uses ? but we handle result formats
      const stmt = sqliteDb.prepare(queryString);
      if (queryString.trim().toUpperCase().startsWith('SELECT')) {
        return stmt.all(params);
      } else {
        return stmt.run(params);
      }
    }
  },

  async get(queryString: string, params: any[] = []) {
    if (isProduction) {
      let count = 0;
      const pgQuery = queryString.replace(/\?/g, () => `$${++count}`);
      const result = await sql.query(pgQuery, params);
      return result.rows[0];
    } else {
      return sqliteDb.prepare(queryString).get(params);
    }
  },

  async init() {
    if (isProduction) {
      try {
        // Initialize Postgres Tables
        await sql`
                    CREATE TABLE IF NOT EXISTS users (
                        id TEXT PRIMARY KEY,
                        name TEXT,
                        email TEXT,
                        stripe_customer_id TEXT,
                        subscription_status TEXT DEFAULT 'inactive',
                        price_id TEXT,
                        period_end BIGINT
                    );
                `;
        await sql`
                    CREATE TABLE IF NOT EXISTS orders (
                        id TEXT PRIMARY KEY,
                        user_id TEXT REFERENCES users(id),
                        amount INTEGER,
                        currency TEXT,
                        status TEXT,
                        created_at BIGINT
                    );
                `;

        // Seed initial users
        for (const user of seedUsers) {
          await sql`
                        INSERT INTO users (id, name, email)
                        VALUES (${user.id}, ${user.name}, ${user.email})
                        ON CONFLICT (id) DO NOTHING;
                    `;
        }
        console.log('Postgres initialized and seeded.');
      } catch (err) {
        console.error('Postgres init error:', err);
      }
    }
  }
};

export default db;

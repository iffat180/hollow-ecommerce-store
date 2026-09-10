import { Pool, types } from 'pg';

/**
 * PostgreSQL connection pool.
 *
 * - Single pool reused across module reloads (dev hot-reload) and warm
 *   serverless invocations via a globalThis cache, so we never leak pools.
 * - DATABASE_URL should point at a pooled endpoint (e.g. Neon's `-pooler`
 *   host / PgBouncer) so many serverless instances share a bounded number of
 *   real Postgres connections.
 * - NUMERIC/DECIMAL columns are parsed to JS numbers (see note below).
 */

// pg returns NUMERIC/DECIMAL as strings by default (to avoid float precision
// loss). Prices here are small, so parse them to numbers to match our types.
types.setTypeParser(1700 /* NUMERIC */, (value) =>
  value === null ? null : parseFloat(value)
);

function createPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL not set — database features will not work');
    return null;
  }

  const isLocalhost =
    connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  const pool = new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
    // Keep this small: with a serverless deployment many instances each hold a
    // pool, and they all sit behind the upstream pooler.
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  });

  pool.on('error', (err) => {
    console.error('Unexpected idle database client error:', err);
  });

  return pool;
}

// Cache on globalThis so Next.js dev hot-reload and warm lambda re-imports
// reuse the same pool instead of opening a new one every time.
const globalForPool = globalThis as unknown as { __hollowPgPool?: Pool | null };

const pool: Pool | null = globalForPool.__hollowPgPool ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalForPool.__hollowPgPool = pool;
}

export default pool;

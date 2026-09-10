import { Pool } from 'pg';
import * as dotenv from 'dotenv';

// Standalone script — load env from .env.local (Next.js doesn't run here).
dotenv.config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('❌ DATABASE_URL is not set in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes('localhost') ? false : { rejectUnauthorized: false },
});

const statements: Array<[label: string, sql: string]> = [
  [
    'products table',
    `CREATE TABLE IF NOT EXISTS products (
       id             SERIAL PRIMARY KEY,
       name           VARCHAR(255) NOT NULL,
       slug           VARCHAR(255) UNIQUE NOT NULL,
       description    TEXT,
       price          DECIMAL(10, 2) NOT NULL,
       original_price DECIMAL(10, 2),
       category       VARCHAR(100),
       stock          INTEGER DEFAULT 0,
       image_url      TEXT,
       rating         DECIMAL(2, 1),
       reviews_count  INTEGER DEFAULT 0,
       created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );`,
  ],
  [
    'orders table',
    `CREATE TABLE IF NOT EXISTS orders (
       id                SERIAL PRIMARY KEY,
       stripe_session_id VARCHAR(255) UNIQUE NOT NULL,
       customer_email    VARCHAR(255) NOT NULL,
       customer_name     VARCHAR(255),
       amount_total      DECIMAL(10, 2) NOT NULL,
       payment_status    VARCHAR(50) DEFAULT 'pending',
       created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );`,
  ],
  [
    'order_items table',
    `CREATE TABLE IF NOT EXISTS order_items (
       id           SERIAL PRIMARY KEY,
       order_id     INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
       product_id   INTEGER REFERENCES products(id),
       product_name VARCHAR(255) NOT NULL,
       quantity     INTEGER NOT NULL,
       price        DECIMAL(10, 2) NOT NULL,
       created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );`,
  ],
  [
    'processed_stripe_events table (webhook idempotency)',
    `CREATE TABLE IF NOT EXISTS processed_stripe_events (
       event_id     VARCHAR(255) PRIMARY KEY,
       event_type   VARCHAR(100) NOT NULL,
       processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );`,
  ],
  ['order_items.order_id index', `CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);`],
  ['orders.created_at index', `CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);`],
];

async function migrate() {
  console.log('🚀 Running migration...');
  try {
    for (const [label, sql] of statements) {
      await pool.query(sql);
      console.log(`✅ ${label}`);
    }
    console.log('🎉 Migration complete');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

migrate();

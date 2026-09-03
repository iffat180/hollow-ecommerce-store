import { Pool } from 'pg';

// Initialize pool only if DATABASE_URL exists
// This prevents blocking server startup if env var is missing
const pool: Pool | null = process.env.DATABASE_URL 
  ? (() => {
      const dbUrl = process.env.DATABASE_URL!;
      const isLocalhost = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1');
      const isNeon = dbUrl.includes('neon.tech');
      
      const p = new Pool({
        connectionString: dbUrl,
        // Neon requires SSL, other cloud providers also need it
        ssl: isLocalhost 
          ? false 
          : {
              rejectUnauthorized: false // Required for Neon, Railway, Heroku, etc.
            },
        // Neon connection pooling optimizations
        max: isNeon ? 10 : 20, // Neon recommends lower connection pool size
      });

      // Test connection on initialization (optional, for debugging)
      p.on('connect', () => {
        console.log('Database connected successfully');
      });

      p.on('error', (err) => {
        console.error('Unexpected database error:', err);
      });

      return p;
    })()
  : null;

if (!pool) {
  console.warn('⚠️  DATABASE_URL not found in .env.local - database features will not work');
}

export default pool;

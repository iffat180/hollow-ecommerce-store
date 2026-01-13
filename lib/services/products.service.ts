import pool from '../config/database';
import { Product } from '../types';

/**
 * Get all products from database
 * @returns Array of products
 * @throws Error if database query fails
 */
export async function getAllProducts(): Promise<Product[]> {
  // Check if database is configured
  if (!pool) {
    throw new Error('Database not configured. Please set DATABASE_URL in your .env.local file.');
  }
  
  const result = await pool.query(
    'SELECT * FROM products ORDER BY created_at DESC'
  );
  return result.rows;
}

/**
 * Get a single product by slug
 * @param slug - Product slug identifier
 * @returns Product object or null if not found
 * @throws Error if database query fails
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Check if database is configured
  if (!pool) {
    throw new Error('Database not configured. Please set DATABASE_URL in your .env.local file.');
  }
  
  const result = await pool.query(
    'SELECT * FROM products WHERE slug = $1',
    [slug]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return result.rows[0];
}

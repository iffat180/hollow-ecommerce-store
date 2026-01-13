import { NextResponse } from 'next/server';
import pool from '@/lib/config/database';

/**
 * GET /api/test-db
 * Test database connection
 */
export async function GET() {
  try {
    // Test if pool is defined
    if (!pool) {
      return NextResponse.json({
        success: false,
        error: 'Database pool is undefined',
      }, { status: 500 });
    }

    // Test connection
    const result = await pool.query('SELECT NOW()');
    
    return NextResponse.json({
      success: true,
      message: 'Database connected successfully',
      serverTime: result.rows[0],
    });
  } catch (error) {
    console.error('Database test failed:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/services/products.service';
import { ApiResponse, Product } from '@/lib/types';

// Cache products for 60 seconds (revalidate every minute)
export const revalidate = 60;

/**
 * GET /api/products
 * Get all products
 */
export async function GET(request: NextRequest) {
  try {
    const products = await getAllProducts();
    
    const response: ApiResponse<Product[]> = {
      success: true,
      data: products,
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    const response: ApiResponse<Product[]> = {
      success: false,
      error: 'Failed to fetch products',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/services/products.service';
import { ApiResponse, Product } from '@/lib/types';

// Cache individual products for 5 minutes
export const revalidate = 300;

/**
 * GET /api/products/[slug]
 * Get a single product by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    const product = await getProductBySlug(slug);
    
    if (!product) {
      const response: ApiResponse<Product> = {
        success: false,
        error: 'Product not found',
      };
      
      return NextResponse.json(response, { status: 404 });
    }
    
    const response: ApiResponse<Product> = {
      success: true,
      data: product,
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    
    const response: ApiResponse<Product> = {
      success: false,
      error: 'Failed to fetch product',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

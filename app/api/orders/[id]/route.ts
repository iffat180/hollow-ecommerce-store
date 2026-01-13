import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/services/orders.service';
import { ApiResponse, OrderWithItems } from '@/lib/types';

/**
 * GET /api/orders/[id]
 * Get order by ID with associated items
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);
    
    if (isNaN(orderId)) {
      const response: ApiResponse<OrderWithItems> = {
        success: false,
        error: 'Invalid order ID',
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const order = await getOrderById(orderId);
    
    if (!order) {
      const response: ApiResponse<OrderWithItems> = {
        success: false,
        error: 'Order not found',
      };
      
      return NextResponse.json(response, { status: 404 });
    }
    
    const response: ApiResponse<OrderWithItems> = {
      success: true,
      data: order,
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching order:', error);
    
    const response: ApiResponse<OrderWithItems> = {
      success: false,
      error: 'Failed to fetch order',
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}

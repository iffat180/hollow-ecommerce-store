import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/services/orders.service';
import { ApiResponse, Order } from '@/lib/types';

/**
 * POST /api/orders
 * Create an order after successful payment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      const response: ApiResponse<Order> = {
        success: false,
        error: 'Session ID is required',
      };
      
      return NextResponse.json(response, { status: 400 });
    }
    
    const order = await createOrder(sessionId);
    
    const response: ApiResponse<Order> = {
      success: true,
      data: order,
      message: 'Order created successfully',
    };
    
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    
    const response: ApiResponse<Order> = {
      success: false,
      error: errorMessage,
    };
    
    return NextResponse.json(response, { status: 400 });
  }
}

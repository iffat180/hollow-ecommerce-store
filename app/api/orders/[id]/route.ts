import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/services/orders.service';
import { ApiResponse, OrderWithItems } from '@/lib/types';

/**
 * GET /api/orders/[id]
 * Get one order by id, with its line items.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id, 10);

    if (isNaN(orderId)) {
      return NextResponse.json<ApiResponse<OrderWithItems>>(
        { success: false, error: 'Invalid order ID' },
        { status: 400 }
      );
    }

    const order = await getOrderById(orderId);

    if (!order) {
      return NextResponse.json<ApiResponse<OrderWithItems>>(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<OrderWithItems>>(
      { success: true, data: order },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json<ApiResponse<OrderWithItems>>(
      { success: false, error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { persistOrderFromSession } from '@/lib/services/orders.service';
import { ApiResponse, Order } from '@/lib/types';

/**
 * POST /api/orders
 * Create the order for a paid Stripe session.
 *
 * This is the "fast path" the browser calls when it lands on /success so the
 * confirmation page can show an order number immediately. The Stripe webhook
 * (/api/webhooks/stripe) is the authoritative trigger — both call the same
 * idempotent service, so running both is safe.
 */
export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json<ApiResponse<Order>>(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    const { order, created } = await persistOrderFromSession(sessionId);

    return NextResponse.json<ApiResponse<Order>>(
      {
        success: true,
        data: order,
        message: created ? 'Order created successfully' : 'Order already exists',
      },
      { status: created ? 201 : 200 }
    );
  } catch (error) {
    if ((error as { code?: string }).code === 'PAYMENT_NOT_COMPLETED') {
      return NextResponse.json<ApiResponse<Order>>(
        { success: false, error: 'Payment not completed' },
        { status: 400 }
      );
    }

    console.error('Error creating order:', error);
    return NextResponse.json<ApiResponse<Order>>(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

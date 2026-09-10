import { NextRequest, NextResponse } from 'next/server';
import { getOrderBySession } from '@/lib/services/orders.service';
import { ApiResponse, OrderWithItems } from '@/lib/types';

/**
 * GET /api/orders/[sessionId]
 *
 * Look up an order by its Stripe checkout session id (e.g. `cs_live_a1b2...`).
 *
 * We key on the session id, not the numeric order id, on purpose: order ids are
 * small sequential integers that anyone could enumerate, and there's no user
 * login to check ownership against. The session id is a long unguessable token
 * that only the person who completed that checkout ever receives (it's in their
 * success-page URL), so possessing it stands in for "this is my order".
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;

    if (!sessionId || !sessionId.startsWith('cs_')) {
      return NextResponse.json<ApiResponse<OrderWithItems>>(
        { success: false, error: 'Invalid session ID' },
        { status: 400 }
      );
    }

    const order = await getOrderBySession(sessionId);

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

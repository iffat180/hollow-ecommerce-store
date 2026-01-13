import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/services/checkout.service';
import { ApiResponse, CheckoutSessionRequest, CheckoutSessionResponse } from '@/lib/types';

/**
 * POST /api/checkout/create-session
 * Create a Stripe checkout session
 */
export async function POST(request: NextRequest) {
  try {
    const body: CheckoutSessionRequest = await request.json();
    
    const sessionData = await createCheckoutSession(body);
    
    const response: ApiResponse<CheckoutSessionResponse> = {
      success: true,
      data: sessionData,
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
    
    const response: ApiResponse<CheckoutSessionResponse> = {
      success: false,
      error: errorMessage,
    };
    
    return NextResponse.json(response, { status: 400 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/services/checkout.service';
import { ApiResponse, VerifyPaymentRequest, VerifyPaymentResponse } from '@/lib/types';

/**
 * POST /api/checkout/verify
 * Verify payment status of a Stripe session
 */
export async function POST(request: NextRequest) {
  try {
    const body: VerifyPaymentRequest = await request.json();
    
    const paymentData = await verifyPayment(body.sessionId);
    
    const response: ApiResponse<VerifyPaymentResponse> = {
      success: true,
      data: paymentData,
    };
    
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error verifying payment:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to verify payment';
    
    const response: ApiResponse<VerifyPaymentResponse> = {
      success: false,
      error: errorMessage,
    };
    
    return NextResponse.json(response, { status: 400 });
  }
}

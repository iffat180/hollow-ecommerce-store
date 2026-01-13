import stripe from '../config/stripe';
import { CheckoutSessionRequest, CheckoutSessionResponse, VerifyPaymentResponse } from '../types';

/**
 * Create a Stripe checkout session
 * @param data - Checkout session request data
 * @returns Stripe session ID and URL
 * @throws Error if session creation fails or validation fails
 */
export async function createCheckoutSession(
  data: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  // Check if Stripe is configured
  if (!stripe) {
    throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY in your .env.local file.');
  }

  const { items, customerEmail, customerName } = data;

  // Validate request
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Cart items are required');
  }

  if (!customerEmail || !customerName) {
    throw new Error('Customer email and name are required');
  }

  // Format items for Stripe
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        images: item.image_url
          ? [`${item.image_url.startsWith('http') 
              ? item.image_url 
              : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${item.image_url}`}`]
          : [],
      },
      unit_amount: Math.round(item.price * 100), // Convert to cents
    },
    quantity: item.quantity,
  }));

  // Create Stripe checkout session
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_BASE_URL is not defined');
  }
  
  if (!baseUrl.startsWith('http')) {
    throw new Error('NEXT_PUBLIC_BASE_URL must be an absolute URL');
  }
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    customer_email: customerEmail,
    metadata: {
      customerName,
    },
  });
  

  return {
    sessionId: session.id,
    url: session.url ?? '',
  };
}

/**
 * Verify payment status of a Stripe checkout session
 * @param sessionId - Stripe session ID
 * @returns Payment verification details
 * @throws Error if session not found or payment not completed
 */
export async function verifyPayment(sessionId: string): Promise<VerifyPaymentResponse> {
  // Check if Stripe is configured
  if (!stripe) {
    throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY in your .env.local file.');
  }

  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  // Retrieve session from Stripe
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  // Check if payment was successful
  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed');
  }

  return {
    sessionId: session.id,
    customerEmail: session.customer_email ?? '',
    customerName: session.metadata?.customerName ?? '',
    amountTotal: session.amount_total ? session.amount_total / 100 : 0,
    paymentStatus: session.payment_status,
    lineItems: session.line_items,
  };
}

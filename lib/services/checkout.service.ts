import stripe from '../config/stripe';
import pool from '../config/database';
import {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  VerifyPaymentResponse,
} from '../types';

/**
 * Create a Stripe Checkout session for the given cart.
 *
 * Security note: the client only gets to choose *which product* and *how many*.
 * Names, prices and images are read from the database here — never trusted from
 * the request body — so a tampered cart can't set its own price.
 */
export async function createCheckoutSession(
  data: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  if (!stripe) {
    throw new Error('Stripe not configured. Set STRIPE_SECRET_KEY in .env.local');
  }
  if (!pool) {
    throw new Error('Database not configured. Set DATABASE_URL in .env.local');
  }

  const { items, customerEmail, customerName } = data;

  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Cart items are required');
  }
  if (!customerEmail || !customerName) {
    throw new Error('Customer email and name are required');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl || !baseUrl.startsWith('http')) {
    throw new Error('NEXT_PUBLIC_BASE_URL must be set to an absolute URL');
  }

  // Normalise the requested quantities, keyed by product id.
  const quantities = new Map<number, number>();
  for (const item of items) {
    const id = Number(item.id);
    const qty = Number(item.quantity);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('Invalid product in cart');
    }
    if (!Number.isInteger(qty) || qty <= 0 || qty > 99) {
      throw new Error('Invalid quantity in cart');
    }
    quantities.set(id, (quantities.get(id) ?? 0) + qty);
  }

  // Look up the real products. This is the source of truth for price/name/image.
  const ids = [...quantities.keys()];
  const { rows: products } = await pool.query(
    `SELECT id, name, price, image_url FROM products WHERE id = ANY($1::int[])`,
    [ids]
  );

  if (products.length !== ids.length) {
    throw new Error('One or more products in the cart no longer exist');
  }

  const lineItems = products.map((product) => {
    const image = product.image_url
      ? product.image_url.startsWith('http')
        ? product.image_url
        : `${baseUrl}${product.image_url}`
      : undefined;

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          ...(image ? { images: [image] } : {}),
        },
        unit_amount: Math.round(Number(product.price) * 100), // dollars -> cents
      },
      quantity: quantities.get(product.id)!,
    };
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/cancel`,
    customer_email: customerEmail,
    metadata: { customerName },
  });

  return {
    sessionId: session.id,
    url: session.url ?? '',
  };
}

/**
 * Verify the payment status of a Stripe checkout session (read-only).
 */
export async function verifyPayment(sessionId: string): Promise<VerifyPaymentResponse> {
  if (!stripe) {
    throw new Error('Stripe not configured. Set STRIPE_SECRET_KEY in .env.local');
  }
  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

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

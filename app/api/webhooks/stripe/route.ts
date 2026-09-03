import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import stripe from '@/lib/config/stripe';
import { persistOrderFromSession } from '@/lib/services/orders.service';

// Signature verification needs the raw body + Node crypto, so pin the runtime
// and never let this response be cached.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * POST /api/webhooks/stripe
 *
 * Called by Stripe's servers (not the browser). This is the authoritative
 * trigger for order creation — it fires even if the customer never returns to
 * /success. Stripe retries on non-2xx, and persistOrderFromSession is
 * idempotent, so retries are safe.
 */
export async function POST(request: NextRequest) {
  if (!stripe || !webhookSecret) {
    console.error('Stripe webhook not configured (STRIPE_SECRET_KEY / STRIPE_WEBHOOK_SECRET)');
    return new NextResponse('Webhook not configured', { status: 500 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new NextResponse('Missing stripe-signature header', { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', (err as Error).message);
    return new NextResponse(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { created } = await persistOrderFromSession(session.id);
        console.log(
          `[stripe] ${event.type} ${session.id}: order ${created ? 'created' : 'already existed'}`
        );
        break;
      }
      default:
        // Acknowledge everything else so Stripe stops retrying it.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if ((error as { code?: string }).code === 'PAYMENT_NOT_COMPLETED') {
      // Not paid yet (delayed payment method). Ack now; the
      // async_payment_succeeded event will create the order later.
      return NextResponse.json({ received: true, ignored: 'payment not completed' });
    }
    // 500 => Stripe retries later (safe, thanks to idempotency).
    console.error('Error handling webhook event:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

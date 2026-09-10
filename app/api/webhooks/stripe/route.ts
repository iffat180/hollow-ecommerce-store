import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import stripe from '@/lib/config/stripe';
import {
  persistOrderFromSession,
  cancelOrderForSession,
  claimStripeEvent,
  releaseStripeEvent,
} from '@/lib/services/orders.service';

// Signature verification needs the raw body + Node crypto, so pin the runtime
// and never cache this response.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

/**
 * POST /api/webhooks/stripe
 *
 * Stripe -> our server. Authoritative trigger for order reconciliation: fires
 * even if the customer never returns to /success. Safe to receive repeatedly:
 *   1. event-level dedupe via processed_stripe_events (Stripe re-delivers events)
 *   2. session-level idempotency inside persistOrderFromSession
 * Non-2xx makes Stripe retry, which both layers tolerate.
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

  // Event-level dedupe: Stripe re-delivers events. If we've already handled this
  // one, ack and skip. (Session-level idempotency below is the real guarantee;
  // this just avoids redundant work.)
  try {
    const isNew = await claimStripeEvent(event.id, event.type);
    if (!isNew) {
      return NextResponse.json({ received: true, duplicate: true });
    }
  } catch (error) {
    console.error('Event bookkeeping failed, will retry:', error);
    return new NextResponse('Event bookkeeping failed', { status: 500 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        const { created, reconciled } = await persistOrderFromSession(session.id);
        console.log(
          `[stripe] ${event.type} ${session.id}: ${
            created ? 'order created' : reconciled ? 'order status reconciled' : 'already up to date'
          }`
        );
        break;
      }

      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        await cancelOrderForSession(session.id);
        console.log(`[stripe] ${event.type} ${session.id}: order cancelled if present`);
        break;
      }

      default:
        // Acknowledged (and recorded) so Stripe stops re-sending it.
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    if ((error as { code?: string }).code === 'PAYMENT_NOT_COMPLETED') {
      // Not paid yet — ack now; async_payment_succeeded will reconcile later.
      return NextResponse.json({ received: true, ignored: 'payment not completed' });
    }
    // Release the claim so Stripe's retry re-runs the handler instead of
    // being skipped as a duplicate. 500 => Stripe retries.
    await releaseStripeEvent(event.id).catch(() => {});
    console.error('Error handling webhook event:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}

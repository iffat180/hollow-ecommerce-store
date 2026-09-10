import pool from '../config/database';
import stripe from '../config/stripe';
import { Order, OrderWithItems } from '../types';

/**
 * Record that a Stripe webhook event has been handled.
 * @returns true if this is the first time we've seen the event (process it),
 *          false if it was already processed (skip — Stripe re-delivered it).
 */
export async function claimStripeEvent(
  eventId: string,
  eventType: string
): Promise<boolean> {
  if (!pool) throw new Error('Database not configured');
  const result = await pool.query(
    `INSERT INTO processed_stripe_events (event_id, event_type)
     VALUES ($1, $2)
     ON CONFLICT (event_id) DO NOTHING`,
    [eventId, eventType]
  );
  return (result.rowCount ?? 0) > 0;
}

/**
 * Undo claimStripeEvent — call this if handling the event failed, so a Stripe
 * retry re-processes it instead of being skipped as a duplicate.
 */
export async function releaseStripeEvent(eventId: string): Promise<void> {
  if (!pool) return;
  await pool.query('DELETE FROM processed_stripe_events WHERE event_id = $1', [eventId]);
}

/**
 * Reconcile the local order for a Stripe checkout session against Stripe,
 * which is the source of truth:
 *   - session paid, no local order      -> create order + items
 *   - session paid, local order exists  -> ensure payment_status matches
 *   - session not paid                  -> throws PAYMENT_NOT_COMPLETED
 *
 * Idempotent and race-safe (UNIQUE stripe_session_id + ON CONFLICT, all in a
 * transaction), so the browser /success call and repeated webhook deliveries
 * can all run this without creating duplicates.
 */
export async function persistOrderFromSession(
  sessionId: string
): Promise<{ order: Order; created: boolean; reconciled: boolean }> {
  if (!sessionId) throw new Error('Session ID is required');
  if (!pool) throw new Error('Database not configured');
  if (!stripe) throw new Error('Stripe not configured');

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  if (session.payment_status !== 'paid') {
    const err = new Error('Payment not completed') as Error & { code?: string };
    err.code = 'PAYMENT_NOT_COMPLETED';
    throw err;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const insertResult = await client.query<Order>(
      `INSERT INTO orders
         (stripe_session_id, customer_email, customer_name, amount_total, payment_status)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (stripe_session_id) DO NOTHING
       RETURNING *`,
      [
        session.id,
        session.customer_email || session.customer_details?.email || 'unknown',
        session.metadata?.customerName || session.customer_details?.name || 'Guest',
        session.amount_total ? session.amount_total / 100 : 0,
        'paid',
      ]
    );

    // Order already existed -> reconcile its status, leave items alone.
    if (insertResult.rows.length === 0) {
      const updated = await client.query<Order>(
        `UPDATE orders SET payment_status = 'paid'
         WHERE stripe_session_id = $1 AND payment_status <> 'paid'
         RETURNING *`,
        [session.id]
      );
      const existing =
        updated.rows[0] ??
        (
          await client.query<Order>('SELECT * FROM orders WHERE stripe_session_id = $1', [
            session.id,
          ])
        ).rows[0];
      await client.query('COMMIT');
      return { order: existing, created: false, reconciled: updated.rows.length > 0 };
    }

    const order = insertResult.rows[0];

    for (const item of session.line_items?.data ?? []) {
      const stripeProduct = item.price?.product;
      const productName =
        typeof stripeProduct === 'object' &&
        stripeProduct !== null &&
        'name' in stripeProduct
          ? (stripeProduct.name as string)
          : item.description || 'Unknown Product';

      const productLookup = await client.query('SELECT id FROM products WHERE name = $1', [
        productName,
      ]);
      const productId = productLookup.rows.length > 0 ? productLookup.rows[0].id : null;

      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          order.id,
          productId,
          productName,
          item.quantity || 1,
          item.amount_total ? item.amount_total / 100 : 0,
        ]
      );
    }

    await client.query('COMMIT');
    return { order, created: true, reconciled: false };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Mark the order for a session as cancelled — used when Stripe reports the
 * payment failed or the checkout session expired. No-op if there's no order.
 */
export async function cancelOrderForSession(sessionId: string): Promise<void> {
  if (!pool) throw new Error('Database not configured');
  await pool.query(
    `UPDATE orders SET payment_status = 'cancelled'
     WHERE stripe_session_id = $1 AND payment_status NOT IN ('paid', 'shipped')`,
    [sessionId]
  );
}

/**
 * Get an order by id, with its line items (joined to products for name/image).
 */
export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  if (!pool) throw new Error('Database not configured');

  const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  if (orderResult.rows.length === 0) return null;

  const itemsResult = await pool.query(
    `SELECT oi.*, p.image_url
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [id]
  );

  return { ...orderResult.rows[0], items: itemsResult.rows };
}

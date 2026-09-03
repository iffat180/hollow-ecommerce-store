import pool from '../config/database';
import stripe from '../config/stripe';
import { Order, OrderWithItems } from '../types';

/**
 * Create an order from a completed Stripe checkout session.
 *
 * Idempotent and race-safe: it can be called multiple times for the same
 * session id (Stripe retries webhooks; the browser may hit /success more than
 * once) and will only ever create one order + one set of order_items.
 *
 * @param sessionId - Stripe checkout session id
 * @returns the order plus whether this call was the one that created it
 * @throws Error('Payment not completed') with code 'PAYMENT_NOT_COMPLETED'
 */
export async function persistOrderFromSession(
  sessionId: string
): Promise<{ order: Order; created: boolean }> {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }
  if (!pool) {
    throw new Error('Database not configured. Set DATABASE_URL in .env.local');
  }
  if (!stripe) {
    throw new Error('Stripe not configured. Set STRIPE_SECRET_KEY in .env.local');
  }

  // Pull the session (with line items) from Stripe — the source of truth.
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

    // Insert the order. The UNIQUE constraint on stripe_session_id + ON CONFLICT
    // makes this atomic: concurrent callers can't both create a row, and there
    // is no check-then-insert race.
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

    // Zero rows back => the order already existed. Return it, don't re-insert items.
    if (insertResult.rows.length === 0) {
      const existing = await client.query<Order>(
        'SELECT * FROM orders WHERE stripe_session_id = $1',
        [session.id]
      );
      await client.query('COMMIT');
      return { order: existing.rows[0], created: false };
    }

    const order = insertResult.rows[0];

    // Insert one order_items row per line item, in the same transaction.
    for (const item of session.line_items?.data ?? []) {
      const stripeProduct = item.price?.product;
      const productName =
        typeof stripeProduct === 'object' &&
        stripeProduct !== null &&
        'name' in stripeProduct
          ? (stripeProduct.name as string)
          : item.description || 'Unknown Product';

      const productLookup = await client.query(
        'SELECT id FROM products WHERE name = $1',
        [productName]
      );
      const productId =
        productLookup.rows.length > 0 ? productLookup.rows[0].id : null;

      await client.query(
        `INSERT INTO order_items
           (order_id, product_id, product_name, quantity, price)
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
    return { order, created: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Get an order by id, with its line items (joined to products for name/image).
 * @returns the order with items, or null if not found
 */
export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  if (!pool) {
    throw new Error('Database not configured. Set DATABASE_URL in .env.local');
  }

  const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
  if (orderResult.rows.length === 0) {
    return null;
  }

  const order = orderResult.rows[0];

  const itemsResult = await pool.query(
    `SELECT oi.*, p.name AS product_name_lookup, p.image_url
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [id]
  );

  return { ...order, items: itemsResult.rows };
}

import pool from '../config/database';
import stripe from '../config/stripe';
import { Order, OrderWithItems } from '../types';

/**
 * Create an order after successful Stripe payment
 * @param sessionId - Stripe session ID
 * @returns Created order object
 * @throws Error if session invalid, payment incomplete, or database operation fails
 */
export async function createOrder(sessionId: string): Promise<Order> {
  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  // Check if database is configured
  if (!pool) {
    throw new Error('Database not configured. Please set DATABASE_URL in your .env.local file.');
  }

  // Check if Stripe is configured
  if (!stripe) {
    throw new Error('Stripe not configured. Please set STRIPE_SECRET_KEY in your .env.local file.');
  }

  // Retrieve Stripe checkout session
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ['line_items', 'line_items.data.price.product'],
  });

  // Payment must be completed
  if (session.payment_status !== 'paid') {
    throw new Error('Payment not completed');
  }

  // Prevent duplicate orders (check outside transaction for performance)
  const existingOrder = await pool.query(
    'SELECT id FROM orders WHERE stripe_session_id = $1',
    [sessionId]
  );

  if (existingOrder.rows.length > 0) {
    // Return existing order instead of creating duplicate
    return existingOrder.rows[0];
  }

  // Use transaction to ensure atomicity (all or nothing)
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders 
       (stripe_session_id, customer_email, customer_name, amount_total, payment_status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        session.id,
        session.customer_email,
        session.metadata?.customerName || session.customer_details?.name || 'Guest',
        session.amount_total ? session.amount_total / 100 : 0,
        'completed',
      ]
    );

    const order = orderResult.rows[0];

    // Insert order items
    if (session.line_items && session.line_items.data) {
      for (const item of session.line_items.data) {
        const stripeProduct = item.price?.product;

        // Product Name (REQUIRED in DB)
        // Handle Stripe product type: can be string (ID), Product object, or DeletedProduct
        let productName: string | null = null;
        if (typeof stripeProduct === 'object' && stripeProduct !== null && 'name' in stripeProduct) {
          productName = stripeProduct.name as string;
        }
        
        const productNameFinal = productName || item.description || 'Unknown Product';

        // Try to match product in "products" table
        const productLookup = await client.query(
          'SELECT id FROM products WHERE name = $1',
          [productNameFinal]
        );

        const productId =
          productLookup.rows.length > 0 ? productLookup.rows[0].id : null;

        // Insert order item
        await client.query(
          `INSERT INTO order_items 
           (order_id, product_id, product_name, quantity, price)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            order.id,
            productId,
            productNameFinal,
            item.quantity || 1,
            item.amount_total ? item.amount_total / 100 : 0,
          ]
        );
      }
    }

    // Commit transaction
    await client.query('COMMIT');
    return order;
  } catch (error) {
    // Rollback on any error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Always release the client back to the pool
    client.release();
  }
}

/**
 * Get order by ID with associated order items
 * @param id - Order ID
 * @returns Order with items or null if not found
 * @throws Error if database query fails
 */
export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  // Check if database is configured
  if (!pool) {
    throw new Error('Database not configured. Please set DATABASE_URL in your .env.local file.');
  }
  
  const orderResult = await pool.query(
    'SELECT * FROM orders WHERE id = $1',
    [id]
  );

  if (orderResult.rows.length === 0) {
    return null;
  }

  const order = orderResult.rows[0];

  // Fetch order items
  const itemsResult = await pool.query(
    `SELECT oi.*, p.name AS product_name_lookup, p.image_url
     FROM order_items oi
     LEFT JOIN products p ON oi.product_id = p.id
     WHERE oi.order_id = $1`,
    [id]
  );

  return {
    ...order,
    items: itemsResult.rows,
  };
}

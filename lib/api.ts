import {
  Product,
  ApiResponse,
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  Order,
  OrderWithItems,
} from './types';

// Use relative paths for Next.js API routes (no external API URL needed)
// Next.js will handle routing internally

// ==================== PRODUCTS ====================

/**
 * Get all products
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/products', {
      cache: 'no-store', // Disable caching for fresh data
    });
    const result: ApiResponse<Product[]> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch products');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  try {
    const response = await fetch(`/api/products/${slug}`, {
      cache: 'no-store', // Disable caching for fresh data
    });
    const result: ApiResponse<Product> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch product');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// ==================== CHECKOUT ====================

/**
 * Create Stripe checkout session
 */
export async function createCheckoutSession(
  data: CheckoutSessionRequest
): Promise<CheckoutSessionResponse> {
  try {
    const response = await fetch('/api/checkout/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result: ApiResponse<CheckoutSessionResponse> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to create checkout session');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Verify payment
 */
export async function verifyPayment(
  sessionId: string
): Promise<VerifyPaymentResponse> {
  try {
    const response = await fetch('/api/checkout/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    const result: ApiResponse<VerifyPaymentResponse> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to verify payment');
    }

    return result.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
}

// ==================== ORDERS ====================

/**
 * Create order after payment
 */
export async function createOrder(sessionId: string): Promise<Order> {
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });

    const result: ApiResponse<Order> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to create order');
    }

    return result.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

/**
 * Get order by Stripe checkout session id
 */
export async function getOrderBySession(sessionId: string): Promise<OrderWithItems> {
  try {
    const response = await fetch(`/api/orders/${sessionId}`, {
      cache: 'no-store', // Disable caching for fresh data
    });
    const result: ApiResponse<OrderWithItems> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch order');
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
}

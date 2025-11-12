// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  original_price: number;        
  description: string | null;
  image_url: string | null;
  rating: number;                
  reviews_count: number;         
  stock: number;
  created_at: string;
}

// Cart Item (Frontend only - includes quantity)
export interface CartItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  image_url: string | null;
  quantity: number;
}

// Order Types
export interface Order {
  id: number;
  stripe_session_id: string;
  customer_email: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  quantity: number;
  price: number;
  name?: string;
  image_url?: string;
}

export interface OrderWithItems extends Order {
  items: OrderItem[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Checkout Types
export interface CheckoutSessionRequest {
  items: CartItem[];
  customerEmail: string;
  customerName: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface VerifyPaymentRequest {
  sessionId: string;
}

export interface VerifyPaymentResponse {
  sessionId: string;
  customerEmail: string;
  customerName: string;
  amountTotal: number;
  paymentStatus: string;
  lineItems?: any;
}
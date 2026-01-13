import Stripe from 'stripe';

// Initialize Stripe only if STRIPE_SECRET_KEY exists
// This prevents blocking server startup if env var is missing
const stripe: Stripe | null = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia', // Valid Stripe API version
      typescript: true,
    })
  : null;

if (!stripe) {
  console.warn('⚠️  STRIPE_SECRET_KEY not found in .env.local - Stripe features will not work');
}

export default stripe;

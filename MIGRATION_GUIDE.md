# Express to Next.js Migration Guide

## ✅ Migration Complete

Your Express + TypeScript backend has been successfully migrated to Next.js App Router Route Handlers.

## What Was Changed

### 1. **Dependencies Added**
- `pg` (^8.13.1) - PostgreSQL client
- `stripe` (^17.5.0) - Stripe payment processing
- `@types/pg` (^8.11.10) - TypeScript types for pg

Run `npm install` (already done) to install these packages.

### 2. **Config Files Converted** (`lib/config/`)
- **database.ts**: Converted to use Next.js environment variables (removed `dotenv`)
- **stripe.ts**: Updated to use modern Stripe TypeScript SDK with proper API version

Both files are now Next.js compatible and don't require manual `dotenv.config()`.

### 3. **Service Files Refactored** (`lib/services/`)
All service files now contain **pure business logic** (framework-agnostic):

- **products.service.ts**: 
  - `getAllProducts()` - Returns array of products
  - `getProductBySlug(slug)` - Returns product or null

- **checkout.service.ts**:
  - `createCheckoutSession(data)` - Creates Stripe session
  - `verifyPayment(sessionId)` - Verifies payment status

- **orders.service.ts**:
  - `createOrder(sessionId)` - Creates order from Stripe session
  - `getOrderById(id)` - Fetches order with items

**Note**: Services throw errors (not send responses). Route handlers catch and format them.

### 4. **Route Handlers Created** (`app/api/`)
All Express routes converted to Next.js Route Handlers:

| Express Route | Next.js Route Handler | Method |
|---------------|----------------------|--------|
| `/api/products` | `app/api/products/route.ts` | GET |
| `/api/products/:slug` | `app/api/products/[slug]/route.ts` | GET |
| `/api/checkout/create-session` | `app/api/checkout/create-session/route.ts` | POST |
| `/api/checkout/verify` | `app/api/checkout/verify/route.ts` | POST |
| `/api/orders` | `app/api/orders/route.ts` | POST |
| `/api/orders/:id` | `app/api/orders/[id]/route.ts` | GET |

**Key differences from Express**:
- Use `NextRequest` and `NextResponse` (Web standard)
- Export named functions: `GET`, `POST`, etc.
- Use `await params` to access dynamic route params
- Return `NextResponse.json()` instead of `res.json()`

### 5. **Frontend API Client Updated** (`lib/api.ts`)
Changed from external API calls to **relative paths**:
- ❌ `${API_URL}/api/products` 
- ✅ `/api/products`

No CORS needed - all API routes are part of the Next.js app.

### 6. **Types** (`lib/types/`)
- `lib/types/index.ts` - Re-exports types from `lib/types.ts`
- All types remain unchanged and fully typed

## Environment Variables Required

Create a `.env.local` file in your project root:

```env
# Database Configuration
DATABASE_URL=postgresql://user:password@host:port/database

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# Public Environment Variables (accessible in browser)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Important**: 
- Variables without `NEXT_PUBLIC_` are server-side only
- Never expose `STRIPE_SECRET_KEY` to the browser
- Update `NEXT_PUBLIC_BASE_URL` for production

## Architecture Highlights

✅ **Clean Separation of Concerns**:
- `app/api/**` - HTTP layer only (request/response handling)
- `lib/services/**` - Business logic (reusable, testable)
- `lib/config/**` - Configuration (database, Stripe)
- `lib/types/**` - TypeScript types

✅ **Framework-Agnostic Services**:
- Services don't know about Next.js or Express
- Can be reused in other contexts (CLI tools, serverless functions)
- Easy to test in isolation

✅ **Type Safety**:
- Full TypeScript coverage
- Proper request/response types
- No `any` types

## Running the Application

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create `.env.local` with the required variables above

3. **Run database migration** (if needed):
   ```bash
   npx tsx lib/scripts/migration.ts
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Visit the application**:
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api/products

## API Endpoints

All endpoints follow the same response format:

```typescript
{
  "success": boolean,
  "data"?: T,
  "message"?: string,
  "error"?: string
}
```

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[slug]` - Get product by slug

### Checkout
- `POST /api/checkout/create-session` - Create Stripe checkout session
- `POST /api/checkout/verify` - Verify payment

### Orders
- `POST /api/orders` - Create order (after payment)
- `GET /api/orders/[id]` - Get order by ID

## What Was Removed

- ❌ Express dependencies (express, express routers)
- ❌ Express middleware
- ❌ `dotenv` (Next.js handles env vars)
- ❌ CORS configuration (not needed in Next.js)
- ❌ Separate backend server
- ❌ Old Express route file: `app/api/checkout/route.ts` (replaced with subdirectories)

## Testing the Migration

1. **Test product fetching**:
   ```bash
   curl http://localhost:3000/api/products
   ```

2. **Test checkout flow**:
   - Add items to cart on frontend
   - Click checkout
   - Complete Stripe payment
   - Verify order creation

3. **Check database**:
   ```sql
   SELECT * FROM products;
   SELECT * FROM orders;
   SELECT * FROM order_items;
   ```

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` in `.env.local`
- Check database is running
- Verify SSL settings for hosted databases

### Stripe Issues
- Verify `STRIPE_SECRET_KEY` in `.env.local`
- Check Stripe API version compatibility
- Ensure Stripe is in test mode during development

### TypeScript Errors
- Run `npm run build` to check for type errors
- Ensure all dependencies are installed

## Next Steps

1. ✅ Migration complete - no Express dependencies
2. 🔄 Test all API endpoints thoroughly
3. 🔄 Update production environment variables
4. 🔄 Deploy to your hosting platform (Vercel recommended)
5. 🔄 Monitor logs for any runtime issues

## Notes

- All route handlers run in the Next.js serverless environment
- Long-running tasks (background jobs) should use external queues or services
- Database connections are automatically managed by the connection pool
- Stripe webhooks would need a separate `/api/webhooks/stripe` route if needed

---

**Migration completed successfully! 🎉**

All Express code has been removed and replaced with Next.js Route Handlers while maintaining clean architecture and separation of concerns.

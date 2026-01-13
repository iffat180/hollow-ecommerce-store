# Quick Start Guide

## 🚀 Getting Started (3 Steps)

### 1. Environment Variables
Create `.env.local` in your project root:

```env
DATABASE_URL=postgresql://user:password@host:port/database
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. Database Setup
Run the migration to create tables:

```bash
npx tsx lib/scripts/migration.ts
```

### 3. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 📁 Project Structure

```
/app/api/                    # ✅ Next.js Route Handlers (HTTP layer)
  /products/route.ts         # GET all products
  /products/[slug]/route.ts  # GET product by slug
  /checkout/
    /create-session/route.ts # POST create Stripe session
    /verify/route.ts         # POST verify payment
  /orders/route.ts           # POST create order
  /orders/[id]/route.ts      # GET order by ID

/lib/                        # ✅ Business Logic (Framework-agnostic)
  /config/                   # Configuration
    database.ts              # PostgreSQL connection
    stripe.ts                # Stripe initialization
  /services/                 # Business logic
    products.service.ts      # Product operations
    checkout.service.ts      # Checkout operations
    orders.service.ts        # Order operations
  /scripts/                  # Utilities
    migration.ts             # Database migration
  /types/                    # TypeScript types
    types.ts                 # All type definitions
```

## 🔧 API Endpoints

All endpoints return:
```typescript
{
  success: boolean,
  data?: T,
  error?: string
}
```

### Products
- **GET** `/api/products` - List all products
- **GET** `/api/products/[slug]` - Get product by slug

### Checkout
- **POST** `/api/checkout/create-session` - Create Stripe session
  ```json
  {
    "items": [{ "name": "Product", "price": 10, "quantity": 1, ... }],
    "customerEmail": "user@example.com",
    "customerName": "John Doe"
  }
  ```
- **POST** `/api/checkout/verify` - Verify payment
  ```json
  { "sessionId": "cs_test_..." }
  ```

### Orders
- **POST** `/api/orders` - Create order after payment
  ```json
  { "sessionId": "cs_test_..." }
  ```
- **GET** `/api/orders/[id]` - Get order with items

## 📝 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Build
npm run build            # Build for production
npm start                # Start production server

# Database
npx tsx lib/scripts/migration.ts  # Run migrations

# Testing
curl http://localhost:3000/api/products  # Test API
```

## 🔍 Troubleshooting

| Issue | Solution |
|-------|----------|
| Database connection error | Check `DATABASE_URL` in `.env.local` |
| Stripe error | Verify `STRIPE_SECRET_KEY` is set |
| TypeScript errors | Run `npm run build` to see details |
| 404 on API routes | Ensure dev server is running |

## 📚 Learn More

- See `MIGRATION_GUIDE.md` for detailed migration notes
- Check `lib/types/types.ts` for all TypeScript interfaces
- Review route handlers in `app/api/` for HTTP examples

---

**Ready to go! 🎉** All Express code removed, pure Next.js Route Handlers in place.

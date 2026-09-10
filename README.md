# Hollow

Full-stack e-commerce store — product catalog, cart, Stripe Checkout, and
webhook-driven order recording — built as a single Next.js (App Router) app.

## Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript (strict) |
| API | Next.js Route Handlers (`app/api/**/route.ts`) |
| Database | PostgreSQL via `pg`, hosted on Neon (pooled `-pooler` endpoint) |
| Payments | Stripe Checkout (hosted) + Stripe webhooks |
| Styling | Tailwind CSS v4 |
| Hosting | Vercel |

## Architecture

```
Browser
  │  page (React Server/Client Components)
  │  lib/api.ts  ── fetch('/api/...') ──┐   (same origin, no CORS)
  ▼                                     ▼
app/api/**/route.ts   ── calls ──►  lib/services/*.service.ts  ──►  Postgres / Stripe
  ▲
Stripe servers ── POST /api/webhooks/stripe (signed)
```

- **Route handlers** are thin: parse the request, call a service, shape the response.
- **Services** (`lib/services/`) hold the logic and own all DB / Stripe access.
- **Config** (`lib/config/`) creates one shared `pg` pool and one Stripe client.
- `middleware.ts` applies a CORS allowlist to `/api/*` for non-browser / cross-origin callers.

## Order flow

1. `POST /api/checkout/create-session` — prices, names and images are read from
   the DB (never trusted from the cart), a Stripe Checkout session is created,
   its URL is returned.
2. Customer pays on Stripe's hosted page, is redirected to `/success`.
3. Two things create/confirm the order, both idempotent:
   - the browser calls `POST /api/orders` (fast path, so the page can show an order number)
   - Stripe calls `POST /api/webhooks/stripe` (authoritative — fires even if the browser never returns)
4. `persistOrderFromSession` reconciles the local order against Stripe: creates
   it if missing, syncs `payment_status` if it drifted, all inside a transaction.

### Idempotency

- **Event level:** `processed_stripe_events` table — Stripe re-deliveries are skipped; a failed handler releases the claim so retries still run.
- **Session level:** `orders.stripe_session_id` is `UNIQUE`; inserts use `ON CONFLICT DO NOTHING`, so concurrent callers can't create duplicates.

## Database schema

- `products` — catalog
- `orders` — one row per paid Stripe session (`stripe_session_id` UNIQUE)
- `order_items` — line items; `order_id → orders(id) ON DELETE CASCADE`, `product_id → products(id)`
- `processed_stripe_events` — webhook dedupe

## Setup

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run db:migrate             # create tables + indexes
npm run dev                    # http://localhost:3000
```

### Environment variables

See `.env.example`. Summary:

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (use a pooled endpoint) |
| `STRIPE_SECRET_KEY` | Stripe server key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe browser key |
| `STRIPE_WEBHOOK_SECRET` | signing secret for `/api/webhooks/stripe` |
| `NEXT_PUBLIC_BASE_URL` | absolute site URL (Stripe redirects) |
| `CORS_ALLOWED_ORIGINS` | comma-separated origins allowed to call `/api/*` cross-origin |

### Testing Stripe webhooks locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the printed whsec_... into .env.local as STRIPE_WEBHOOK_SECRET
```

Then complete a test checkout with card `4242 4242 4242 4242`.

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/products` | list products |
| GET | `/api/products/[slug]` | one product |
| POST | `/api/checkout/create-session` | start Stripe Checkout |
| POST | `/api/checkout/verify` | check a session's payment status |
| POST | `/api/orders` | create/confirm the order for a paid session |
| GET | `/api/orders/[sessionId]` | fetch an order by its Stripe session id |
| POST | `/api/webhooks/stripe` | Stripe event receiver |

## Known limitations / next steps

- No user accounts; order access is by unguessable session id rather than auth.
- `product_id` on `order_items` is matched by product name; a stable Stripe
  price/product id mapping would be more robust.
- `products.stock` is stored but not yet enforced at checkout.
- No automated tests yet.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | dev server |
| `npm run build` / `npm start` | production build / serve |
| `npm run lint` | ESLint |
| `npm run db:migrate` | create/patch database tables |

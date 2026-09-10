import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS allowlisting for the /api/* routes.
 *
 * The web frontend calls the API same-origin, so it never triggers CORS. This
 * middleware exists so the API can also be consumed cross-origin (a separate
 * admin panel, a mobile client, local tools) without opening it to every site:
 * only origins on the allowlist get CORS headers, and cross-origin preflight
 * from anywhere else is rejected.
 *
 * Allowlist is configured via CORS_ALLOWED_ORIGINS (comma-separated). Vercel
 * preview deployments (*.vercel.app) are allowed automatically.
 */

const ALLOWED_ORIGINS = (process.env.CORS_ALLOWED_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string | null): origin is string {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol === 'https:' && hostname.endsWith('.vercel.app')) return true;
  } catch {
    /* malformed Origin header */
  }
  return false;
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');

  // Preflight
  if (request.method === 'OPTIONS') {
    if (isAllowedOrigin(origin)) {
      return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
    }
    // Same-origin requests don't send a preflight; a rejected one is cross-origin.
    return new NextResponse(null, { status: 403 });
  }

  const response = NextResponse.next();

  // Actual request: attach CORS headers only for allowlisted cross-origin callers.
  // Same-origin (no Origin header) and Stripe's server-to-server webhook calls
  // pass through untouched.
  if (isAllowedOrigin(origin)) {
    for (const [key, value] of Object.entries(corsHeaders(origin))) {
      response.headers.set(key, value);
    }
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};

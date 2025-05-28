import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Create a new response
  const response = NextResponse.next();
  
  // Set comprehensive CSP header with all necessary permissions
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes' 'wasm-unsafe-eval' 'inline-speculation-rules'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://*; frame-src 'self' chrome-extension:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self' chrome-extension:; block-all-mixed-content; upgrade-insecure-requests;"
  );
  
  return response;
}

// Configure middleware to run on all routes
export const config = {
  matcher: '/:path*',
};


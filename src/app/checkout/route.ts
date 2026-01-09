/**
 * Creem.io Checkout Route
 * 
 * Handles checkout session creation for subscription plans.
 * Uses @creem_io/nextjs adapter for seamless integration.
 */

import { Checkout } from '@creem_io/nextjs';

export const GET = Checkout({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: process.env.NODE_ENV !== 'production',
  defaultSuccessUrl: '/profile?tab=billing&success=true',
});


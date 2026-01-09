/**
 * Creem.io Customer Portal Route
 * 
 * Generates a customer portal link for managing subscriptions.
 * Users can update payment methods, cancel, or change plans.
 */

import { Portal } from '@creem_io/nextjs';

export const GET = Portal({
  apiKey: process.env.CREEM_API_KEY!,
  testMode: true, // Using test API key (creem_test_*)
});


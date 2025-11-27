/**
 * Supabase Service Client
 * 
 * For use in workers/background processes (no cookies/request context)
 * Uses service role key with full database access
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables for service client');
}

/**
 * Create a Supabase client with service role privileges
 * WARNING: Use only in server-side/worker contexts, never expose to client
 */
export function createServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}


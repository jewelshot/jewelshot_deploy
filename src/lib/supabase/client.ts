import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

/**
 * Supabase Browser Client
 * For client-side operations (auth, queries)
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}







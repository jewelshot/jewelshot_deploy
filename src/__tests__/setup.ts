/**
 * Test Setup
 * 
 * Global test configuration and mocks
 */

import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key';
process.env.REDIS_URL = 'redis://localhost:6379';
process.env.FAL_AI_KEY_1 = 'test-fal-key-1';
process.env.ADMIN_DASHBOARD_KEY = 'test-admin-key';
process.env.RESEND_API_KEY = 'test-resend-key';
process.env.INTERNAL_API_SECRET = 'test-internal-secret';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/test',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    rpc: vi.fn(),
  })),
}));

// Mock fetch globally
global.fetch = vi.fn();

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks();
});


/**
 * Credits API Route Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => Promise.resolve({
        data: { user: { id: 'test-user-id' } },
        error: null,
      })),
    },
  })),
}));

// Mock Credit Manager
vi.mock('@/lib/credit-manager', () => ({
  getCreditManager: vi.fn(() => ({
    getCredits: vi.fn(() => Promise.resolve({
      total: 100,
      ai: 10,
      available: 90,
    })),
    deductCredits: vi.fn(() => Promise.resolve({ success: true })),
    addCredits: vi.fn(() => Promise.resolve({ success: true })),
  })),
}));

describe('/api/credits', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/credits', () => {
    it('returns user credits', async () => {
      const { GET } = await import('@/app/api/credits/route');
      const request = new Request('http://localhost:3000/api/credits');
      
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('total');
      expect(data).toHaveProperty('ai');
      expect(data).toHaveProperty('available');
    });

    it('returns 401 when user is not authenticated', async () => {
      // Mock unauthenticated user
      const { createClient } = await import('@/lib/supabase/client');
      vi.mocked(createClient).mockReturnValueOnce({
        auth: {
          getUser: vi.fn(() => Promise.resolve({
            data: { user: null },
            error: { message: 'Unauthorized' },
          })),
        },
      } as any);

      const { GET } = await import('@/app/api/credits/route');
      const request = new Request('http://localhost:3000/api/credits');
      
      const response = await GET(request);
      
      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/credits/deduct', () => {
    it('deducts credits successfully', async () => {
      const { POST } = await import('@/app/api/credits/deduct/route');
      const request = new Request('http://localhost:3000/api/credits/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 10, type: 'ai' }),
      });
      
      const response = await POST(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data).toHaveProperty('success', true);
    });

    it('validates request body', async () => {
      const { POST } = await import('@/app/api/credits/deduct/route');
      const request = new Request('http://localhost:3000/api/credits/deduct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}), // Missing required fields
      });
      
      const response = await POST(request);
      
      expect(response.status).toBe(400);
    });
  });
});



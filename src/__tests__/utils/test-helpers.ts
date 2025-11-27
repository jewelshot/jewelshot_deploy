/**
 * Test Helpers
 * 
 * Utility functions for testing
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

// Custom render with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: RenderOptions
) {
  return render(ui, { ...options });
}

// Mock user data
export const mockUser = {
  id: 'test-user-id-123',
  email: 'test@example.com',
  user_metadata: {
    name: 'Test User',
  },
  created_at: '2025-01-01T00:00:00Z',
};

// Mock credit data
export const mockCredits = {
  balance: 100,
  reserved: 10,
  available: 90,
  totalEarned: 500,
  totalSpent: 400,
};

// Mock batch project
export const mockBatchProject = {
  id: 'batch-123',
  user_id: 'test-user-id-123',
  name: 'Test Batch',
  prompt: 'luxury jewelry on marble',
  aspect_ratio: '1:1',
  total_images: 5,
  completed_count: 3,
  failed_count: 1,
  status: 'processing',
  created_at: '2025-01-28T00:00:00Z',
};

// Mock AI job
export const mockAIJob = {
  id: 'job-123',
  userId: 'test-user-id-123',
  operationType: 'generate',
  data: {
    prompt: 'test prompt',
    image_url: 'https://example.com/test.jpg',
  },
  transactionId: 'tx-123',
  priority: 1,
};

// Mock API response
export function mockApiResponse(data: any, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
    headers: new Headers(),
  } as Response;
}

// Wait for async operations
export const waitFor = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock fetch response
export function mockFetch(response: any, status = 200) {
  global.fetch = vi.fn().mockResolvedValue(mockApiResponse(response, status));
}

// Mock fetch error
export function mockFetchError(error: string) {
  global.fetch = vi.fn().mockRejectedValue(new Error(error));
}


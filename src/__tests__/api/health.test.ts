/**
 * Health API Route Tests
 */

import { describe, it, expect, vi } from 'vitest';

// Mock queue
vi.mock('@/lib/queue', () => ({
  createQueue: vi.fn(() => ({
    getJobCounts: vi.fn(() => Promise.resolve({
      waiting: 0,
      active: 0,
      completed: 10,
      failed: 0,
    })),
  })),
}));

describe('/api/health', () => {
  it('returns healthy status', async () => {
    const { GET } = await import('@/app/api/health/route');
    const request = new Request('http://localhost:3000/api/health');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toHaveProperty('status', 'healthy');
    expect(data).toHaveProperty('timestamp');
  });

  it('includes queue stats', async () => {
    const { GET } = await import('@/app/api/health/route');
    const request = new Request('http://localhost:3000/api/health');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(data).toHaveProperty('queue');
    expect(data.queue).toHaveProperty('waiting');
    expect(data.queue).toHaveProperty('active');
    expect(data.queue).toHaveProperty('completed');
    expect(data.queue).toHaveProperty('failed');
  });

  it('returns degraded status when queue has failures', async () => {
    // Mock queue with failures
    const { createQueue } = await import('@/lib/queue');
    vi.mocked(createQueue).mockReturnValueOnce({
      getJobCounts: vi.fn(() => Promise.resolve({
        waiting: 0,
        active: 0,
        completed: 10,
        failed: 5, // Some failures
      })),
    } as any);

    const { GET } = await import('@/app/api/health/route');
    const request = new Request('http://localhost:3000/api/health');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(data.status).toBe('degraded');
  });

  it('includes uptime information', async () => {
    const { GET } = await import('@/app/api/health/route');
    const request = new Request('http://localhost:3000/api/health');
    
    const response = await GET(request);
    const data = await response.json();
    
    expect(data).toHaveProperty('uptime');
    expect(typeof data.uptime).toBe('number');
  });

  it('returns valid JSON', async () => {
    const { GET } = await import('@/app/api/health/route');
    const request = new Request('http://localhost:3000/api/health');
    
    const response = await GET(request);
    const contentType = response.headers.get('content-type');
    
    expect(contentType).toContain('application/json');
    
    // Should not throw
    await expect(response.json()).resolves.toBeDefined();
  });
});


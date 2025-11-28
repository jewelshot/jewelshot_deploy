/**
 * useAIQueue Hook Tests
 * 
 * Tests for the AI queue hook (critical for all AI operations)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAIQueue } from '@/hooks/useAIQueue';

// Mock fetch
global.fetch = vi.fn();

// TODO: Fix fetch mock issues (global fetch not being picked up correctly)
describe.skip('useAIQueue Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  describe('submit', () => {
    it('should submit job successfully', async () => {
      // Mock successful submit response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          jobId: 'job-123',
          transactionId: 'tx-123',
          status: 'queued',
        }),
      });

      const { result } = renderHook(() => useAIQueue());

      const jobId = await result.current.submit('generate', {
        prompt: 'test prompt',
      });

      expect(jobId).toBe('job-123');
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/ai/submit',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.any(String),
        })
      );
    });

    it('should handle submission errors', async () => {
      // Mock error response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: async () => ({
          error: 'Insufficient credits',
        }),
      });

      const { result } = renderHook(() => useAIQueue());

      await expect(
        result.current.submit('generate', { prompt: 'test' })
      ).rejects.toThrow();
    });
  });

  describe('submitAndWait', () => {
    it('should submit job and wait for completion', async () => {
      // Mock submit response
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jobId: 'job-123',
            transactionId: 'tx-123',
            status: 'queued',
          }),
        })
        // Mock status check (processing)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            status: 'processing',
            progress: 50,
          }),
        })
        // Mock status check (completed)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            status: 'completed',
            result: {
              imageUrl: 'https://example.com/result.jpg',
            },
          }),
        });

      const { result } = renderHook(() => useAIQueue());

      const jobResult = await result.current.submitAndWait(
        'generate',
        { prompt: 'test' },
        { pollInterval: 100 }
      );

      expect(jobResult).toEqual({
        imageUrl: 'https://example.com/result.jpg',
      });
    });

    it('should handle job failure', async () => {
      // Mock submit response
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jobId: 'job-123',
            transactionId: 'tx-123',
            status: 'queued',
          }),
        })
        // Mock status check (failed)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            status: 'failed',
            error: 'AI processing failed',
          }),
        });

      const { result } = renderHook(() => useAIQueue());

      await expect(
        result.current.submitAndWait('generate', { prompt: 'test' }, { pollInterval: 100 })
      ).rejects.toThrow('AI processing failed');
    });

    it('should timeout after max retries', async () => {
      // Mock submit response
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            jobId: 'job-123',
            transactionId: 'tx-123',
            status: 'queued',
          }),
        })
        // Mock status checks (always processing)
        .mockResolvedValue({
          ok: true,
          json: async () => ({
            status: 'processing',
            progress: 10,
          }),
        });

      const { result } = renderHook(() => useAIQueue());

      await expect(
        result.current.submitAndWait(
          'generate',
          { prompt: 'test' },
          { pollInterval: 10, maxRetries: 3 }
        )
      ).rejects.toThrow();
    }, 10000);
  });

  describe('cancel', () => {
    it('should cancel job successfully', async () => {
      // Mock cancel response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          message: 'Job cancelled',
        }),
      });

      const { result } = renderHook(() => useAIQueue());

      await result.current.cancel('job-123');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/ai/cancel/job-123',
        expect.objectContaining({
          method: 'POST',
        })
      );
    });
  });
});


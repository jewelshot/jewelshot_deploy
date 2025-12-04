/**
 * AI Queue Hook - SYNCHRONOUS VERSION
 * 
 * React hook for submitting jobs to the AI API
 * Now uses synchronous processing - no queue polling needed
 * 
 * Jobs complete immediately in /api/ai/submit response
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { AIOperation, JobPriority } from '@/lib/queue/types';
import { useApiError } from './useApiError';

// ============================================
// TYPES
// ============================================

interface SubmitJobParams {
  operation: AIOperation;
  params: Record<string, any>;
  priority?: JobPriority;
  metadata?: any;
}

interface JobStatus {
  jobId: string;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  progress?: number | object;
  result?: any;
  error?: {
    message: string;
    attempts?: number;
  };
}

// Timeout for synchronous requests (2 minutes)
const REQUEST_TIMEOUT = 120000;

// ============================================
// HOOK
// ============================================

export function useAIQueue() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { handleError } = useApiError();

  // ============================================
  // SUBMIT JOB (SYNCHRONOUS)
  // ============================================

  const submitJob = useCallback(async (params: SubmitJobParams) => {
    try {
      // Create abort controller for timeout
      abortControllerRef.current = new AbortController();
      const timeoutId = setTimeout(() => {
        abortControllerRef.current?.abort();
      }, REQUEST_TIMEOUT);

      const response = await fetch('/api/ai/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: abortControllerRef.current.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();

      if (!response.ok) {
        // Use standardized error from API
        throw new Error(data.message || data.error || 'AI processing failed');
      }

      // Synchronous response - result is directly in data
      return {
        jobId: data.jobId || `sync-${Date.now()}`,
        status: data.status || 'completed',
        result: data.result,
        operation: data.operation,
        metadata: data.metadata,
      };
    } catch (error: any) {
      console.error('[useAIQueue] Submit error:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. AI processing is taking longer than expected. Please try again.');
      }
      
      throw error;
    }
  }, []);

  // ============================================
  // GET STATUS (DEPRECATED - synchronous mode)
  // ============================================

  const getStatus = useCallback(async (jobId: string): Promise<JobStatus> => {
    // In synchronous mode, status is not needed
    // Jobs complete immediately in submit response
    console.warn('[useAIQueue] getStatus called but synchronous mode is active');
    
    return {
      jobId,
      state: 'completed',
      progress: 100,
      result: null,
      error: undefined,
    };
  }, []);

  // ============================================
  // POLL FOR RESULT (DEPRECATED - synchronous mode)
  // ============================================

  const pollForResult = useCallback(
    async (
      jobId: string,
      options?: {
        interval?: number;
        maxAttempts?: number;
        onProgress?: (status: JobStatus) => void;
      }
    ): Promise<any> => {
      // In synchronous mode, polling is not needed
      // Return immediately as jobs complete in submit response
      console.warn('[useAIQueue] pollForResult called but synchronous mode is active');
      
      if (options?.onProgress) {
        options.onProgress({
          jobId,
          state: 'completed',
          progress: 100,
        });
      }
      
      return null;
    },
    []
  );

  // ============================================
  // SUBMIT AND WAIT (SYNCHRONOUS)
  // ============================================

  /**
   * Submit job and wait for result
   * In synchronous mode, this completes immediately
   */
  const submitAndWait = useCallback(
    async (
      params: SubmitJobParams,
      options?: {
        interval?: number;
        maxAttempts?: number;
        onProgress?: (status: JobStatus) => void;
      }
    ): Promise<any> => {
      try {
        setIsProcessing(true);
        setProgress(10);

        // Call progress callback with "processing" status
        if (options?.onProgress) {
          options.onProgress({
            jobId: 'pending',
            state: 'active',
            progress: 10,
          });
        }

        // Submit job - synchronous, result comes back directly
        setProgress(30);
        const response = await submitJob(params);
        setProgress(90);

        // Call progress callback with "completed" status
        if (options?.onProgress) {
          options.onProgress({
            jobId: response.jobId,
            state: 'completed',
            progress: 100,
            result: response.result,
          });
        }

        setProgress(100);
        setIsProcessing(false);

        // Return the result directly
        return response.result;
      } catch (error: any) {
        setIsProcessing(false);
        setProgress(0);
        
        // Use standardized error handler
        handleError(error);
        throw error;
      }
    },
    [submitJob, handleError]
  );

  // ============================================
  // CANCEL JOB (LIMITED IN SYNCHRONOUS MODE)
  // ============================================

  const cancelJob = useCallback(async (jobId: string) => {
    try {
      // Abort current request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsProcessing(false);
      setProgress(0);

      // In synchronous mode, jobs can't be cancelled after submission
      // But we can abort the current request
      return { cancelled: true, message: 'Request aborted' };
    } catch (error: any) {
      console.error('[useAIQueue] Cancel error:', error);
      throw error;
    }
  }, []);

  // ============================================
  // CLEANUP
  // ============================================

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsProcessing(false);
    setProgress(0);
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    isProcessing,
    progress,

    // Methods
    submitJob,
    getStatus,
    pollForResult,
    submitAndWait,
    cancelJob,
    cleanup,
  };
}


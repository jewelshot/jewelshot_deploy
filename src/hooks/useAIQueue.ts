/**
 * AI Queue Hook
 * 
 * React hook for submitting jobs to the queue and polling for results
 * Replaces direct API calls to individual endpoints
 */

'use client';

import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { AIOperation, JobPriority } from '@/lib/queue/types';

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

// ============================================
// HOOK
// ============================================

export function useAIQueue() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // SUBMIT JOB
  // ============================================

  const submitJob = useCallback(async (params: SubmitJobParams) => {
    try {
      const response = await fetch('/api/ai/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit job');
      }

      return {
        jobId: data.jobId,
        status: data.status,
        priority: data.priority,
        queuePosition: data.queuePosition,
        creditReservation: data.creditReservation,
      };
    } catch (error: any) {
      console.error('[useAIQueue] Submit error:', error);
      throw error;
    }
  }, []);

  // ============================================
  // GET STATUS
  // ============================================

  const getStatus = useCallback(async (jobId: string): Promise<JobStatus> => {
    try {
      const response = await fetch(`/api/ai/status/${jobId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get job status');
      }

      return {
        jobId: data.jobId,
        state: data.state,
        progress: data.progress,
        result: data.result,
        error: data.error,
      };
    } catch (error: any) {
      console.error('[useAIQueue] Status error:', error);
      throw error;
    }
  }, []);

  // ============================================
  // POLL FOR RESULT
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
      const interval = options?.interval || 2000; // 2 seconds
      const maxAttempts = options?.maxAttempts || 150; // 5 minutes max
      let attempts = 0;

      return new Promise((resolve, reject) => {
        const poll = async () => {
          try {
            attempts++;

            if (attempts > maxAttempts) {
              clearInterval(pollingIntervalRef.current!);
              reject(new Error('Polling timeout'));
              return;
            }

            const status = await getStatus(jobId);

            // Call progress callback
            if (options?.onProgress) {
              options.onProgress(status);
            }

            // Update progress
            if (typeof status.progress === 'number') {
              setProgress(status.progress);
            }

            // Check if completed
            if (status.state === 'completed') {
              clearInterval(pollingIntervalRef.current!);
              setIsProcessing(false);
              setProgress(100);
              resolve(status.result);
              return;
            }

            // Check if failed
            if (status.state === 'failed') {
              clearInterval(pollingIntervalRef.current!);
              setIsProcessing(false);
              reject(new Error(status.error?.message || 'Job failed'));
              return;
            }

            // Continue polling if waiting or active
          } catch (error) {
            console.error('[useAIQueue] Polling error:', error);
            clearInterval(pollingIntervalRef.current!);
            setIsProcessing(false);
            reject(error);
          }
        };

        // Start polling
        setIsProcessing(true);
        setProgress(0);
        poll(); // First poll immediately
        pollingIntervalRef.current = setInterval(poll, interval);
      });
    },
    [getStatus]
  );

  // ============================================
  // SUBMIT AND WAIT
  // ============================================

  /**
   * Submit job and wait for result (combines submit + poll)
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
        // Submit job
        const { jobId } = await submitJob(params);

        // Poll for result
        const result = await pollForResult(jobId, options);

        return result;
      } catch (error: any) {
        // Show error toast
        if (error.message?.includes('Insufficient credits')) {
          toast.error('Insufficient credits', {
            description: 'Please purchase more credits to continue.',
          });
        } else {
          toast.error('Operation failed', {
            description: error.message || 'An error occurred during processing.',
          });
        }
        throw error;
      }
    },
    [submitJob, pollForResult]
  );

  // ============================================
  // CANCEL JOB
  // ============================================

  const cancelJob = useCallback(async (jobId: string) => {
    try {
      // Clear polling interval
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      // Call cancel endpoint
      const response = await fetch(`/api/ai/cancel/${jobId}`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel job');
      }

      setIsProcessing(false);
      setProgress(0);

      return data;
    } catch (error: any) {
      console.error('[useAIQueue] Cancel error:', error);
      throw error;
    }
  }, []);

  // ============================================
  // CLEANUP
  // ============================================

  const cleanup = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
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


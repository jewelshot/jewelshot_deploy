/**
 * AI Queue Hook - HYBRID MODE (Sync + Queue)
 * 
 * React hook for submitting jobs to the AI API
 * Supports both synchronous processing and Redis queue with polling
 * 
 * - If queue is available: Jobs are queued and polled for completion
 * - If queue is unavailable: Jobs complete immediately in /api/ai/submit response
 * - Automatically shows global loading modal during operations
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { AIOperation, JobPriority } from '@/lib/queue/types';
import { useApiError } from './useApiError';
import { useAILoadingStore } from '@/store/aiLoadingStore';

// ============================================
// TYPES
// ============================================

interface SubmitJobParams {
  operation: AIOperation;
  params: Record<string, any>;
  priority?: JobPriority;
  metadata?: any;
  sync?: boolean; // Force synchronous processing
}

interface JobStatus {
  jobId: string;
  state: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed' | 'queued';
  progress?: number | object;
  result?: any;
  error?: {
    message: string;
    attempts?: number;
  };
}

// Timeout for synchronous requests (2 minutes)
const REQUEST_TIMEOUT = 120000;
// Polling interval for queued jobs
const POLL_INTERVAL = 2000;
// Max polling time (5 minutes)
const MAX_POLL_TIME = 300000;

/**
 * Safely extract error message from various error formats
 * Handles: string, { message: string }, { error: string }, nested objects
 */
function extractErrorMessage(error: any, fallback: string = 'Unknown error'): string {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (typeof error === 'object') {
    // Try common error message properties
    if (typeof error.message === 'string') return error.message;
    if (typeof error.error === 'string') return error.error;
    if (error.error && typeof error.error.message === 'string') return error.error.message;
    // Last resort: try to stringify but avoid [object Object]
    try {
      const str = JSON.stringify(error);
      if (str && str !== '{}') return str;
    } catch {
      // Ignore stringify errors
    }
  }
  return fallback;
}

// ============================================
// HOOK
// ============================================

export function useAIQueue() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStatus, setCurrentStatus] = useState<JobStatus | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollStartTimeRef = useRef<number>(0);
  const { handleError } = useApiError();
  
  // Global loading modal
  const loadingStore = useAILoadingStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // ============================================
  // GET JOB STATUS
  // ============================================

  const getStatus = useCallback(async (jobId: string): Promise<JobStatus> => {
    try {
      const response = await fetch(`/api/ai/status/${jobId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(extractErrorMessage(data, 'Failed to get job status'));
      }

      return {
        jobId: data.jobId,
        state: data.state || data.status,
        progress: data.progress,
        result: data.result,
        error: data.error ? { message: extractErrorMessage(data.error) } : undefined,
      };
    } catch (error: any) {
      console.error('[useAIQueue] getStatus error:', error);
      throw error;
    }
  }, []);

  // ============================================
  // SUBMIT JOB
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
        throw new Error(extractErrorMessage(data, 'AI processing failed'));
      }

      return {
        jobId: data.jobId || `sync-${Date.now()}`,
        status: data.status || 'completed',
        state: data.state || data.status,
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
      const interval = options?.interval || POLL_INTERVAL;
      pollStartTimeRef.current = Date.now();

      return new Promise((resolve, reject) => {
        const poll = async () => {
          try {
            // Check timeout
            if (Date.now() - pollStartTimeRef.current > MAX_POLL_TIME) {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              reject(new Error('Job timed out waiting for result'));
              return;
            }

            const status = await getStatus(jobId);
            setCurrentStatus(status);

            if (options?.onProgress) {
              options.onProgress(status);
            }

            // Update progress based on state
            if (status.state === 'waiting' || status.state === 'queued') {
              setProgress(20);
            } else if (status.state === 'active') {
              setProgress(typeof status.progress === 'number' ? status.progress : 50);
            }

            if (status.state === 'completed') {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              setProgress(100);
              resolve(status.result);
              return;
            }

            if (status.state === 'failed') {
              if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
              }
              reject(new Error(status.error?.message || 'Job failed'));
              return;
            }
          } catch (error: any) {
            // Don't stop polling on network errors, just log
            console.error('[useAIQueue] Poll error:', error);
          }
        };

        // Start polling
        poll(); // Initial poll
        pollIntervalRef.current = setInterval(poll, interval);
      });
    },
    [getStatus]
  );

  // ============================================
  // SUBMIT AND WAIT (HYBRID MODE)
  // ============================================

  /**
   * Submit job and wait for result
   * Handles both sync and async (queue) responses
   * Automatically shows global loading modal
   */
  const submitAndWait = useCallback(
    async (
      params: SubmitJobParams,
      options?: {
        interval?: number;
        maxAttempts?: number;
        onProgress?: (status: JobStatus) => void;
        showModal?: boolean; // Default: true
      }
    ): Promise<any> => {
      const showModal = options?.showModal !== false;
      
      try {
        setIsProcessing(true);
        setProgress(10);
        setCurrentStatus(null);

        // Show global loading modal
        if (showModal) {
          loadingStore.show(params.operation);
        }

        // Call progress callback with "processing" status
        if (options?.onProgress) {
          options.onProgress({
            jobId: 'pending',
            state: 'active',
            progress: 10,
          });
        }

        // Submit job
        setProgress(20);
        if (showModal) {
          loadingStore.updateProgress(20);
        }
        
        const response = await submitJob(params);

        // Check if job completed synchronously
        if (response.status === 'completed' || response.state === 'completed') {
          setProgress(100);
          
          if (options?.onProgress) {
            options.onProgress({
              jobId: response.jobId,
              state: 'completed',
              progress: 100,
              result: response.result,
            });
          }

          setIsProcessing(false);
          
          // Show success in modal
          if (showModal) {
            loadingStore.success();
          }
          
          return response.result;
        }

        // Check if job failed
        if (response.status === 'failed' || response.state === 'failed') {
          throw new Error(extractErrorMessage(response.result?.error, 'Job failed'));
        }

        // Job is queued - start polling
        if (showModal) {
          loadingStore.updateStatus('queued');
          loadingStore.setJobId(response.jobId);
        }
        
        if (options?.onProgress) {
          options.onProgress({
            jobId: response.jobId,
            state: 'queued',
            progress: 25,
          });
        }

        setProgress(30);
        
        // Custom progress callback that also updates modal
        const wrappedOnProgress = (status: JobStatus) => {
          if (showModal) {
            loadingStore.updateStatus(status.state as any);
            if (typeof status.progress === 'number') {
              loadingStore.updateProgress(status.progress);
            }
          }
          options?.onProgress?.(status);
        };
        
        const result = await pollForResult(response.jobId, {
          ...options,
          onProgress: wrappedOnProgress,
        });

        if (options?.onProgress) {
          options.onProgress({
            jobId: response.jobId,
            state: 'completed',
            progress: 100,
            result,
          });
        }

        setProgress(100);
        setIsProcessing(false);
        
        // Show success in modal
        if (showModal) {
          loadingStore.success();
        }
        
        return result;

      } catch (error: any) {
        setIsProcessing(false);
        setProgress(0);
        setCurrentStatus(null);
        
        // Clear polling if running
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
        
        // Show error in modal
        if (showModal) {
          loadingStore.error(extractErrorMessage(error, 'Operation failed'));
        }
        
        handleError(error);
        throw error;
      }
    },
    [submitJob, pollForResult, handleError, loadingStore]
  );

  // ============================================
  // CANCEL JOB
  // ============================================

  const cancelJob = useCallback(async (jobId: string) => {
    try {
      // Abort current request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Stop polling
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }

      setIsProcessing(false);
      setProgress(0);
      setCurrentStatus(null);

      // TODO: Send cancel request to API if job is cancellable
      return { cancelled: true, message: 'Job cancelled' };
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
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    setIsProcessing(false);
    setProgress(0);
    setCurrentStatus(null);
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    isProcessing,
    progress,
    currentStatus,

    // Methods
    submitJob,
    getStatus,
    pollForResult,
    submitAndWait,
    cancelJob,
    cleanup,
  };
}

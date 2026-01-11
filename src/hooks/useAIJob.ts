/**
 * useAIJob Hook
 * 
 * Submit AI jobs and poll for results
 * Supports both queue-based and sync processing
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { AIOperation } from '@/lib/queue/types';

export interface AIJobState {
  jobId: string | null;
  status: 'idle' | 'submitting' | 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  result: any;
  error: string | null;
}

export interface AIJobSubmitParams {
  operation: AIOperation;
  params: Record<string, any>;
  priority?: 'urgent' | 'normal' | 'background';
  metadata?: Record<string, any>;
  sync?: boolean;
}

export interface UseAIJobOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  pollInterval?: number;
  maxPollTime?: number;
}

export function useAIJob(options: UseAIJobOptions = {}) {
  const {
    onSuccess,
    onError,
    pollInterval = 2000,
    maxPollTime = 300000, // 5 minutes max polling
  } = options;

  const [state, setState] = useState<AIJobState>({
    jobId: null,
    status: 'idle',
    progress: 0,
    result: null,
    error: null,
  });

  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, []);

  // ============================================
  // POLL FOR STATUS
  // ============================================

  const pollJobStatus = useCallback(async (jobId: string) => {
    try {
      const response = await fetch(`/api/ai/status/${jobId}`);
      const data = await response.json();

      if (data.status === 'completed') {
        // Job completed
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }

        setState(prev => ({
          ...prev,
          status: 'completed',
          progress: 100,
          result: data.result,
        }));

        onSuccess?.(data.result);
        return;
      }

      if (data.status === 'failed') {
        // Job failed
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }

        const errorMsg = data.error || 'Job failed';
        setState(prev => ({
          ...prev,
          status: 'failed',
          error: errorMsg,
        }));

        onError?.(errorMsg);
        return;
      }

      // Still processing
      setState(prev => ({
        ...prev,
        status: data.status === 'active' ? 'processing' : 'queued',
        progress: data.progress || prev.progress,
      }));

      // Check if we've exceeded max poll time
      if (Date.now() - startTimeRef.current > maxPollTime) {
        if (pollRef.current) {
          clearInterval(pollRef.current);
          pollRef.current = null;
        }

        setState(prev => ({
          ...prev,
          status: 'failed',
          error: 'Job timed out waiting for result',
        }));

        onError?.('Job timed out waiting for result');
      }
    } catch (error: any) {
      console.error('Poll error:', error);
      // Don't stop polling on network errors, just log
    }
  }, [onSuccess, onError, maxPollTime]);

  // ============================================
  // SUBMIT JOB
  // ============================================

  const submit = useCallback(async (params: AIJobSubmitParams): Promise<boolean> => {
    // Reset state
    setState({
      jobId: null,
      status: 'submitting',
      progress: 0,
      result: null,
      error: null,
    });

    // Clear any existing polling
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    try {
      const response = await fetch('/api/ai/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.error || 'Submission failed';
        setState(prev => ({
          ...prev,
          status: 'failed',
          error: errorMsg,
        }));
        onError?.(errorMsg);
        return false;
      }

      // Check if job completed synchronously
      if (data.status === 'completed') {
        setState({
          jobId: data.jobId,
          status: 'completed',
          progress: 100,
          result: data.result,
          error: null,
        });
        onSuccess?.(data.result);
        return true;
      }

      // Check if job failed immediately
      if (data.status === 'failed') {
        const errorMsg = data.error?.message || 'Job failed';
        setState({
          jobId: data.jobId,
          status: 'failed',
          progress: 0,
          result: null,
          error: errorMsg,
        });
        onError?.(errorMsg);
        return false;
      }

      // Job is queued - start polling
      setState({
        jobId: data.jobId,
        status: 'queued',
        progress: 0,
        result: null,
        error: null,
      });

      startTimeRef.current = Date.now();
      pollRef.current = setInterval(() => {
        pollJobStatus(data.jobId);
      }, pollInterval);

      return true;
    } catch (error: any) {
      const errorMsg = error.message || 'Network error';
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: errorMsg,
      }));
      onError?.(errorMsg);
      return false;
    }
  }, [onSuccess, onError, pollInterval, pollJobStatus]);

  // ============================================
  // CANCEL POLLING
  // ============================================

  const cancel = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setState(prev => ({
      ...prev,
      status: 'idle',
    }));
  }, []);

  // ============================================
  // RESET STATE
  // ============================================

  const reset = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setState({
      jobId: null,
      status: 'idle',
      progress: 0,
      result: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    isLoading: state.status === 'submitting' || state.status === 'queued' || state.status === 'processing',
    submit,
    cancel,
    reset,
  };
}

// ============================================
// SPECIALIZED HOOKS
// ============================================

export function useUpscale(options: UseAIJobOptions = {}) {
  const job = useAIJob(options);

  const upscale = useCallback(async (imageUrl: string, factor: number = 2) => {
    return job.submit({
      operation: 'upscale',
      params: {
        image_url: imageUrl,
        upscale_factor: factor,
      },
      priority: 'normal',
    });
  }, [job]);

  return { ...job, upscale };
}

export function useRemoveBackground(options: UseAIJobOptions = {}) {
  const job = useAIJob(options);

  const removeBackground = useCallback(async (imageUrl: string) => {
    return job.submit({
      operation: 'remove-bg',
      params: { image_url: imageUrl },
      priority: 'normal',
    });
  }, [job]);

  return { ...job, removeBackground };
}

export function useGenerate(options: UseAIJobOptions = {}) {
  const job = useAIJob(options);

  const generate = useCallback(async (prompt: string, imageUrl?: string, additionalParams?: Record<string, any>) => {
    return job.submit({
      operation: 'generate',
      params: {
        prompt,
        image_url: imageUrl,
        ...additionalParams,
      },
      priority: 'normal',
    });
  }, [job]);

  return { ...job, generate };
}

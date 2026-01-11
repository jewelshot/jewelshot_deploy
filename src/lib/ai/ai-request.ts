/**
 * AI Request Helper
 * 
 * Wrapper for AI API calls that automatically shows the global loading modal
 * Use this instead of direct fetch to /api/ai/submit
 */

import { AIOperation } from '@/lib/queue/types';
import { useAILoadingStore } from '@/store/aiLoadingStore';

// ============================================
// TYPES
// ============================================

export interface AIRequestParams {
  operation: AIOperation;
  params: Record<string, any>;
  priority?: 'urgent' | 'normal' | 'background';
  metadata?: Record<string, any>;
  sync?: boolean;
}

export interface AIRequestOptions {
  showModal?: boolean;
  timeout?: number;
}

export interface AIRequestResult {
  success: boolean;
  jobId?: string;
  result?: any;
  error?: string;
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Submit an AI request with automatic loading modal
 * 
 * @param params - AI operation parameters
 * @param options - Request options
 * @returns Promise with result
 */
export async function submitAIRequest(
  params: AIRequestParams,
  options: AIRequestOptions = {}
): Promise<AIRequestResult> {
  const { showModal = true, timeout = 120000 } = options;
  const store = useAILoadingStore.getState();

  // Show modal
  if (showModal) {
    store.show(params.operation);
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch('/api/ai/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'AI request failed');
    }

    // Update modal status
    if (showModal) {
      if (data.status === 'completed') {
        store.success();
      } else if (data.status === 'queued') {
        store.updateStatus('queued');
        store.setJobId(data.jobId);
        // Start polling for queue result
        const result = await pollForResult(data.jobId, showModal);
        return { success: true, jobId: data.jobId, result };
      }
    }

    return {
      success: true,
      jobId: data.jobId,
      result: data.result,
    };

  } catch (error: any) {
    if (showModal) {
      store.error(error.message || 'İşlem başarısız oldu');
    }

    return {
      success: false,
      error: error.message || 'Unknown error',
    };
  }
}

// ============================================
// POLLING HELPER
// ============================================

async function pollForResult(jobId: string, showModal: boolean): Promise<any> {
  const store = useAILoadingStore.getState();
  const maxAttempts = 150; // 5 minutes at 2s intervals
  const interval = 2000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await new Promise(resolve => setTimeout(resolve, interval));

    try {
      const response = await fetch(`/api/ai/status/${jobId}`);
      const data = await response.json();

      if (showModal) {
        if (data.state === 'active') {
          store.updateStatus('processing');
          if (typeof data.progress === 'number') {
            store.updateProgress(data.progress);
          }
        }
      }

      if (data.state === 'completed') {
        if (showModal) {
          store.success();
        }
        return data.result;
      }

      if (data.state === 'failed') {
        throw new Error(data.error || 'Job failed');
      }
    } catch (error: any) {
      // Network error - continue polling
      console.error('Poll error:', error);
    }
  }

  throw new Error('Job timed out');
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Show the AI loading modal manually
 */
export function showAILoading(operation: AIOperation, message?: string) {
  const store = useAILoadingStore.getState();
  store.show(operation, message);
}

/**
 * Hide the AI loading modal
 */
export function hideAILoading() {
  const store = useAILoadingStore.getState();
  store.hide();
}

/**
 * Update the AI loading modal status
 */
export function updateAILoadingStatus(status: 'submitting' | 'queued' | 'processing' | 'completed' | 'failed', message?: string) {
  const store = useAILoadingStore.getState();
  store.updateStatus(status, message);
}

/**
 * Show success in the AI loading modal
 */
export function showAISuccess(message?: string) {
  const store = useAILoadingStore.getState();
  store.success(message);
}

/**
 * Show error in the AI loading modal
 */
export function showAIError(message?: string) {
  const store = useAILoadingStore.getState();
  store.error(message);
}

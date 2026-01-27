/**
 * BatchPollingProvider
 * Global provider that maintains batch polling across all pages
 * Should be placed in the root layout
 */

'use client';

import { useEffect } from 'react';
import { useBatchPolling } from '@/hooks/useBatchPolling';
import { useBatchStore } from '@/store/batchStore';
import { useCreditStore } from '@/store/creditStore';

export function BatchPollingProvider({ children }: { children: React.ReactNode }) {
  const { hasProcessingBatches } = useBatchStore();
  const { fetchCredits } = useCreditStore();
  
  // Initialize polling with callbacks
  const { startPolling } = useBatchPolling({
    onComplete: (_projectId, _completed, _failed) => {
      // Refresh credits when batch completes
      fetchCredits();
    },
    showToasts: true,
  });

  // Auto-start polling on mount if there are active batches
  useEffect(() => {
    if (hasProcessingBatches()) {
      startPolling();
    }
  }, [hasProcessingBatches, startPolling]);

  return <>{children}</>;
}

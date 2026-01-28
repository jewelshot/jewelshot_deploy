/**
 * useEnvironments Hook
 * 
 * Fetches and manages custom HDR/EXR environment files from the public/environments folder.
 * Automatically refreshes when the component mounts.
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface EnvironmentFile {
  id: string;
  name: string;
  filename: string;
  path: string;
  format: 'hdr' | 'exr';
  size: number;
  sizeFormatted: string;
  createdAt: string;
}

interface UseEnvironmentsResult {
  environments: EnvironmentFile[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useEnvironments(): UseEnvironmentsResult {
  const [environments, setEnvironments] = useState<EnvironmentFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // AbortController ref for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchEnvironments = useCallback(async () => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/environments', {
        signal: abortControllerRef.current.signal,
      });
      
      // Check response status first
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setEnvironments(data.environments);
      } else {
        setError(data.error || 'Failed to fetch environments');
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Error fetching environments:', err);
      setError('Failed to fetch environments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnvironments();
    
    // Cleanup: abort fetch on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchEnvironments]);

  return {
    environments,
    isLoading,
    error,
    refresh: fetchEnvironments,
  };
}

export default useEnvironments;

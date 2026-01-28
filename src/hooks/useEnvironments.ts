/**
 * useEnvironments Hook
 * 
 * Fetches and manages custom HDR/EXR environment files from the public/environments folder.
 * Automatically refreshes when the component mounts.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

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

  const fetchEnvironments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/environments');
      const data = await response.json();
      
      if (data.success) {
        setEnvironments(data.environments);
      } else {
        setError(data.error || 'Failed to fetch environments');
      }
    } catch (err) {
      console.error('Error fetching environments:', err);
      setError('Failed to fetch environments');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnvironments();
  }, [fetchEnvironments]);

  return {
    environments,
    isLoading,
    error,
    refresh: fetchEnvironments,
  };
}

export default useEnvironments;

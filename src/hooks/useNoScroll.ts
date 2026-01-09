'use client';

import { useEffect } from 'react';

/**
 * Hook to disable body scroll for fixed-viewport pages
 * (Studio, Editor, 3D View, etc.)
 */
export function useNoScroll() {
  useEffect(() => {
    // Add no-scroll class to body
    document.body.classList.add('no-scroll');

    // Remove on unmount
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, []);
}


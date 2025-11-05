/**
 * useMediaQuery Hook
 *
 * Detects screen size and device type for responsive behavior.
 * SSR-safe with proper hydration handling.
 */

'use client';

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Update initial value
    if (matches !== media.matches) {
      setMatches(media.matches);
    }

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
    // Legacy browsers
    else {
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]); // matches is intentionally not in deps to avoid infinite loop

  return matches;
}

/**
 * Predefined breakpoints matching Tailwind CSS
 */
export function useBreakpoint() {
  const isMobile = useMediaQuery('(max-width: 767px)'); // < md
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)'); // md to lg
  const isDesktop = useMediaQuery('(min-width: 1024px)'); // >= lg

  return {
    isMobile,
    isTablet,
    isDesktop,
    isTouch: isMobile || isTablet,
  };
}

/**
 * Detect device type based on user agent (server-side safe)
 */
export function getDeviceType() {
  if (typeof window === 'undefined') return 'desktop';

  const ua = navigator.userAgent.toLowerCase();
  const isMobileUA =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);

  return isMobileUA ? 'mobile' : 'desktop';
}

/**
 * Device Fingerprinting Hook
 * 
 * Collects browser/device information for fraud prevention.
 * Does not collect personally identifiable information.
 */

'use client';

import { useEffect, useState } from 'react';

export interface DeviceFingerprint {
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
  colorDepth?: number;
  hardwareConcurrency?: number;
  touchSupport?: boolean;
}

export function useDeviceFingerprint() {
  const [fingerprint, setFingerprint] = useState<DeviceFingerprint | null>(null);

  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    const collectFingerprint = (): DeviceFingerprint => {
      return {
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        colorDepth: screen.colorDepth,
        hardwareConcurrency: navigator.hardwareConcurrency,
        touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      };
    };

    setFingerprint(collectFingerprint());
  }, []);

  return fingerprint;
}

export default useDeviceFingerprint;

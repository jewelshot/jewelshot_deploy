/**
 * Analytics Hook
 * 
 * Track user events and conversions
 */

'use client';

import { useCallback } from 'react';
import { trackEvent } from '@/components/analytics/PlausibleAnalytics';

export function useAnalytics() {
  const track = useCallback((eventName: string, props?: Record<string, string | number>) => {
    trackEvent(eventName, { props });
  }, []);

  // Pre-defined events for common actions
  const trackSignup = useCallback((method: 'email' | 'social' = 'email') => {
    track('Signup', { method });
  }, [track]);

  const trackLogin = useCallback(() => {
    track('Login');
  }, [track]);

  const trackGeneration = useCallback((operation: string, credits: number) => {
    track('AI_Generation', { operation, credits });
  }, [track]);

  const trackUpgrade = useCallback((plan: string, amount: number) => {
    track('Upgrade', { plan, amount });
  }, [track]);

  const trackCreditPurchase = useCallback((amount: number, credits: number) => {
    track('Credit_Purchase', { amount, credits });
  }, [track]);

  const trackBatchCreate = useCallback((totalImages: number) => {
    track('Batch_Create', { totalImages });
  }, [track]);

  const trackPresetUse = useCallback((presetName: string) => {
    track('Preset_Used', { preset: presetName });
  }, [track]);

  const trackQuickAction = useCallback((action: string) => {
    track('Quick_Action', { action });
  }, [track]);

  const trackError = useCallback((errorType: string, statusCode?: number) => {
    track('Error', { type: errorType, ...(statusCode && { code: statusCode }) });
  }, [track]);

  return {
    track,
    trackSignup,
    trackLogin,
    trackGeneration,
    trackUpgrade,
    trackCreditPurchase,
    trackBatchCreate,
    trackPresetUse,
    trackQuickAction,
    trackError,
  };
}


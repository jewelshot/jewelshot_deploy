/**
 * reCAPTCHA v3 Provider
 * 
 * Invisible reCAPTCHA that runs in background.
 * Add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to .env
 */

'use client';

import Script from 'next/script';
import { createContext, useContext, useCallback, useState } from 'react';

interface RecaptchaContextType {
  executeRecaptcha: (action: string) => Promise<string | null>;
  isLoaded: boolean;
}

const RecaptchaContext = createContext<RecaptchaContextType>({
  executeRecaptcha: async () => null,
  isLoaded: false,
});

export function useRecaptcha() {
  return useContext(RecaptchaContext);
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!siteKey) {
      console.warn('RECAPTCHA_SITE_KEY not configured');
      return null;
    }

    if (!isLoaded || !window.grecaptcha) {
      console.warn('reCAPTCHA not loaded');
      return null;
    }

    try {
      return await new Promise((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            const token = await window.grecaptcha.execute(siteKey, { action });
            resolve(token);
          } catch (error) {
            console.error('reCAPTCHA execution error:', error);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      return null;
    }
  }, [siteKey, isLoaded]);

  if (!siteKey) {
    // If no site key, just render children without reCAPTCHA
    return (
      <RecaptchaContext.Provider value={{ executeRecaptcha, isLoaded: false }}>
        {children}
      </RecaptchaContext.Provider>
    );
  }

  return (
    <RecaptchaContext.Provider value={{ executeRecaptcha, isLoaded }}>
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
        onLoad={() => setIsLoaded(true)}
        strategy="lazyOnload"
      />
      {children}
    </RecaptchaContext.Provider>
  );
}

export default RecaptchaProvider;

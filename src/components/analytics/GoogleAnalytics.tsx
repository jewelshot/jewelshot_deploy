/**
 * Google Analytics 4 (GA4) Component
 * 
 * KURULUM:
 * 1. https://analytics.google.com → Hesap oluştur
 * 2. Yeni property oluştur (Web)
 * 3. Measurement ID al (G-XXXXXXXXXX)
 * 4. .env.local'a ekle: NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 * 
 * TAKİP EDİLEN OLAYLAR:
 * - page_view: Sayfa görüntüleme (otomatik)
 * - sign_up: Kayıt olma
 * - login: Giriş yapma
 * - purchase: Satın alma
 * - generate_image: Görsel oluşturma
 * - subscription_start: Abonelik başlatma
 */

'use client';

import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function GoogleAnalytics() {
  if (!GA_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', {
            page_title: document.title,
            page_location: window.location.href,
          });
        `}
      </Script>
    </>
  );
}

// ============================================
// OLAY TAKİBİ FONKSİYONLARI
// ============================================

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Özel olay gönder
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
}

/**
 * Kayıt olma olayı
 */
export function trackSignUp(method: 'email' | 'google' = 'email') {
  trackEvent('sign_up', { method });
}

/**
 * Giriş yapma olayı
 */
export function trackLogin(method: 'email' | 'google' = 'email') {
  trackEvent('login', { method });
}

/**
 * Görsel oluşturma olayı
 */
export function trackImageGeneration(params: {
  preset?: string;
  credits_used: number;
  success: boolean;
}) {
  trackEvent('generate_image', params);
}

/**
 * Abonelik başlatma olayı
 */
export function trackSubscription(params: {
  plan: string;
  price: number;
  currency?: string;
}) {
  trackEvent('subscription_start', {
    ...params,
    currency: params.currency || 'USD',
  });
}

/**
 * Satın alma olayı (e-commerce)
 */
export function trackPurchase(params: {
  transaction_id: string;
  value: number;
  currency?: string;
  items?: Array<{
    item_name: string;
    price: number;
    quantity: number;
  }>;
}) {
  trackEvent('purchase', {
    ...params,
    currency: params.currency || 'USD',
  });
}

/**
 * Sayfa görüntüleme (SPA için)
 */
export function trackPageView(url: string, title?: string) {
  if (typeof window !== 'undefined' && window.gtag && GA_ID) {
    window.gtag('config', GA_ID, {
      page_path: url,
      page_title: title || document.title,
    });
  }
}

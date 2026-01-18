/**
 * Meta (Facebook) Pixel Component
 * 
 * KURULUM:
 * 1. https://business.facebook.com/events_manager → Pixel oluştur
 * 2. Pixel ID al (15-16 haneli sayı)
 * 3. .env.local'a ekle: NEXT_PUBLIC_META_PIXEL_ID=123456789012345
 * 
 * TAKİP EDİLEN OLAYLAR:
 * - PageView: Sayfa görüntüleme (otomatik)
 * - Lead: Kayıt olma
 * - CompleteRegistration: Kayıt tamamlama
 * - Purchase: Satın alma
 * - Subscribe: Abonelik
 * - InitiateCheckout: Ödeme sayfasına gitme
 */

'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function MetaPixel() {
  const pathname = usePathname();

  // Sayfa değişikliklerini takip et
  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}

// ============================================
// OLAY TAKİBİ FONKSİYONLARI
// ============================================

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Özel olay gönder
 */
export function fbTrack(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, params);
  }
}

/**
 * Özel (custom) olay gönder
 */
export function fbTrackCustom(
  eventName: string,
  params?: Record<string, unknown>
) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params);
  }
}

/**
 * Kayıt başlatma (Lead)
 */
export function fbTrackLead(params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) {
  fbTrack('Lead', params);
}

/**
 * Kayıt tamamlama
 */
export function fbTrackRegistration(params?: {
  content_name?: string;
  status?: string;
  value?: number;
  currency?: string;
}) {
  fbTrack('CompleteRegistration', params);
}

/**
 * Ödeme sayfasına gitme
 */
export function fbTrackInitiateCheckout(params: {
  content_ids?: string[];
  content_name?: string;
  value: number;
  currency?: string;
  num_items?: number;
}) {
  fbTrack('InitiateCheckout', {
    ...params,
    currency: params.currency || 'USD',
  });
}

/**
 * Satın alma
 */
export function fbTrackPurchase(params: {
  content_ids?: string[];
  content_name?: string;
  value: number;
  currency?: string;
  num_items?: number;
}) {
  fbTrack('Purchase', {
    ...params,
    currency: params.currency || 'USD',
  });
}

/**
 * Abonelik başlatma
 */
export function fbTrackSubscribe(params: {
  value: number;
  currency?: string;
  predicted_ltv?: number;
}) {
  fbTrack('Subscribe', {
    ...params,
    currency: params.currency || 'USD',
  });
}

/**
 * İçerik görüntüleme
 */
export function fbTrackViewContent(params: {
  content_ids?: string[];
  content_name?: string;
  content_type?: string;
  value?: number;
  currency?: string;
}) {
  fbTrack('ViewContent', params);
}

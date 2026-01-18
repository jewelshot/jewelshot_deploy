/**
 * Hotjar/Contentsquare Component - Heatmaps & Session Recording
 * 
 * Hotjar artık Contentsquare ile birleşti.
 * Project ID: 548792
 * 
 * ÖZELLİKLER:
 * - Heatmaps: Kullanıcıların nereye tıkladığını gör
 * - Session Recording: Kullanıcı oturumlarını izle
 * - Surveys: Anketler göster
 * - Feedback: Geri bildirim topla
 */

'use client';

import Script from 'next/script';

// Contentsquare/Hotjar script
const HOTJAR_SCRIPT_ID = '1c999ce086fe8';

export function Hotjar() {
  return (
    <Script
      id="hotjar-contentsquare"
      src={`https://t.contentsquare.net/uxa/${HOTJAR_SCRIPT_ID}.js`}
      strategy="afterInteractive"
    />
  );
}

// ============================================
// HOTJAR API FONKSİYONLARI
// ============================================

declare global {
  interface Window {
    hj?: (...args: unknown[]) => void;
  }
}

/**
 * Kullanıcı tanımlama (opsiyonel)
 */
export function hjIdentify(userId: string, attributes?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('identify', userId, attributes);
  }
}

/**
 * Özel olay tetikle
 */
export function hjTrigger(eventName: string) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('trigger', eventName);
  }
}

/**
 * Sanal sayfa görüntüleme (SPA için)
 */
export function hjPageView(url: string) {
  if (typeof window !== 'undefined' && window.hj) {
    window.hj('stateChange', url);
  }
}

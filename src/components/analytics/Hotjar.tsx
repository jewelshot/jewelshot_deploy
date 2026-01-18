/**
 * Hotjar Component - Heatmaps & Session Recording
 * 
 * KURULUM:
 * 1. https://www.hotjar.com → Kayıt ol (Free plan var)
 * 2. Site ekle ve Site ID al (7 haneli sayı)
 * 3. .env.local'a ekle: NEXT_PUBLIC_HOTJAR_ID=1234567
 * 
 * ÖZELLİKLER:
 * - Heatmaps: Kullanıcıların nereye tıkladığını gör
 * - Session Recording: Kullanıcı oturumlarını izle
 * - Surveys: Anketler göster
 * - Feedback: Geri bildirim topla
 */

'use client';

import Script from 'next/script';

const HOTJAR_ID = process.env.NEXT_PUBLIC_HOTJAR_ID;
const HOTJAR_VERSION = 6; // Hotjar script version

export function Hotjar() {
  if (!HOTJAR_ID) return null;

  return (
    <Script id="hotjar" strategy="afterInteractive">
      {`
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${HOTJAR_ID},hjsv:${HOTJAR_VERSION}};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `}
    </Script>
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

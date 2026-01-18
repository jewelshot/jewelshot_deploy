/**
 * Analytics Provider - Tüm analytics'leri tek yerden yönetir
 * 
 * Bu component layout.tsx'e eklenmeli
 */

'use client';

import { GoogleAnalytics } from './GoogleAnalytics';
import { MetaPixel } from './MetaPixel';
import { Hotjar } from './Hotjar';

export function AnalyticsProvider() {
  // Production'da mı kontrol et
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Development'ta da test etmek istersen bu satırı kaldır
  // if (!isProduction) return null;

  return (
    <>
      <GoogleAnalytics />
      <MetaPixel />
      <Hotjar />
    </>
  );
}

// Re-export tracking functions
export {
  trackEvent,
  trackSignUp,
  trackLogin,
  trackImageGeneration,
  trackSubscription,
  trackPurchase,
  trackPageView,
} from './GoogleAnalytics';

export {
  fbTrack,
  fbTrackCustom,
  fbTrackLead,
  fbTrackRegistration,
  fbTrackInitiateCheckout,
  fbTrackPurchase,
  fbTrackSubscribe,
  fbTrackViewContent,
} from './MetaPixel';

export {
  hjIdentify,
  hjTrigger,
  hjPageView,
} from './Hotjar';

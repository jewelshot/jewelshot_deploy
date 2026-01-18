/**
 * Analytics Module
 * 
 * Tüm analytics ve tracking fonksiyonlarını export eder.
 * 
 * KURULUM (.env.local):
 * 
 * # Google Analytics 4
 * NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
 * 
 * # Meta (Facebook) Pixel
 * NEXT_PUBLIC_META_PIXEL_ID=123456789012345
 * 
 * # Hotjar
 * NEXT_PUBLIC_HOTJAR_ID=1234567
 */

// Provider (layout.tsx'e eklenir)
export { AnalyticsProvider } from './AnalyticsProvider';

// Google Analytics
export { GoogleAnalytics } from './GoogleAnalytics';
export {
  trackEvent,
  trackSignUp,
  trackLogin,
  trackImageGeneration,
  trackSubscription,
  trackPurchase,
  trackPageView,
} from './GoogleAnalytics';

// Meta Pixel
export { MetaPixel } from './MetaPixel';
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

// Hotjar
export { Hotjar } from './Hotjar';
export {
  hjIdentify,
  hjTrigger,
  hjPageView,
} from './Hotjar';

// Plausible (zaten var)
export { PlausibleAnalytics } from './PlausibleAnalytics';

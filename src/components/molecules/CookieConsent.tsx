'use client';

/**
 * Cookie Consent Banner
 * 
 * GDPR-compliant cookie consent banner
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-purple-500 shadow-2xl">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Message */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              🍪 We use cookies
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              We use essential cookies to make our site work. We'd also like to use analytics cookies
              (privacy-focused, no personal data) to understand how you use our service and improve it.
            </p>
            <div className="mt-2 flex gap-4 text-xs">
              <Link 
                href="/privacy-policy" 
                className="text-purple-600 hover:underline"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/cookie-policy" 
                className="text-purple-600 hover:underline"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:ml-6">
            <button
              onClick={handleDecline}
              className="px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Essential Only
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Details */}
        <details className="mt-4">
          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900">
            What cookies do we use?
          </summary>
          <div className="mt-3 text-sm text-gray-600 space-y-2">
            <div>
              <strong className="text-gray-900">Essential Cookies:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Authentication (Supabase Auth) - Required for login</li>
                <li>Security tokens (CSRF protection) - Required for security</li>
              </ul>
            </div>
            <div>
              <strong className="text-gray-900">Analytics Cookies:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>
                  Plausible Analytics - Privacy-focused, no personal data, GDPR compliant
                  <span className="text-gray-500"> (Optional - only with your consent)</span>
                </li>
              </ul>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We do NOT use tracking cookies, advertising cookies, or sell your data to third parties.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}


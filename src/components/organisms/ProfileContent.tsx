/**
 * ProfileContent Component
 *
 * Main profile page content with tabs for different sections.
 * Sections: Profile Info, Usage Stats, Settings, Billing
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import { User, BarChart3, Settings, CreditCard, Gift } from 'lucide-react';
import ProfileInfoSection from '@/components/molecules/ProfileInfoSection';
import UsageStatsSection from '@/components/molecules/UsageStatsSection';
import SettingsSection from '@/components/molecules/SettingsSection';
import BillingSection from '@/components/molecules/BillingSection';
import { ReferralSection } from '@/components/molecules/ReferralSection';
import { useLanguage } from '@/lib/i18n';
import { trackEvent } from '@/components/analytics/FacebookPixel';

type TabType = 'profile' | 'stats' | 'settings' | 'billing' | 'referral';

export function ProfileContent() {
  const { leftOpen } = useSidebarStore();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const purchaseTracked = useRef(false);
  
  // Determine initial tab from URL params
  const tabFromUrl = searchParams.get('tab') as TabType | null;
  const isPaymentSuccess = searchParams.get('success') === 'true';
  
  const [activeTab, setActiveTab] = useState<TabType>(tabFromUrl || 'profile');

  // Track Purchase event when redirected from successful payment
  useEffect(() => {
    if (isPaymentSuccess && !purchaseTracked.current) {
      purchaseTracked.current = true;
      
      // Track purchase with Meta Pixel
      // Note: Actual amount comes from webhook, this is for conversion tracking
      trackEvent('Purchase', {
        currency: 'USD',
        value: 0, // Actual value tracked server-side via Conversions API
        content_name: 'Subscription',
        content_type: 'product',
      });
      
      console.log('[Profile] Purchase event tracked');
    }
  }, [isPaymentSuccess]);

  const tabs = [
    { id: 'profile' as TabType, label: t.profile.title, icon: User },
    { id: 'stats' as TabType, label: t.nav.gallery, icon: BarChart3 },
    { id: 'referral' as TabType, label: 'Referral', icon: Gift },
    { id: 'settings' as TabType, label: t.nav.settings, icon: Settings },
    { id: 'billing' as TabType, label: t.profile.plan, icon: CreditCard },
  ];

  return (
    <main
      className="fixed inset-0 overflow-y-auto panel-transition"
      style={{
        paddingLeft: leftOpen ? '260px' : '0',
      }}
    >
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent">
            {t.profile.title}
          </h1>
          <p className="text-white/60">
            {t.profile.account}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="animate-fadeIn">
          {activeTab === 'profile' && <ProfileInfoSection />}
          {activeTab === 'stats' && <UsageStatsSection />}
          {activeTab === 'referral' && <ReferralSection />}
          {activeTab === 'settings' && <SettingsSection />}
          {activeTab === 'billing' && <BillingSection />}
        </div>
      </div>
    </main>
  );
}

export default ProfileContent;



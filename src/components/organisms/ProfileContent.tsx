/**
 * ProfileContent Component
 *
 * Main profile page content with tabs for different sections.
 * Sections: Profile Info, Usage Stats, Settings, Billing
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { User, BarChart3, Settings, CreditCard } from 'lucide-react';
import ProfileInfoSection from '@/components/molecules/ProfileInfoSection';
import UsageStatsSection from '@/components/molecules/UsageStatsSection';
import SettingsSection from '@/components/molecules/SettingsSection';
import BillingSection from '@/components/molecules/BillingSection';

type TabType = 'profile' | 'stats' | 'settings' | 'billing';

const tabs = [
  { id: 'profile' as TabType, label: 'Profile', icon: User },
  { id: 'stats' as TabType, label: 'Usage & Stats', icon: BarChart3 },
  { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  { id: 'billing' as TabType, label: 'Billing', icon: CreditCard },
];

export function ProfileContent() {
  const { leftOpen } = useSidebarStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  return (
    <main
      className="fixed inset-0 overflow-y-auto transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        paddingLeft: leftOpen ? '260px' : '0',
      }}
    >
      <div className="min-h-screen p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-4xl font-bold text-transparent">
            My Profile
          </h1>
          <p className="text-white/60">
            Manage your account settings and preferences
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
          {activeTab === 'settings' && <SettingsSection />}
          {activeTab === 'billing' && <BillingSection />}
        </div>
      </div>
    </main>
  );
}

export default ProfileContent;



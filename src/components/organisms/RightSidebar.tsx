/**
 * Right Sidebar Component
 *
 * AI generation configuration sidebar
 * Includes gender/jewelry selection and mode tabs
 */

'use client';

import React, { useState } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { SelectionDropdown } from '@/components/atoms/SelectionDropdown';

type Gender = 'male' | 'female' | null;
type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | null;
type Mode = 'quick' | 'selective' | 'advanced';

// Dropdown options
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const jewelryOptions = [
  { value: 'ring', label: 'Ring' },
  { value: 'necklace', label: 'Necklace' },
  { value: 'earring', label: 'Earring' },
  { value: 'bracelet', label: 'Bracelet' },
];

export function RightSidebar() {
  const { rightOpen } = useSidebarStore();

  // Selection states
  const [gender, setGender] = useState<Gender>(null);
  const [jewelryType, setJewelryType] = useState<JewelryType>(null);
  const [activeMode, setActiveMode] = useState<Mode>('quick');

  // Jewelry selection is disabled until gender is selected
  const isJewelryDisabled = !gender;

  // Modes are disabled until both gender and jewelry are selected
  const areModesDisabled = !gender || !jewelryType;

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-[100] w-[260px] border-l border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[-4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${rightOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Gender Selection - Inline */}
        <div className="mb-2">
          <SelectionDropdown
            label="Gender"
            placeholder="Select..."
            options={genderOptions}
            value={gender}
            onChange={(value) => setGender(value as Gender)}
            required
            inline
          />
        </div>

        {/* Jewelry Type Selection - Inline */}
        <div className="mb-2">
          <SelectionDropdown
            label="Jewelry"
            placeholder="Select..."
            options={jewelryOptions}
            value={jewelryType}
            onChange={(value) => setJewelryType(value as JewelryType)}
            disabled={isJewelryDisabled}
            required
            inline
          />
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-white/5" />

        {/* Mode Tabs - Ultra Compact */}
        <div className="mb-2">
          {areModesDisabled && (
            <div className="mb-1 text-center text-[9px] text-white/30">
              Complete selections
            </div>
          )}
          <div className="flex gap-0.5 rounded-md border border-white/10 bg-white/[0.02] p-0.5">
            <button
              onClick={() => setActiveMode('quick')}
              disabled={areModesDisabled}
              className={`flex-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-all duration-200 ${
                activeMode === 'quick' && !areModesDisabled
                  ? 'bg-purple-500/20 text-purple-300'
                  : areModesDisabled
                    ? 'cursor-not-allowed text-white/20'
                    : 'text-white/60 hover:text-white'
              }`}
            >
              Quick
            </button>
            <button
              onClick={() => setActiveMode('selective')}
              disabled={areModesDisabled}
              className={`flex-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-all duration-200 ${
                activeMode === 'selective' && !areModesDisabled
                  ? 'bg-purple-500/20 text-purple-300'
                  : areModesDisabled
                    ? 'cursor-not-allowed text-white/20'
                    : 'text-white/60 hover:text-white'
              }`}
            >
              Select
            </button>
            <button
              onClick={() => setActiveMode('advanced')}
              disabled={areModesDisabled}
              className={`flex-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-all duration-200 ${
                activeMode === 'advanced' && !areModesDisabled
                  ? 'bg-purple-500/20 text-purple-300'
                  : areModesDisabled
                    ? 'cursor-not-allowed text-white/20'
                    : 'text-white/60 hover:text-white'
              }`}
            >
              Adv
            </button>
          </div>
        </div>

        {/* Mode Content */}
        {!areModesDisabled && (
          <div className="flex-1">
            {activeMode === 'quick' && (
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-white/60">
                  Quick presets coming soon...
                </p>
              </div>
            )}
            {activeMode === 'selective' && (
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-white/60">
                  Selective options coming soon...
                </p>
              </div>
            )}
            {activeMode === 'advanced' && (
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-xs text-white/60">
                  Advanced settings coming soon...
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

export default RightSidebar;

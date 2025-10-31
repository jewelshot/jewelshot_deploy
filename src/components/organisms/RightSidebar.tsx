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
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-white">AI Generation</h2>
          <p className="mt-1 text-xs text-white/50">
            Configure your image settings
          </p>
        </div>

        {/* Gender Selection */}
        <div className="mb-6">
          <SelectionDropdown
            label="Gender"
            placeholder="Select gender..."
            options={genderOptions}
            value={gender}
            onChange={(value) => setGender(value as Gender)}
            required
          />
        </div>

        {/* Jewelry Type Selection */}
        <div className="mb-6">
          <SelectionDropdown
            label="Jewelry Type"
            placeholder="Select jewelry type..."
            options={jewelryOptions}
            value={jewelryType}
            onChange={(value) => setJewelryType(value as JewelryType)}
            disabled={isJewelryDisabled}
            required
            helperText={isJewelryDisabled ? '(Select gender first)' : undefined}
          />
        </div>

        {/* Divider */}
        <div className="mb-6 h-px bg-white/5" />

        {/* Mode Tabs */}
        <div className="mb-4">
          <label className="mb-2 block text-xs font-medium text-white/70">
            Generation Mode
            {areModesDisabled && (
              <span className="ml-1 text-[10px] text-white/40">
                (Complete selections first)
              </span>
            )}
          </label>
          <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1">
            <button
              onClick={() => setActiveMode('quick')}
              disabled={areModesDisabled}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
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
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeMode === 'selective' && !areModesDisabled
                  ? 'bg-purple-500/20 text-purple-300'
                  : areModesDisabled
                    ? 'cursor-not-allowed text-white/20'
                    : 'text-white/60 hover:text-white'
              }`}
            >
              Selective
            </button>
            <button
              onClick={() => setActiveMode('advanced')}
              disabled={areModesDisabled}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                activeMode === 'advanced' && !areModesDisabled
                  ? 'bg-purple-500/20 text-purple-300'
                  : areModesDisabled
                    ? 'cursor-not-allowed text-white/20'
                    : 'text-white/60 hover:text-white'
              }`}
            >
              Advanced
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

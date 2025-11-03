/**
 * Right Sidebar Component
 *
 * AI generation configuration sidebar
 * Includes gender/jewelry selection and mode tabs
 */

'use client';

import React, { useState } from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import { ConfigurationAccordion } from '@/components/molecules/ConfigurationAccordion';
import { QuickModeContent } from '@/components/molecules/QuickModeContent';
import { SelectiveModeContent } from '@/components/molecules/SelectiveModeContent';
import { PresetConfirmModal } from '@/components/molecules/PresetConfirmModal';
import { presetPrompts } from '@/lib/preset-prompts';

type Gender = 'women' | 'men' | null;
type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | null;
type Mode = 'quick' | 'selective' | 'advanced';

// Dropdown options
const genderOptions = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
];

const jewelryOptions = [
  { value: 'ring', label: 'Ring' },
  { value: 'necklace', label: 'Necklace' },
  { value: 'bracelet', label: 'Bracelet' },
  { value: 'earring', label: 'Earring' },
];

// Aspect ratio options
const aspectRatioOptions = [
  { value: '1:1', label: '1:1', description: 'Square' },
  { value: '4:5', label: '4:5', description: 'Portrait' },
  { value: '3:4', label: '3:4', description: 'Classic' },
  { value: '2:3', label: '2:3', description: 'Standard' },
  { value: '9:16', label: '9:16', description: 'Story' },
  { value: '16:9', label: '16:9', description: 'Landscape' },
  { value: '21:9', label: '21:9', description: 'Ultrawide' },
  { value: '4:3', label: '4:3', description: 'Classic' },
];

interface RightSidebarProps {
  onGenerateWithPreset?: (prompt: string) => void;
}

export function RightSidebar({ onGenerateWithPreset }: RightSidebarProps) {
  const { rightOpen } = useSidebarStore();

  // Selection states
  const [gender, setGender] = useState<Gender>(null);
  const [jewelryType, setJewelryType] = useState<JewelryType>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('9:16'); // Default: 9:16
  const [activeMode, setActiveMode] = useState<Mode>('quick');

  // Modal state
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    presetName: string;
    presetId: string;
    requiresModel: boolean;
  } | null>(null);

  // Modes are disabled until both gender and jewelry are selected
  const areModesDisabled = !gender || !jewelryType;

  // Handle preset selection
  const handlePresetSelect = (presetId: string) => {
    if (!jewelryType) return;

    const preset = presetPrompts[presetId];
    if (!preset) return;

    // Show confirmation modal
    setConfirmModal({
      show: true,
      presetName: preset.name,
      presetId,
      requiresModel: preset.requiresModel,
    });
  };

  // Handle generation confirmation
  const handleConfirmGeneration = () => {
    if (!confirmModal || !jewelryType) return;

    const preset = presetPrompts[confirmModal.presetId];
    const prompt = preset.buildPrompt(
      jewelryType,
      gender || undefined,
      aspectRatio
    );

    // Close modal
    setConfirmModal(null);

    // Trigger generation
    if (onGenerateWithPreset) {
      onGenerateWithPreset(prompt);
    }
  };

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-[100] w-[260px] border-l border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[-4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${rightOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Configuration Accordion */}
        <div className="mb-2">
          <ConfigurationAccordion
            gender={gender}
            jewelryType={jewelryType}
            onGenderChange={(value) => setGender(value as Gender)}
            onJewelryChange={(value) => setJewelryType(value as JewelryType)}
            genderOptions={genderOptions}
            jewelryOptions={jewelryOptions}
          />
        </div>

        {/* Aspect Ratio Selection */}
        <div className="mb-2">
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[9px] font-medium uppercase tracking-wide text-white/60">
              Aspect Ratio
            </span>
            <span className="text-[9px] text-white/40">{aspectRatio}</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {aspectRatioOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setAspectRatio(option.value)}
                className={`rounded border px-1.5 py-1 text-[9px] font-medium transition-all duration-200 ${
                  aspectRatio === option.value
                    ? 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.05] hover:text-white'
                }`}
              >
                <div className="font-semibold">{option.label}</div>
                <div className="text-[7px] text-white/40">
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-white/5" />

        {/* Mode Tabs - Ultra Compact */}
        <div className="mb-2">
          <div
            className={`flex gap-0.5 rounded-md border p-0.5 transition-all duration-300 ${areModesDisabled ? 'border-white/5 bg-white/[0.01]' : 'border-white/10 bg-white/[0.02]'}`}
          >
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
        <div
          className={`flex-1 overflow-y-auto transition-all duration-300 ${areModesDisabled ? 'pointer-events-none opacity-30 blur-sm' : 'opacity-100'}`}
        >
          {activeMode === 'quick' && (
            <QuickModeContent onPresetSelect={handlePresetSelect} />
          )}
          {activeMode === 'selective' && (
            <SelectiveModeContent
              gender={gender}
              jewelryType={jewelryType}
              aspectRatio={aspectRatio}
              onGenerate={onGenerateWithPreset}
            />
          )}
          {activeMode === 'advanced' && (
            <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <p className="text-[9px] text-white/40">
                Advanced settings coming soon...
              </p>
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmModal?.show && (
          <PresetConfirmModal
            presetName={confirmModal.presetName}
            jewelryType={jewelryType || ''}
            requiresModel={confirmModal.requiresModel}
            gender={gender || undefined}
            onConfirm={handleConfirmGeneration}
            onCancel={() => setConfirmModal(null)}
          />
        )}
      </div>
    </aside>
  );
}

export default RightSidebar;

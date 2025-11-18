/**
 * Right Sidebar Component
 *
 * AI generation configuration sidebar
 * Includes gender/jewelry selection and mode tabs
 */

'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { ConfigurationAccordion } from '@/components/molecules/ConfigurationAccordion';
import { QuickModeContent } from '@/components/molecules/QuickModeContent';
import { SelectiveModeContent } from '@/components/molecules/SelectiveModeContent';
import { AdvancedModeContent } from '@/components/molecules/AdvancedModeContent';
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
  onGenerateWithPreset?: (prompt: string, aspectRatio?: string) => void;
}

export function RightSidebar({ onGenerateWithPreset }: RightSidebarProps) {
  const { rightOpen } = useSidebarStore();

  // Selection states
  const [gender, setGender] = useState<Gender>(null);
  const [jewelryType, setJewelryType] = useState<JewelryType>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('9:16'); // Default: 9:16
  const [activeMode, setActiveMode] = useState<Mode>('quick');
  const [isAspectRatioOpen, setIsAspectRatioOpen] = useState<boolean>(true); // Start open

  // Modal state
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    presetName: string;
    presetId: string;
    requiresModel: boolean;
  } | null>(null);

  // Handle preset selection (no restrictions - always allow)
  const handlePresetSelect = (presetId: string) => {
    const preset = presetPrompts[presetId];
    if (!preset) return;

    // Show confirmation modal (jewelry selection can happen in modal if needed)
    setConfirmModal({
      show: true,
      presetName: preset.name,
      presetId,
      requiresModel: preset.requiresModel,
    });
  };

  // Handle generation confirmation
  const handleConfirmGeneration = (selectedJewelryType?: string) => {
    if (!confirmModal) return;

    // Use provided jewelry type or fallback to state
    const finalJewelryType = selectedJewelryType || jewelryType;

    if (!finalJewelryType) {
      // This shouldn't happen if modal handles it correctly
      console.error('[RightSidebar] No jewelry type provided');
      return;
    }

    const preset = presetPrompts[confirmModal.presetId];
    const prompt = preset.buildPrompt(
      finalJewelryType,
      gender || undefined,
      aspectRatio
    );

    // Close modal
    setConfirmModal(null);

    // Trigger generation with aspect ratio
    if (onGenerateWithPreset) {
      onGenerateWithPreset(prompt, aspectRatio);
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

        {/* Aspect Ratio Selection - Accordion */}
        <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.02]">
          {/* Header - Always visible */}
          <button
            onClick={() => setIsAspectRatioOpen(!isAspectRatioOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">📐</span>
              <span className="text-[11px] font-medium text-white/90">
                Aspect Ratio
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-white/40">{aspectRatio}</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                  isAspectRatioOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {/* Content - Collapsible */}
          {isAspectRatioOpen && (
            <div className="border-t border-white/5 p-2">
              <div className="grid grid-cols-4 gap-1">
                {aspectRatioOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setAspectRatio(option.value);
                      // Auto-minimize after selection
                      setIsAspectRatioOpen(false);
                    }}
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
          )}
        </div>

        {/* Divider */}
        <div className="my-2 h-px bg-white/5" />

        {/* Mode Tabs - Ultra Compact - Always Active */}
        <div className="mb-2">
          <div className="flex gap-0.5 rounded-md border border-white/10 bg-white/[0.02] p-0.5 transition-all duration-300">
            <button
              onClick={() => setActiveMode('quick')}
              className={`flex-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-all duration-200 ${
                activeMode === 'quick'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Quick
            </button>
            <button
              onClick={() => setActiveMode('selective')}
              className={`flex-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-all duration-200 ${
                activeMode === 'selective'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Select
            </button>
            <button
              onClick={() => setActiveMode('advanced')}
              className={`flex-1 rounded px-1.5 py-0.5 text-[10px] font-medium transition-all duration-200 ${
                activeMode === 'advanced'
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Adv
            </button>
          </div>
        </div>

        {/* Mode Content - Always Active */}
        <div className="flex-1 overflow-y-auto transition-all duration-300">
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
            <AdvancedModeContent
              gender={gender}
              jewelryType={jewelryType}
              aspectRatio={aspectRatio}
              onGenerate={onGenerateWithPreset}
            />
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmModal?.show && (
          <PresetConfirmModal
            presetName={confirmModal.presetName}
            jewelryType={jewelryType}
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

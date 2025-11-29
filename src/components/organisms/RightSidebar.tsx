/**
 * Right Sidebar Component
 *
 * AI generation configuration sidebar
 * Includes gender/jewelry selection and mode tabs
 */

'use client';

import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { GenerationSettingsModal } from '@/components/molecules/GenerationSettingsModal';
import { QuickModeContent } from '@/components/molecules/QuickModeContent';
import { SelectiveModeContent } from '@/components/molecules/SelectiveModeContent';
import { AdvancedModeContent } from '@/components/molecules/AdvancedModeContent';
import { PresetConfirmModal } from '@/components/molecules/PresetConfirmModal';
import { presetPrompts } from '@/lib/preset-prompts';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('RightSidebar');

type Gender = 'women' | 'men' | null;
type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | null;
type Mode = 'quick' | 'selective' | 'advanced';

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

  // Modal states
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    presetName: string;
    presetId: string;
    requiresModel: boolean;
  } | null>(null);

  // Handle preset selection (no restrictions - always allow)
  const handlePresetSelect = (presetId: string) => {
    const preset = presetPrompts[presetId];
    if (!preset) {
      logger.error('RightSidebar: Preset not found:', presetId);
      return;
    }

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
      logger.error('RightSidebar: No jewelry type provided');
      return;
    }

    const preset = presetPrompts[confirmModal.presetId];
    if (!preset) {
      logger.error('RightSidebar: Preset not found during generation:', confirmModal.presetId);
      setConfirmModal(null);
      return;
    }

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

  // Helper to get current settings summary
  const getSettingsSummary = () => {
    const parts: string[] = [];
    if (gender) parts.push(gender === 'women' ? 'Women' : 'Men');
    if (jewelryType) parts.push(jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1));
    parts.push(aspectRatio);
    return parts.join(' · ');
  };

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-[100] w-[260px] border-l border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[-4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${rightOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Settings Button - Replaces Configuration Accordion & Aspect Ratio */}
        <button
          onClick={() => setSettingsModalOpen(true)}
          className="group mb-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 transition-all hover:border-purple-500/30 hover:bg-purple-500/5"
        >
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-purple-400 transition-transform group-hover:rotate-45" />
            <div className="text-left">
              <div className="text-xs font-medium text-white">Settings</div>
              <div className="text-[10px] text-white/50">
                {getSettingsSummary()}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-white/40 group-hover:text-purple-400">
            Click to edit
          </div>
        </button>

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

        {/* Generation Settings Modal */}
        <GenerationSettingsModal
          isOpen={settingsModalOpen}
          onClose={() => setSettingsModalOpen(false)}
          gender={gender}
          onGenderChange={(value) => setGender(value)}
          jewelryType={jewelryType}
          onJewelryChange={(value) => setJewelryType(value)}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
        />
      </div>
    </aside>
  );
}

export default RightSidebar;

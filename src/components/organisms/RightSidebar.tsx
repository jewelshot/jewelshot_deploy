/**
 * Right Sidebar Component
 *
 * AI generation configuration sidebar
 * Includes gender/jewelry selection and mode tabs
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { GenerationSettingsModal } from '@/components/molecules/GenerationSettingsModal';
import { QuickModeContent } from '@/components/molecules/QuickModeContent';
import { QuickPresetsGrid } from '@/components/molecules/QuickPresetsGrid';
import { PresetModeTabs, PresetMode } from '@/components/molecules/PresetModeTabs';
import { SelectivePresetsPanel } from '@/components/molecules/SelectivePresetsPanel';
import { AdvancedPresetsPanel } from '@/components/molecules/AdvancedPresetsPanel';
import { PresetConfirmModal } from '@/components/molecules/PresetConfirmModal';
import { presetPrompts } from '@/lib/preset-prompts';
import { getPresetById } from '@/data/presets';
import { createScopedLogger } from '@/lib/logger';
import { loadGenerationSettings, areSettingsComplete, type GenerationSettings, type FaceVisibility } from '@/lib/generation-settings-storage';

const logger = createScopedLogger('RightSidebar');

type Gender = 'women' | 'men' | null;
type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | null;

// Custom events for image upload/close
declare global {
  interface WindowEventMap {
    'jewelshot:imageUploaded': CustomEvent<{ fileName?: string; imageUrl?: string }>;
    'jewelshot:imageClosed': CustomEvent;
  }
}

interface RightSidebarProps {
  /** Mode: 'studio' shows confirmation modal, 'batch' adds preset directly */
  mode?: 'studio' | 'batch';
  onGenerateWithPreset?: (prompt: string, aspectRatio?: string, presetName?: string, presetId?: string) => void;
}

export function RightSidebar({ mode = 'studio', onGenerateWithPreset }: RightSidebarProps) {
  const { rightOpen } = useSidebarStore();

  // Selection states
  const [gender, setGender] = useState<Gender>(null);
  const [jewelryType, setJewelryType] = useState<JewelryType>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('9:16'); // Default: 9:16
  const [showFace, setShowFace] = useState<FaceVisibility>('show'); // Default: show face
  
  // Preset mode state
  const [presetMode, setPresetMode] = useState<PresetMode>('quick');

  // Modal states
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [isSettingsRequired, setIsSettingsRequired] = useState(false);
  
  // Thumbnail state for canvas image preview
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    presetName: string;
    presetId: string;
    requiresModel: boolean;
    isLibraryPreset: boolean;
    libraryPrompt?: string;
    libraryNegativePrompt?: string;
  } | null>(null);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = loadGenerationSettings();
    if (savedSettings) {
      setGender(savedSettings.gender);
      setJewelryType(savedSettings.jewelryType);
      setAspectRatio(savedSettings.aspectRatio);
      if (savedSettings.showFace) {
        setShowFace(savedSettings.showFace);
      }
      logger.info('Loaded saved generation settings', savedSettings);
    }
  }, []);

  // Listen for image upload events
  useEffect(() => {
    const handleImageUpload = (event: CustomEvent<{ fileName?: string; imageUrl?: string }>) => {
      logger.info('Image uploaded event received');
      
      // Update thumbnail if image URL is provided
      if (event.detail?.imageUrl) {
        setThumbnailUrl(event.detail.imageUrl);
        logger.info('Thumbnail URL updated');
      }
      
      // Check if we should apply saved settings or show modal
      const savedSettings = loadGenerationSettings();
      
      if (savedSettings?.applyToAll && areSettingsComplete(savedSettings)) {
        // Use saved settings without showing modal
        logger.info('Using saved settings (apply to all enabled)');
        setGender(savedSettings.gender);
        setJewelryType(savedSettings.jewelryType);
        setAspectRatio(savedSettings.aspectRatio);
        if (savedSettings.showFace) {
          setShowFace(savedSettings.showFace);
        }
      } else {
        // Show modal (required)
        logger.info('Opening settings modal (required)');
        setIsSettingsRequired(true);
        setSettingsModalOpen(true);
      }
    };

    const handleImageClosed = () => {
      logger.info('Image closed event received');
      setThumbnailUrl(null);
    };

    window.addEventListener('jewelshot:imageUploaded', handleImageUpload);
    window.addEventListener('jewelshot:imageClosed', handleImageClosed);
    return () => {
      window.removeEventListener('jewelshot:imageUploaded', handleImageUpload);
      window.removeEventListener('jewelshot:imageClosed', handleImageClosed);
    };
  }, []);

  // Handle preset selection - supports both presetPrompts and Library presets
  const handlePresetSelect = (presetId: string) => {
    // First check presetPrompts (legacy/built-in presets)
    const legacyPreset = presetPrompts[presetId];
    if (legacyPreset) {
      logger.info('RightSidebar: Found legacy preset:', presetId, 'mode:', mode);
      
      // BATCH MODE: Add preset directly without confirmation
      if (mode === 'batch') {
        const prompt = legacyPreset.buildPrompt(
          jewelryType || 'ring',
          gender || undefined,
          aspectRatio
        );
        onGenerateWithPreset?.(prompt, aspectRatio, legacyPreset.name, presetId);
        return;
      }
      
      // STUDIO MODE: Show confirmation modal
      setConfirmModal({
        show: true,
        presetName: legacyPreset.name,
        presetId,
        requiresModel: legacyPreset.requiresModel,
        isLibraryPreset: false,
      });
      return;
    }

    // Then check Library presets (from presets.ts / PRESET_CATEGORIES)
    const libraryPreset = getPresetById(presetId);
    if (libraryPreset) {
      logger.info('RightSidebar: Found library preset:', presetId, libraryPreset.title, 'mode:', mode);
      
      // BATCH MODE: Add preset directly without confirmation
      if (mode === 'batch') {
        const settingsHeader = `[GENERATION SETTINGS]
Gender: ${gender || 'not specified'}
Jewelry Type: ${jewelryType || 'ring'}
Aspect Ratio: ${aspectRatio}
Model Face: ${showFace === 'hide' ? 'HIDDEN (crop at neck/chin, NO face visible)' : 'VISIBLE (full model with face)'}

[PROMPT]
`;
        let prompt = settingsHeader + (libraryPreset.prompt || '');
        if (libraryPreset.negativePrompt) {
          prompt += `

--no
${libraryPreset.negativePrompt}`;
        }
        onGenerateWithPreset?.(prompt, aspectRatio, libraryPreset.title, presetId);
        return;
      }
      
      // STUDIO MODE: Show confirmation modal
      setConfirmModal({
        show: true,
        presetName: libraryPreset.title,
        presetId,
        requiresModel: false, // Library presets don't require model
        isLibraryPreset: true,
        libraryPrompt: libraryPreset.prompt,
        libraryNegativePrompt: libraryPreset.negativePrompt,
      });
      return;
    }

    logger.error('RightSidebar: Preset not found in any source:', presetId);
  };

  // Handle generation confirmation
  const handleConfirmGeneration = (selectedJewelryType?: string) => {
    if (!confirmModal) return;

    // Use provided jewelry type or fallback to state
    const finalJewelryType = selectedJewelryType || jewelryType;

    if (!finalJewelryType) {
      logger.error('RightSidebar: No jewelry type provided');
      return;
    }

    let finalPrompt: string;

    if (confirmModal.isLibraryPreset) {
      // Library preset - build prompt with generation settings header
      const settingsHeader = `[GENERATION SETTINGS]
Gender: ${gender || 'not specified'}
Jewelry Type: ${finalJewelryType}
Aspect Ratio: ${aspectRatio}
Model Face: ${showFace === 'hide' ? 'HIDDEN (crop at neck/chin, NO face visible)' : 'VISIBLE (full model with face)'}

[PROMPT]
`;
      finalPrompt = settingsHeader + (confirmModal.libraryPrompt || '');
      
      // Add negative prompt if exists
      if (confirmModal.libraryNegativePrompt) {
        finalPrompt += `

--no
${confirmModal.libraryNegativePrompt}`;
      }

      logger.info('RightSidebar: Built library preset prompt with settings');
    } else {
      // Legacy preset - use buildPrompt method
      const preset = presetPrompts[confirmModal.presetId];
      if (!preset) {
        logger.error('RightSidebar: Legacy preset not found during generation:', confirmModal.presetId);
        setConfirmModal(null);
        return;
      }

      finalPrompt = preset.buildPrompt(
        finalJewelryType,
        gender || undefined,
        aspectRatio
      );
    }

    // Close modal
    setConfirmModal(null);

    // Trigger generation with aspect ratio, preset name and ID
    if (onGenerateWithPreset) {
      logger.info('RightSidebar: Triggering generation', { 
        presetName: confirmModal.presetName,
        presetId: confirmModal.presetId,
        jewelryType: finalJewelryType,
        aspectRatio,
        promptLength: finalPrompt.length 
      });
      onGenerateWithPreset(finalPrompt, aspectRatio, confirmModal.presetName, confirmModal.presetId);
    } else {
      logger.warn('RightSidebar: onGenerateWithPreset callback not provided');
    }
  };

  // Helper to get current settings summary
  const getSettingsSummary = () => {
    const parts: string[] = [];
    if (gender) parts.push(gender === 'women' ? 'Women' : 'Men');
    if (jewelryType) parts.push(jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1));
    parts.push(aspectRatio);
    if (showFace === 'hide') parts.push('No Face');
    return parts.length > 1 ? parts.join(' · ') : 'Not configured';
  };

  // Handle settings modal save
  const handleSettingsSave = (applyToAll: boolean) => {
    logger.info('Settings saved', { gender, jewelryType, aspectRatio, applyToAll });
    setIsSettingsRequired(false);
  };

  // Handle manual settings button click
  const handleSettingsButtonClick = () => {
    setIsSettingsRequired(false); // Not required when opened manually
    setSettingsModalOpen(true);
  };

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-[100] w-[260px] border-l border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[-4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${rightOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Settings Button with Thumbnail Preview */}
        <button
          onClick={handleSettingsButtonClick}
          className="group relative mb-3 flex items-center gap-2 overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 transition-all hover:border-purple-500/30 hover:bg-purple-500/5"
        >
          {/* Thumbnail with gradient fade - positioned on the right, fades to left */}
          {thumbnailUrl && (
            <div className="pointer-events-none absolute inset-y-0 right-0 z-0 w-32 overflow-hidden">
              {/* Thumbnail image */}
              <div 
                className="absolute inset-0 scale-125 bg-cover bg-center transition-transform duration-300 group-hover:scale-150"
                style={{
                  backgroundImage: `url(${thumbnailUrl})`,
                }}
              />
              {/* Gradient overlay - fades from right (visible) to left (hidden) */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to left, transparent 0%, transparent 30%, rgba(10,10,10,0.5) 60%, rgba(10,10,10,1) 100%)',
                }}
              />
            </div>
          )}
          
          {/* Content - stays on top */}
          <Settings className="relative z-10 h-4 w-4 text-purple-400 transition-transform group-hover:rotate-45" />
          <div className="relative z-10 flex-1 text-left">
            <div className="text-xs font-medium text-white">Settings</div>
            <div className="text-[10px] text-white/50">
              {getSettingsSummary()}
            </div>
          </div>
        </button>

        {/* Divider */}
        <div className="my-2 h-px bg-white/5" />

        {/* Preset Mode Tabs */}
        <div className="mb-3">
          <PresetModeTabs 
            activeMode={presetMode} 
            onModeChange={setPresetMode} 
          />
        </div>

        {/* Preset Content based on mode */}
        <div className="flex-1 overflow-y-auto">
          {/* Quick Mode */}
          {presetMode === 'quick' && (
            <div className="space-y-3">
              {/* Built-in Quick Presets */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-[10px] font-medium text-white/50">Built-in Presets</h3>
                </div>
                <QuickPresetsGrid 
                  onPresetSelect={handlePresetSelect}
                  disabled={!jewelryType}
                />
                {!jewelryType && (
                  <p className="mt-1.5 text-center text-[9px] text-amber-400/70">
                    Configure settings to enable presets
                  </p>
                )}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/5" />

              {/* Library Presets */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-[10px] font-medium text-white/50">My Library</h3>
                </div>
                <QuickModeContent 
                  onPresetSelect={handlePresetSelect}
                  gender={gender}
                  jewelryType={jewelryType}
                />
              </div>
            </div>
          )}

          {/* Selective Mode */}
          {presetMode === 'selective' && (
            <SelectivePresetsPanel
              gender={gender}
              jewelryType={jewelryType}
              aspectRatio={aspectRatio}
              showFace={showFace}
              onGenerate={(prompt) => {
                if (onGenerateWithPreset) {
                  onGenerateWithPreset(prompt, aspectRatio, 'Selective Preset', 'selective-custom');
                }
              }}
              disabled={!jewelryType}
            />
          )}

          {/* Advanced Mode */}
          {presetMode === 'advanced' && (
            <AdvancedPresetsPanel
              gender={gender}
              jewelryType={jewelryType}
              aspectRatio={aspectRatio}
              showFace={showFace}
              onGenerate={(prompt) => {
                if (onGenerateWithPreset) {
                  onGenerateWithPreset(prompt, aspectRatio, 'Advanced Preset', 'advanced-custom');
                }
              }}
              disabled={!jewelryType}
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
          onSave={handleSettingsSave}
          gender={gender}
          onGenderChange={(value) => setGender(value)}
          jewelryType={jewelryType}
          onJewelryChange={(value) => setJewelryType(value)}
          aspectRatio={aspectRatio}
          onAspectRatioChange={setAspectRatio}
          showFace={showFace}
          onShowFaceChange={(value) => setShowFace(value)}
          isRequired={isSettingsRequired}
        />
      </div>
    </aside>
  );
}

export default RightSidebar;

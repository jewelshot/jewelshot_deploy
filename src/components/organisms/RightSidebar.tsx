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
import { NotificationCenter } from '@/components/molecules/NotificationCenter';
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
import { useLanguage } from '@/lib/i18n';

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
  const { t } = useLanguage();

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
          aspectRatio,
          showFace // Add showFace parameter
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
      
      // Build prompt dynamically if buildPrompt function exists
      let prompt: string;
      if (libraryPreset.buildPrompt) {
        // Use dynamic buildPrompt with all generation settings
        prompt = libraryPreset.buildPrompt({
          jewelryType: jewelryType || 'ring',
          gender: gender || 'women',
          aspectRatio,
          showFace,
        });
      } else if (libraryPreset.prompt) {
        // Fallback to static prompt with settings header
        const settingsHeader = `[GENERATION SETTINGS]
Gender: ${gender || 'not specified'}
Jewelry Type: ${jewelryType || 'ring'}
Aspect Ratio: ${aspectRatio}
Model Face: ${showFace === 'hide' ? 'HIDDEN (crop at neck/chin, NO face visible)' : 'VISIBLE (full model with face)'}

[PROMPT]
`;
        prompt = settingsHeader + libraryPreset.prompt;
        if (libraryPreset.negativePrompt) {
          prompt += `

--no
${libraryPreset.negativePrompt}`;
        }
      } else {
        logger.error('RightSidebar: Library preset has no prompt or buildPrompt:', presetId);
        return;
      }
      
      // BATCH MODE: Add preset directly without confirmation
      if (mode === 'batch') {
        onGenerateWithPreset?.(prompt, aspectRatio, libraryPreset.title, presetId);
        return;
      }
      
      // STUDIO MODE: Show confirmation modal with generated prompt
      setConfirmModal({
        show: true,
        presetName: libraryPreset.title,
        presetId,
        requiresModel: false, // Library presets don't require model
        isLibraryPreset: true,
        libraryPrompt: prompt, // Use the dynamically built prompt
        libraryNegativePrompt: undefined, // Already included in prompt if exists
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
      // Library preset - prompt already built in handlePresetSelect
      finalPrompt = confirmModal.libraryPrompt || '';
      logger.info('RightSidebar: Using pre-built library preset prompt');
    } else {
      // Legacy preset - use buildPrompt method with all settings including showFace
      const preset = presetPrompts[confirmModal.presetId];
      if (!preset) {
        logger.error('RightSidebar: Legacy preset not found during generation:', confirmModal.presetId);
        setConfirmModal(null);
        return;
      }

      finalPrompt = preset.buildPrompt(
        finalJewelryType,
        gender || undefined,
        aspectRatio,
        showFace // Include showFace parameter
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
    if (gender) parts.push(gender === 'women' ? t.gender.women : t.gender.men);
    if (jewelryType) {
      const jewelryLabels: Record<string, string> = {
        ring: t.jewelry.ring,
        necklace: t.jewelry.necklace,
        earring: t.jewelry.earring,
        bracelet: t.jewelry.bracelet,
      };
      parts.push(jewelryLabels[jewelryType] || jewelryType);
    }
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
      className={`fixed bottom-0 right-0 top-0 z-[100] w-[260px] border-l border-white/10 bg-[rgba(10,10,10,0.7)] shadow-[-4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] panel-transition ${rightOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="no-scrollbar flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Header - Settings & Notification aligned with left sidebar logo */}
        <div className="flex items-center justify-between mb-3 min-h-[44px]">
          {/* Settings Button - Compact */}
          <button
            onClick={handleSettingsButtonClick}
            className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-left transition-all hover:border-white/20 hover:bg-white/[0.06]"
            title={getSettingsSummary()}
          >
            <Settings className="h-4 w-4 text-white/50 transition-transform group-hover:rotate-45 group-hover:text-white/70" />
            <div className="max-w-[140px]">
              <div className="text-[11px] font-medium text-white/80 truncate">
                {getSettingsSummary()}
              </div>
            </div>
          </button>

          {/* Notification */}
          <NotificationCenter />
        </div>

        {/* Divider */}
        <div className="mb-3 h-px bg-white/5" />

        {/* Preset Mode Tabs */}
        <div className="mb-3">
          <PresetModeTabs 
            activeMode={presetMode} 
            onModeChange={setPresetMode} 
          />
        </div>

        {/* Preset Content based on mode */}
        <div className="no-scrollbar flex-1 overflow-y-auto">
          {/* Quick Mode */}
          {presetMode === 'quick' && (
            <div className="space-y-3">
              {/* Built-in Quick Presets */}
              <div>
                <QuickPresetsGrid 
                  onPresetSelect={handlePresetSelect}
                  disabled={!jewelryType}
                />
                {!jewelryType && (
                  <p className="mt-1.5 text-center text-[9px] text-amber-400/70">
                    {t.rightSidebar.configureSettings}
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
            aspectRatio={aspectRatio}
            imageUrl={thumbnailUrl || undefined}
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

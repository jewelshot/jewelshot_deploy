/**
 * Generation Settings Modal
 * 
 * Modal for configuring generation parameters (gender, jewelry type, aspect ratio, face visibility)
 * These settings don't change frequently, so they're hidden in a modal to save space
 */

'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { saveGenerationSettings, areSettingsComplete, FaceVisibility } from '@/lib/generation-settings-storage';
import { useLanguage } from '@/lib/i18n';

type Gender = 'women' | 'men' | null;
type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | null;

interface GenerationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (applyToAll: boolean) => void;
  
  // Gender
  gender: Gender;
  onGenderChange: (value: Gender) => void;
  
  // Jewelry Type
  jewelryType: JewelryType;
  onJewelryChange: (value: JewelryType) => void;
  
  // Aspect Ratio
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
  
  // Face Visibility
  showFace: FaceVisibility;
  onShowFaceChange: (value: FaceVisibility) => void;
  
  // Required validation
  isRequired?: boolean;
}

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

// Vertical formats - ordered by increasing width (narrowest to widest)
const verticalRatios = [
  { value: '9:16', label: '9:16', description: 'Story', ratio: 0.5625 },
  { value: '2:3', label: '2:3', description: 'Standard', ratio: 0.667 },
  { value: '3:4', label: '3:4', description: 'Classic', ratio: 0.75 },
  { value: '4:5', label: '4:5', description: 'Portrait', ratio: 0.8 },
];

// Horizontal formats - ordered by increasing width (narrowest to widest)
const horizontalRatios = [
  { value: '1:1', label: '1:1', description: 'Square', ratio: 1 },
  { value: '4:3', label: '4:3', description: 'Classic', ratio: 1.333 },
  { value: '16:9', label: '16:9', description: 'Landscape', ratio: 1.778 },
  { value: '21:9', label: '21:9', description: 'Ultrawide', ratio: 2.333 },
];

const faceOptions = [
  { value: 'show', label: 'Show Face', icon: Eye, description: 'Full model with face visible' },
  { value: 'hide', label: 'Hide Face', icon: EyeOff, description: 'Cropped, focus on jewelry' },
];

export function GenerationSettingsModal({
  isOpen,
  onClose,
  onSave,
  gender,
  onGenderChange,
  jewelryType,
  onJewelryChange,
  aspectRatio,
  onAspectRatioChange,
  showFace,
  onShowFaceChange,
  isRequired = false,
}: GenerationSettingsModalProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  
  // Translated options
  const genderOptionsTranslated = [
    { value: 'women', label: t.gender.women },
    { value: 'men', label: t.gender.men },
  ];

  const jewelryOptionsTranslated = [
    { value: 'ring', label: t.jewelry.ring },
    { value: 'necklace', label: t.jewelry.necklace },
    { value: 'bracelet', label: t.jewelry.bracelet },
    { value: 'earring', label: t.jewelry.earring },
  ];

  const faceOptionsTranslated = [
    { value: 'show', label: t.settingsModal.showFace, icon: Eye, description: t.settingsModal.showFaceDesc },
    { value: 'hide', label: t.settingsModal.hideFace, icon: EyeOff, description: t.settingsModal.hideFaceDesc },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset validation error when settings change
  useEffect(() => {
    if (showValidationError && areSettingsComplete({ gender, jewelryType, aspectRatio })) {
      setShowValidationError(false);
    }
  }, [gender, jewelryType, aspectRatio, showValidationError]);

  const handleClose = () => {
    // If required and settings incomplete, show validation error
    if (isRequired && !areSettingsComplete({ gender, jewelryType, aspectRatio })) {
      setShowValidationError(true);
      return;
    }
    
    setShowValidationError(false);
    onClose();
  };

  const handleDone = () => {
    // Validate before closing
    if (!areSettingsComplete({ gender, jewelryType, aspectRatio })) {
      setShowValidationError(true);
      return;
    }

    // Save to localStorage
    if (gender && jewelryType) {
      saveGenerationSettings({
        gender,
        jewelryType,
        aspectRatio,
        showFace,
        applyToAll,
        timestamp: Date.now(),
      });
    }

    // Call onSave callback
    if (onSave) {
      onSave(applyToAll);
    }

    setShowValidationError(false);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-[201] w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform px-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="relative rounded-2xl border border-white/10 bg-[rgba(10,10,10,0.95)] p-5 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
                <Settings className="h-4 w-4 text-white/70" />
              </div>
              <h2
                id="settings-modal-title"
                className="text-base font-semibold text-white"
              >
                {t.settingsModal.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close settings"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Gender Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">
                {t.settingsModal.gender}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {genderOptionsTranslated.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onGenderChange(option.value as Gender)}
                    className={`rounded-md border px-3 py-2 text-xs font-medium transition-all ${
                      gender === option.value
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Face Visibility Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">
                {t.settingsModal.faceVisibility}
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {faceOptionsTranslated.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => onShowFaceChange(option.value as FaceVisibility)}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition-all ${
                        showFace === option.value
                          ? 'border-white/40 bg-white/10 text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                      }`}
                      title={option.description}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-[10px] text-white/40">
                {showFace === 'hide' ? 'Face will be cropped out, focusing on jewelry area' : 'Full model with face visible in frame'}
              </p>
            </div>

            {/* Jewelry Type Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">
                {t.settingsModal.jewelryType}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {jewelryOptionsTranslated.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onJewelryChange(option.value as JewelryType)}
                    className={`rounded-md border px-2 py-2 text-xs font-medium capitalize transition-all ${
                      jewelryType === option.value
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selection */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">
                {t.settingsModal.aspectRatio}
              </label>
              <div className="space-y-1.5">
                {/* Vertical Formats Row */}
                <div className="grid grid-cols-4 gap-1.5">
                  {verticalRatios.map((option) => {
                    const maxHeight = 28;
                    const width = maxHeight * option.ratio;
                    const height = maxHeight;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => onAspectRatioChange(option.value)}
                        className={`group relative flex flex-col items-center gap-1.5 rounded-md border px-1.5 py-2 transition-all ${
                          aspectRatio === option.value
                            ? 'border-white/40 bg-white/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                        }`}
                        title={option.description}
                      >
                        <div className="flex h-7 w-full items-center justify-center">
                          <div
                            className={`rounded-sm border ${
                              aspectRatio === option.value
                                ? 'border-white/60'
                                : 'border-white/40 group-hover:border-white/60'
                            }`}
                            style={{
                              width: `${width}px`,
                              height: `${height}px`,
                            }}
                          />
                        </div>
                        <div className="text-[10px] font-medium">{option.label}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Horizontal Formats Row */}
                <div className="grid grid-cols-4 gap-1.5">
                  {horizontalRatios.map((option) => {
                    const maxHeight = 28;
                    const width = option.ratio >= 1 ? maxHeight * option.ratio : maxHeight;
                    const height = option.ratio >= 1 ? maxHeight : maxHeight / option.ratio;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => onAspectRatioChange(option.value)}
                        className={`group relative flex flex-col items-center gap-1.5 rounded-md border px-1.5 py-2 transition-all ${
                          aspectRatio === option.value
                            ? 'border-white/40 bg-white/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                        }`}
                        title={option.description}
                      >
                        <div className="flex h-7 w-full items-center justify-center">
                          <div
                            className={`rounded-sm border ${
                              aspectRatio === option.value
                                ? 'border-white/60'
                                : 'border-white/40 group-hover:border-white/60'
                            }`}
                            style={{
                              width: `${Math.min(width, 42)}px`,
                              height: `${Math.min(height, 28)}px`,
                            }}
                          />
                        </div>
                        <div className="text-[10px] font-medium">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Validation Error */}
          {showValidationError && (
            <div className="mt-3 flex items-start gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-2.5">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
              <div className="flex-1">
                <p className="text-xs font-medium text-red-400">
                  {t.settingsModal.requiredWarning}
                </p>
              </div>
            </div>
          )}

          {/* Apply to All Checkbox */}
          <div className="mt-3">
            <label className="flex items-start gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
                className="mt-0.5 h-3.5 w-3.5 rounded border-white/20 bg-white/5 text-white/80 focus:ring-2 focus:ring-white/30 focus:ring-offset-0"
              />
              <div className="flex-1">
                <span className="text-xs font-medium text-white group-hover:text-white/80 transition-colors">
                  {t.settingsModal.applyToAll}
                </span>
              </div>
            </label>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-end gap-1.5">
            {!isRequired && (
              <button
                onClick={handleClose}
                className="rounded-md border border-white/10 px-4 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/5"
              >
                {t.common.cancel}
              </button>
            )}
            <button
              onClick={handleDone}
              className="rounded-md bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-white/15"
            >
              {t.settingsModal.saveSettings}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  // Render modal to document body using portal
  return createPortal(modalContent, document.body);
}

export default GenerationSettingsModal;


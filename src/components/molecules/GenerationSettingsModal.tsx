/**
 * Generation Settings Modal
 * 
 * Modal for configuring generation parameters (gender, jewelry type, aspect ratio)
 * These settings don't change frequently, so they're hidden in a modal to save space
 */

'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings, AlertCircle } from 'lucide-react';
import { saveGenerationSettings, areSettingsComplete } from '@/lib/generation-settings-storage';

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
  isRequired = false,
}: GenerationSettingsModalProps) {
  const [mounted, setMounted] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);

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
        <div className="relative rounded-2xl border border-white/10 bg-[rgba(10,10,10,0.95)] p-6 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
                <Settings className="h-5 w-5 text-white/70" />
              </div>
              <h2
                id="settings-modal-title"
                className="text-lg font-semibold text-white"
              >
                Generation Settings
              </h2>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close settings"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Gender Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                {genderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onGenderChange(option.value as Gender)}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
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

            {/* Jewelry Type Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Jewelry Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {jewelryOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onJewelryChange(option.value as JewelryType)}
                    className={`rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-all ${
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
              <label className="mb-2 block text-sm font-medium text-white/80">
                Aspect Ratio
              </label>
              <div className="space-y-2">
                {/* Vertical Formats Row */}
                <div className="grid grid-cols-4 gap-2">
                  {verticalRatios.map((option) => {
                    const maxHeight = 32;
                    const width = maxHeight * option.ratio;
                    const height = maxHeight;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => onAspectRatioChange(option.value)}
                        className={`group relative flex flex-col items-center gap-2 rounded-lg border px-2 py-3 transition-all ${
                          aspectRatio === option.value
                            ? 'border-white/40 bg-white/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                        }`}
                        title={option.description}
                      >
                        <div className="flex h-8 w-full items-center justify-center">
                          <div
                            className={`rounded border ${
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
                        <div className="text-xs font-medium">{option.label}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Horizontal Formats Row */}
                <div className="grid grid-cols-4 gap-2">
                  {horizontalRatios.map((option) => {
                    const maxHeight = 32;
                    const width = option.ratio >= 1 ? maxHeight * option.ratio : maxHeight;
                    const height = option.ratio >= 1 ? maxHeight : maxHeight / option.ratio;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => onAspectRatioChange(option.value)}
                        className={`group relative flex flex-col items-center gap-2 rounded-lg border px-2 py-3 transition-all ${
                          aspectRatio === option.value
                            ? 'border-white/40 bg-white/10 text-white'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                        }`}
                        title={option.description}
                      >
                        <div className="flex h-8 w-full items-center justify-center">
                          <div
                            className={`rounded border ${
                              aspectRatio === option.value
                                ? 'border-white/60'
                                : 'border-white/40 group-hover:border-white/60'
                            }`}
                            style={{
                              width: `${Math.min(width, 48)}px`,
                              height: `${Math.min(height, 32)}px`,
                            }}
                          />
                        </div>
                        <div className="text-xs font-medium">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Validation Error */}
          {showValidationError && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-400">
                  Required Settings Missing
                </p>
                <p className="mt-1 text-xs text-red-400/80">
                  Please select Gender, Jewelry Type, and Aspect Ratio to continue.
                  These settings help AI generate better results.
                </p>
              </div>
            </div>
          )}

          {/* Apply to All Checkbox */}
          <div className="mt-4">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={applyToAll}
                onChange={(e) => setApplyToAll(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 text-white/80 focus:ring-2 focus:ring-white/30 focus:ring-offset-0"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-white group-hover:text-white/80 transition-colors">
                  Remember for all uploads
                </span>
                <p className="mt-0.5 text-xs text-white/60">
                  Use these settings automatically for future images
                </p>
              </div>
            </label>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end gap-2">
            {!isRequired && (
              <button
                onClick={handleClose}
                className="rounded-lg border border-white/10 px-6 py-2.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/5"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleDone}
              className="rounded-lg bg-white/10 border border-white/20 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              {isRequired ? 'Continue' : 'Done'}
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


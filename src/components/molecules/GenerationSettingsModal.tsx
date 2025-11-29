/**
 * Generation Settings Modal
 * 
 * Modal for configuring generation parameters (gender, jewelry type, aspect ratio)
 * These settings don't change frequently, so they're hidden in a modal to save space
 */

'use client';

import React from 'react';
import { X, Settings } from 'lucide-react';

type Gender = 'women' | 'men' | null;
type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | null;

interface GenerationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  
  // Gender
  gender: Gender;
  onGenderChange: (value: Gender) => void;
  
  // Jewelry Type
  jewelryType: JewelryType;
  onJewelryChange: (value: JewelryType) => void;
  
  // Aspect Ratio
  aspectRatio: string;
  onAspectRatioChange: (value: string) => void;
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

export function GenerationSettingsModal({
  isOpen,
  onClose,
  gender,
  onGenderChange,
  jewelryType,
  onJewelryChange,
  aspectRatio,
  onAspectRatioChange,
}: GenerationSettingsModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-[201] w-full max-w-md -translate-x-1/2 -translate-y-1/2 transform"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        <div className="relative rounded-2xl border border-white/10 bg-[rgba(10,10,10,0.95)] p-6 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Settings className="h-5 w-5 text-purple-400" />
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
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
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
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
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
              <div className="grid grid-cols-4 gap-2">
                {aspectRatioOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => onAspectRatioChange(option.value)}
                    className={`group relative rounded-lg border px-2 py-3 text-center transition-all ${
                      aspectRatio === option.value
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                    }`}
                    title={option.description}
                  >
                    <div className="text-xs font-medium">{option.label}</div>
                    <div className="mt-0.5 text-[10px] text-white/40 group-hover:text-white/60">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default GenerationSettingsModal;


/**
 * Generation Settings Modal
 * 
 * Modal for configuring generation parameters (gender, jewelry type, aspect ratio)
 * These settings don't change frequently, so they're hidden in a modal to save space
 */

'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Settings, User, Users, Circle, Square } from 'lucide-react';

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
  { value: 'women', label: 'Women', icon: User },
  { value: 'men', label: 'Men', icon: Users },
];

const jewelryOptions = [
  { value: 'ring', label: 'Ring', icon: Circle },
  { value: 'necklace', label: 'Necklace', icon: Circle },
  { value: 'bracelet', label: 'Bracelet', icon: Circle },
  { value: 'earring', label: 'Earring', icon: Circle },
];

const aspectRatioOptions = [
  { value: '1:1', label: '1:1', description: 'Square', ratio: 1 },
  { value: '4:5', label: '4:5', description: 'Portrait', ratio: 0.8 },
  { value: '3:4', label: '3:4', description: 'Classic', ratio: 0.75 },
  { value: '2:3', label: '2:3', description: 'Standard', ratio: 0.667 },
  { value: '9:16', label: '9:16', description: 'Story', ratio: 0.5625 },
  { value: '16:9', label: '16:9', description: 'Landscape', ratio: 1.778 },
  { value: '21:9', label: '21:9', description: 'Ultrawide', ratio: 2.333 },
  { value: '4:3', label: '4:3', description: 'Classic', ratio: 1.333 },
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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
                {genderOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => onGenderChange(option.value as Gender)}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                        gender === option.value
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Jewelry Type Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Jewelry Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {jewelryOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => onJewelryChange(option.value as JewelryType)}
                      className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium capitalize transition-all ${
                        jewelryType === option.value
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aspect Ratio Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-4 gap-2">
                {aspectRatioOptions.map((option) => {
                  // Calculate frame dimensions (max height 32px)
                  const maxHeight = 32;
                  const width = option.ratio >= 1 
                    ? maxHeight * option.ratio 
                    : maxHeight;
                  const height = option.ratio >= 1 
                    ? maxHeight 
                    : maxHeight / option.ratio;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => onAspectRatioChange(option.value)}
                      className={`group relative flex flex-col items-center gap-2 rounded-lg border px-2 py-3 transition-all ${
                        aspectRatio === option.value
                          ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/5 hover:text-white'
                      }`}
                      title={option.description}
                    >
                      {/* Visual Frame */}
                      <div className="flex h-8 w-full items-center justify-center">
                        <div
                          className={`rounded border ${
                            aspectRatio === option.value
                              ? 'border-purple-400'
                              : 'border-white/40 group-hover:border-white/60'
                          }`}
                          style={{
                            width: `${Math.min(width, 40)}px`,
                            height: `${Math.min(height, 32)}px`,
                          }}
                        />
                      </div>
                      {/* Label */}
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  );
                })}
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

  // Render modal to document body using portal
  return createPortal(modalContent, document.body);
}

export default GenerationSettingsModal;


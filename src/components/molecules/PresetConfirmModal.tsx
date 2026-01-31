import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Settings, Image as ImageIcon } from 'lucide-react';

interface PresetConfirmModalProps {
  presetName: string;
  jewelryType: string | null;
  requiresModel?: boolean;
  gender?: string;
  aspectRatio?: string;
  imageUrl?: string; // Canvas image preview
  onConfirm: (jewelryType?: string) => void;
  onCancel: () => void;
}

/**
 * PresetConfirmModal - Generation Settings confirmation before AI generation
 * Shows summary of selected preset and allows last-minute changes
 */
export function PresetConfirmModal({
  presetName,
  jewelryType: initialJewelryType,
  requiresModel,
  gender,
  aspectRatio = '1:1',
  imageUrl,
  onConfirm,
  onCancel,
}: PresetConfirmModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedJewelryType, setSelectedJewelryType] = useState<string | null>(
    initialJewelryType
  );

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onCancel();
    }, 150);
  };

  const handleConfirm = () => {
    if (!selectedJewelryType) return;
    setIsClosing(true);
    setTimeout(() => {
      onConfirm(selectedJewelryType);
    }, 150);
  };

  const jewelryOptions = [
    { value: 'ring', label: 'Ring', emoji: '💍' },
    { value: 'necklace', label: 'Necklace', emoji: '📿' },
    { value: 'bracelet', label: 'Bracelet', emoji: '⌚' },
    { value: 'earring', label: 'Earring', emoji: '✨' },
  ];

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 transition-opacity duration-150 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-[#151515] shadow-2xl transition-all duration-150 ${
          isClosing
            ? 'translate-y-2 scale-95 opacity-0'
            : 'translate-y-0 scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-white/60" />
            <h3 className="text-sm font-medium text-white">Generation Settings</h3>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-4">
          {/* Image Preview + Preset Summary */}
          <div className="rounded-xl bg-white/5 p-4">
            <div className="flex items-start gap-4">
              {/* Canvas Image Thumbnail */}
              {imageUrl ? (
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10">
                  <img 
                    src={imageUrl} 
                    alt="Source" 
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5">
                  <ImageIcon className="h-8 w-8 text-white/20" />
                </div>
              )}
              
              {/* Preset Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/50 mb-0.5">Selected Preset</p>
                <p className="text-sm font-medium text-white truncate">{presetName}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white/50">
                  <span className="rounded bg-white/10 px-2 py-0.5">{aspectRatio}</span>
                  {requiresModel && <span className="rounded bg-white/10 px-2 py-0.5">{gender || 'Model'}</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Jewelry Type Selection */}
          <div>
            <label className="mb-2 flex items-center gap-2 text-xs font-medium text-white/70">
              <Sparkles className="h-3 w-3" />
              Jewelry Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {jewelryOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedJewelryType(option.value)}
                  className={`rounded-lg border p-3 text-center transition-all ${
                    selectedJewelryType === option.value
                      ? 'border-white/40 bg-white/10'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/5'
                  }`}
                >
                  <span className="block text-lg mb-1">{option.emoji}</span>
                  <span className={`text-[10px] font-medium ${
                    selectedJewelryType === option.value ? 'text-white' : 'text-white/60'
                  }`}>
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <p className="text-[11px] text-white/40 text-center">
            Generation takes 10-30 seconds • Uses 1 credit
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-white/10 px-5 py-4">
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedJewelryType}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
              selectedJewelryType
                ? 'bg-white text-black hover:bg-white/90'
                : 'cursor-not-allowed bg-white/20 text-white/40'
            }`}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}

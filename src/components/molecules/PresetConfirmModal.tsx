import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface PresetConfirmModalProps {
  presetName: string;
  jewelryType: string;
  requiresModel?: boolean;
  gender?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * PresetConfirmModal - Confirmation dialog before AI generation
 * Renders as full-screen overlay using React Portal
 */
export function PresetConfirmModal({
  presetName,
  jewelryType,
  requiresModel,
  gender,
  onConfirm,
  onCancel,
}: PresetConfirmModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    // Set mounted flag asynchronously to avoid cascading renders
    const timer = setTimeout(() => setMounted(true), 0);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timer);
    };
  }, []);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete before calling onCancel
    setTimeout(() => {
      onCancel();
    }, 200); // Match animation duration
  };

  // Handle confirm with animation
  const handleConfirm = () => {
    setIsClosing(true);
    setTimeout(() => {
      onConfirm();
    }, 200);
  };

  const description = requiresModel
    ? `This will generate a luxury editorial style ${jewelryType} photo featuring a ${gender?.toLowerCase() || 'model'}. The process may take 15-30 seconds.`
    : `This will generate a professional ${jewelryType} photo using AI. The process may take 10-30 seconds.`;

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-in-out ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-sm rounded-xl border border-purple-500/20 bg-[rgba(17,17,17,0.95)] p-5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-200 ease-in-out ${
          isClosing
            ? 'translate-y-2 scale-95 opacity-0'
            : 'translate-y-0 scale-100 opacity-100'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-white/40 transition-colors duration-200 hover:bg-white/10 hover:text-white/80"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Title */}
        <h3 className="mb-2 pr-6 text-base font-semibold text-white">
          Generate with {presetName}?
        </h3>

        {/* Description */}
        <p className="mb-5 text-xs leading-relaxed text-white/60">
          {description}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleClose}
            className="flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/80 transition-all duration-200 hover:bg-white/[0.05]"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white transition-all duration-200 hover:bg-purple-500"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );

  // Only render portal on client-side
  if (!mounted) return null;

  return createPortal(modalContent, document.body);
}

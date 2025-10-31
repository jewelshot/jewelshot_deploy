import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface ImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { jewelryType: string; modelType: string }) => void;
}

/**
 * ImageAnalysisModal - Minimal popup to analyze uploaded image
 * Asks user about jewelry type and model presence
 */
export function ImageAnalysisModal({
  isOpen,
  onClose,
  onComplete,
}: ImageAnalysisModalProps) {
  const [jewelryType, setJewelryType] = useState<string | null>(null);
  const [modelType, setModelType] = useState<string | null>(null);

  const jewelryTypes = [
    { id: 'ring', label: 'Ring' },
    { id: 'necklace', label: 'Necklace' },
    { id: 'earring', label: 'Earring' },
    { id: 'bracelet', label: 'Bracelet' },
  ];

  const modelTypes = [
    { id: 'female', label: 'Female' },
    { id: 'male', label: 'Male' },
  ];

  const handleContinue = () => {
    if (jewelryType && modelType) {
      onComplete({ jewelryType, modelType });
      // Reset selections
      setJewelryType(null);
      setModelType(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        style={{
          animation: 'fadeIn 200ms ease-out',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-[60] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4"
        style={{
          animation: 'scaleIn 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(10,10,10,0.95)] p-6 shadow-2xl backdrop-blur-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-6 text-center">
              <div className="mb-3 inline-flex rounded-xl bg-purple-500/10 p-2.5">
                <Sparkles className="h-5 w-5 text-purple-400" />
              </div>
              <h2 className="mb-1.5 text-lg font-semibold text-white">
                Quick Setup
              </h2>
              <p className="text-xs text-white/50">
                Help us understand your image
              </p>
            </div>

            {/* Jewelry Type */}
            <div className="mb-4">
              <label className="mb-2 block text-xs font-medium text-white/70">
                Jewelry Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {jewelryTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setJewelryType(type.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 ${
                      jewelryType === type.id
                        ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                        : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-purple-500/30 hover:bg-white/[0.05]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Type */}
            <div className="mb-5">
              <label className="mb-2 block text-xs font-medium text-white/70">
                Model
              </label>
              <div className="grid grid-cols-2 gap-2">
                {modelTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setModelType(type.id)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 ${
                      modelType === type.id
                        ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                        : 'border-white/10 bg-white/[0.02] text-white/70 hover:border-purple-500/30 hover:bg-white/[0.05]'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!jewelryType || !modelType}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
}

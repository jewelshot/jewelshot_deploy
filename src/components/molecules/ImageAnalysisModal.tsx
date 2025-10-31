import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface ImageAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: { jewelryType: string; modelType: string }) => void;
}

/**
 * ImageAnalysisModal - Initial popup to analyze uploaded image
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
    { id: 'ring', label: 'Yüzük', icon: '💍' },
    { id: 'necklace', label: 'Kolye', icon: '📿' },
    { id: 'earring', label: 'Küpe', icon: '💎' },
    { id: 'bracelet', label: 'Bilezik', icon: '⌚' },
  ];

  const modelTypes = [
    { id: 'female', label: 'Kadın', icon: '👩' },
    { id: 'male', label: 'Erkek', icon: '👨' },
    { id: 'none', label: 'Yok', icon: '🚫' },
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
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        style={{
          animation: 'fadeIn 300ms ease-out',
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed left-1/2 top-1/2 z-[60] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4"
        style={{
          animation: 'scaleIn 400ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(10,10,10,0.95)] p-8 shadow-2xl backdrop-blur-2xl">
          {/* Background Glow */}
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex rounded-2xl bg-purple-500/20 p-4">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-white">
                Bu Görselde Neler Var?
              </h2>
              <p className="text-sm text-white/60">
                Daha iyi sonuçlar için birkaç soru cevaplayın
              </p>
            </div>

            {/* Jewelry Type */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-white/80">
                Takı Tipi
              </label>
              <div className="grid grid-cols-2 gap-3">
                {jewelryTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setJewelryType(type.id)}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                      jewelryType === type.id
                        ? 'border-purple-500/50 bg-purple-500/20'
                        : 'border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.05]'
                    } `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="text-sm font-medium text-white">
                        {type.label}
                      </span>
                    </div>
                    {jewelryType === type.id && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Type */}
            <div className="mb-8">
              <label className="mb-3 block text-sm font-medium text-white/80">
                Manken
              </label>
              <div className="grid grid-cols-3 gap-3">
                {modelTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setModelType(type.id)}
                    className={`group relative overflow-hidden rounded-xl border p-4 transition-all duration-300 ${
                      modelType === type.id
                        ? 'border-purple-500/50 bg-purple-500/20'
                        : 'border-white/10 bg-white/[0.02] hover:border-purple-500/30 hover:bg-white/[0.05]'
                    } `}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-2xl">{type.icon}</span>
                      <span className="text-xs font-medium text-white">
                        {type.label}
                      </span>
                    </div>
                    {modelType === type.id && (
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinue}
              disabled={!jewelryType || !modelType}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 font-medium text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
            >
              <span className="relative z-10">Devam Et</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-disabled:opacity-0" />
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
            transform: translate(-50%, -50%) scale(0.95);
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

'use client';

import React, { useState } from 'react';
import AIPromptInput from '@/components/atoms/AIPromptInput';
import AIGenerateButton from '@/components/atoms/AIGenerateButton';
import AIToggleButton from '@/components/atoms/AIToggleButton';
import { ConfirmationModal } from './ConfirmationModal';
import { validatePrompt } from '@/lib/validators';
import { toastManager } from '@/lib/toast-manager';

interface AIEditControlProps {
  currentImageUrl: string;
  onImageEdited: (editedImageUrl: string) => void;
  onError?: (error: Error) => void;
  isEditing?: boolean;
  progress?: string;
  visible?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
}

export function AIEditControl({
  currentImageUrl,
  isEditing = false,
  visible = true,
  onExpandedChange,
}: AIEditControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('auto');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Auto-collapse expanded area when AI starts processing
  const shouldShowExpanded = isExpanded && !isEditing;

  // Notify parent when expanded state changes
  React.useEffect(() => {
    onExpandedChange?.(shouldShowExpanded);
  }, [shouldShowExpanded, onExpandedChange]);

  const handleGenerateClick = () => {
    if (isEditing) return;

    const trimmedPrompt = prompt.trim();

    // Validate prompt if provided
    if (trimmedPrompt.length > 0) {
      const validation = validatePrompt(trimmedPrompt);
      if (!validation.valid) {
        toastManager.error(validation.error || 'Invalid prompt');
        return;
      }
    }

    // Show confirmation modal
    setShowConfirmModal(true);
  };

  const handleConfirmGenerate = () => {
    setShowConfirmModal(false);
    
    const event = new CustomEvent('ai-edit-generate', {
      detail: { 
        prompt: prompt.trim() || '', 
        imageUrl: currentImageUrl,
        aspectRatio: aspectRatio || 'auto',
      },
    });
    window.dispatchEvent(event);
  };

  if (!visible) return null;

  // Nano Banana supported aspect ratios (from official API guide)
  const aspectRatios = [
    { value: 'auto', label: 'Auto (Recommended)' },
    { value: '1:1', label: 'Square (1:1)' },
    { value: '16:9', label: 'Landscape Wide (16:9)' },
    { value: '9:16', label: 'Portrait Tall (9:16)' },
    { value: '21:9', label: 'Ultrawide (21:9)' },
    { value: '4:3', label: 'Standard (4:3)' },
    { value: '3:4', label: 'Portrait (3:4)' },
    { value: '3:2', label: 'Classic (3:2)' },
    { value: '2:3', label: 'Portrait Classic (2:3)' },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Expanded Prompt Area - Compact */}
      <div
        className={`w-full max-w-md origin-bottom transition-all duration-300 ease-out ${
          shouldShowExpanded
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
      >
        <div className="space-y-2 rounded-lg border border-white/10 bg-[#0f0f0f] p-2 shadow-xl">
          {/* Aspect Ratio Selector - Inline */}
          <div className="flex items-center gap-2">
            <label className="text-[10px] text-white/50 whitespace-nowrap">
              Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="flex-1 rounded-md border border-white/10 bg-[#1a1a1a] px-2 py-1 text-xs text-white focus:border-white/30 focus:outline-none"
              disabled={isEditing}
            >
              {aspectRatios.map((ratio) => (
                <option key={ratio.value} value={ratio.value} className="bg-[#1a1a1a] text-white">
                  {ratio.label}
                </option>
              ))}
            </select>
          </div>

          {/* Prompt Input */}
          <AIPromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerateClick}
            disabled={isEditing}
          />
        </div>
      </div>

      {/* Main Control Bar - Compact */}
      <div className="group relative">
        <div className="relative flex items-center gap-1 rounded-md border border-white/10 bg-[rgba(10,10,10,0.9)] px-1.5 py-1 backdrop-blur-xl">
          {/* Toggle Button */}
          <AIToggleButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isEditing}
          />

          {/* Divider */}
          <div className="h-4 w-px bg-white/10" />

          {/* Generate Button */}
          <AIGenerateButton
            onClick={handleGenerateClick}
            disabled={isEditing}
            loading={isEditing}
          />
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmGenerate}
        title="Generate AI Image"
        description="This will use 1 credit to generate a new image with AI."
        details={[
          { label: 'Prompt', value: prompt.trim() || '(No prompt - default enhancement)' },
          { label: 'Aspect Ratio', value: aspectRatios.find(r => r.value === aspectRatio)?.label || aspectRatio },
        ]}
        confirmText="Generate"
        cancelText="Cancel"
        variant="ai"
      />

      {/* Keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideRight {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default AIEditControl;

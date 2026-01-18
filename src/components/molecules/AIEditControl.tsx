'use client';

import React, { useState } from 'react';
import AIPromptInput from '@/components/atoms/AIPromptInput';
import AIGenerateButton from '@/components/atoms/AIGenerateButton';
import AIToggleButton from '@/components/atoms/AIToggleButton';
import QuickPromptButton from '@/components/atoms/QuickPromptButton';
import { validatePrompt } from '@/lib/validators';
import { toastManager } from '@/lib/toast-manager';
import jewelryPrompts from '@/data/jewelryPrompts.json';

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
  const [aspectRatio, setAspectRatio] = useState('auto'); // Default to 'auto' (Nano Banana recommended)

  // Auto-collapse expanded area when AI starts processing
  const shouldShowExpanded = isExpanded && !isEditing;

  // Notify parent when expanded state changes
  React.useEffect(() => {
    onExpandedChange?.(shouldShowExpanded);
  }, [shouldShowExpanded, onExpandedChange]);

  const handleGenerate = () => {
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

    const event = new CustomEvent('ai-edit-generate', {
      detail: { 
        prompt: trimmedPrompt || '', 
        imageUrl: currentImageUrl,
        aspectRatio: aspectRatio || 'auto', // Include aspect ratio
      },
    });
    window.dispatchEvent(event);
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isEditing) return;

    // Directly trigger generation without showing prompt in textarea
    const event = new CustomEvent('ai-edit-generate', {
      detail: { 
        prompt: promptText, 
        imageUrl: currentImageUrl,
        aspectRatio: aspectRatio || 'auto', // Include aspect ratio
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
      {/* Expanded Prompt Area */}
      <div
        className={`w-full max-w-xl origin-bottom transition-all duration-300 ease-out ${
          shouldShowExpanded
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        }`}
      >
        {/* Scrollable container with max-height and solid background */}
        <div className="max-h-[400px] space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-[#0f0f0f] p-3 shadow-xl">
          {/* Aspect Ratio Selector */}
          <div className="w-full">
            <label className="mb-1 block text-xs text-white/60">
              Aspect Ratio
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-[#1a1a1a] px-4 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
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
            onSubmit={handleGenerate}
            disabled={isEditing}
          />

          {/* Quick Prompt Buttons */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {jewelryPrompts.map((item) => (
              <QuickPromptButton
                key={item.id}
                label={item.label}
                icon={item.icon as 'sparkles' | 'square' | 'zap' | 'gem'}
                onClick={() => handleQuickPrompt(item.prompt)}
                disabled={isEditing}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Control Bar */}
      <div className="group relative">
        {/* Dark backdrop layer */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-black/50 backdrop-blur-2xl" />

        {/* Main container */}
        <div className="relative flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.85)] px-2 py-1.5 backdrop-blur-2xl transition-all duration-200 hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(10,10,10,0.95)]">
          {/* Toggle Button */}
          <AIToggleButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isEditing}
          />

          {/* Divider */}
          <div className="h-5 w-px bg-[rgba(139,92,246,0.3)]" />

          {/* Rate Limit Badge - Moved to Bottom Bar */}

          {/* Generate Button */}
          <AIGenerateButton
            onClick={handleGenerate}
            disabled={isEditing}
            loading={isEditing}
          />
        </div>
      </div>

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

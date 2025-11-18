'use client';

import React, { useState } from 'react';
import AIPromptInput from '@/components/atoms/AIPromptInput';
import AIGenerateButton from '@/components/atoms/AIGenerateButton';
import AIToggleButton from '@/components/atoms/AIToggleButton';
import QuickPromptButton from '@/components/atoms/QuickPromptButton';
import { validatePrompt } from '@/lib/validators';
import { toastManager } from '@/lib/toast-manager';
import jewelryPrompts from '@/data/jewelryPrompts.json';

interface BatchPromptControlProps {
  onGenerate: (prompt: string) => void;
  isProcessing?: boolean;
  visible?: boolean;
  imageCount?: number;
}

export function BatchPromptControl({
  onGenerate,
  isProcessing = false,
  visible = true,
  imageCount = 0,
}: BatchPromptControlProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [prompt, setPrompt] = useState('');

  // Auto-collapse when processing starts
  const shouldShowExpanded = isExpanded && !isProcessing;

  const handleGenerate = () => {
    if (isProcessing || imageCount === 0) {
      if (imageCount === 0) {
        toastManager.error('Please upload images first');
      }
      return;
    }

    const trimmedPrompt = prompt.trim();

    // Validate prompt if provided
    if (trimmedPrompt.length > 0) {
      const validation = validatePrompt(trimmedPrompt);
      if (!validation.valid) {
        toastManager.error(validation.error || 'Invalid prompt');
        return;
      }
    }

    onGenerate(trimmedPrompt || '');
  };

  const handleQuickPrompt = (promptText: string) => {
    if (isProcessing || imageCount === 0) return;
    onGenerate(promptText);
  };

  if (!visible) return null;

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
        {/* Scrollable container */}
        <div className="max-h-[400px] space-y-2 overflow-y-auto">
          {/* Prompt Input */}
          <AIPromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleGenerate}
            disabled={isProcessing}
          />

          {/* Quick Prompt Buttons */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {jewelryPrompts.map((item) => (
              <QuickPromptButton
                key={item.id}
                label={item.label}
                icon={item.icon as 'sparkles' | 'square' | 'zap' | 'gem'}
                onClick={() => handleQuickPrompt(item.prompt)}
                disabled={isProcessing}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Control Bar */}
      <div className="group relative">
        {/* Dark backdrop */}
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-lg bg-black/50 backdrop-blur-2xl" />

        {/* Main container */}
        <div className="relative flex items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.3)] bg-[rgba(10,10,10,0.85)] px-2 py-1.5 backdrop-blur-2xl transition-all duration-200 hover:border-[rgba(139,92,246,0.4)] hover:bg-[rgba(10,10,10,0.95)]">
          {/* Toggle Button */}
          <AIToggleButton
            isExpanded={isExpanded}
            onClick={() => setIsExpanded(!isExpanded)}
            disabled={isProcessing}
          />

          {/* Divider */}
          <div className="h-5 w-px bg-[rgba(139,92,246,0.3)]" />

          {/* Image Count Badge */}
          {imageCount > 0 && (
            <>
              <div className="flex items-center gap-1.5 px-2">
                <span className="text-xs text-white/60">{imageCount} images</span>
              </div>
              <div className="h-5 w-px bg-[rgba(139,92,246,0.3)]" />
            </>
          )}

          {/* Generate Button */}
          <AIGenerateButton
            onClick={handleGenerate}
            disabled={isProcessing || imageCount === 0}
            loading={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}


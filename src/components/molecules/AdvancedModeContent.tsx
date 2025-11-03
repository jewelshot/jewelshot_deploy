'use client';

import { useState } from 'react';
import { ParameterGroup } from '@/components/molecules/ParameterGroup';
import {
  environmentGroup,
  moodStyleGroup,
  lightingGroup,
  cameraGroup,
  colorGroup,
  customGroup,
  getModelGroup,
  getBodyPartGroup,
  buildAdvancedPrompt,
} from '@/lib/advanced-parameters';

interface AdvancedModeContentProps {
  gender: 'women' | 'men' | null;
  jewelryType: string | null;
  aspectRatio: string;
  onGenerate?: (prompt: string) => void;
}

export function AdvancedModeContent({
  gender,
  jewelryType,
  aspectRatio,
  onGenerate,
}: AdvancedModeContentProps) {
  // State for all parameter selections
  const [selections, setSelections] = useState<Record<string, string | number>>(
    {}
  );

  // Handle parameter change
  const handleChange = (paramId: string, value: string | number) => {
    setSelections((prev) => ({ ...prev, [paramId]: value }));
  };

  // Handle generation
  const handleGenerate = () => {
    if (!gender || !jewelryType) return;

    try {
      const prompt = buildAdvancedPrompt(
        jewelryType,
        gender,
        selections,
        aspectRatio
      );
      if (onGenerate) {
        onGenerate(prompt);
      }
    } catch (error) {
      console.error('Error building advanced prompt:', error);
    }
  };

  // Get visible groups
  const modelGroup = getModelGroup(gender);
  const bodyPartGroup = getBodyPartGroup(jewelryType);

  // Check if generate is enabled
  const canGenerate = gender && jewelryType;

  return (
    <div className="flex flex-col gap-2.5">
      {/* Custom Prompt Section - Always on top */}
      <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-2.5">
        <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-wide text-purple-300/80">
          ✍️ Custom Prompt (Optional)
        </label>
        <textarea
          value={(selections['custom-prompt'] as string) || ''}
          onChange={(e) => handleChange('custom-prompt', e.target.value)}
          placeholder="Describe your vision in detail... (Leave empty for default)"
          rows={3}
          className="w-full rounded border border-white/10 bg-white/[0.02] px-2 py-1.5 text-[9px] text-white/90 transition-colors placeholder:text-white/30 hover:border-white/20 focus:border-purple-500/50 focus:outline-none"
        />
      </div>

      {/* Environment Group */}
      <ParameterGroup
        group={environmentGroup}
        selections={selections}
        onChange={handleChange}
      />

      {/* Mood & Style Group */}
      <ParameterGroup
        group={moodStyleGroup}
        selections={selections}
        onChange={handleChange}
      />

      {/* Lighting Group */}
      <ParameterGroup
        group={lightingGroup}
        selections={selections}
        onChange={handleChange}
      />

      {/* Camera Group */}
      <ParameterGroup
        group={cameraGroup}
        selections={selections}
        onChange={handleChange}
      />

      {/* Color Group */}
      <ParameterGroup
        group={colorGroup}
        selections={selections}
        onChange={handleChange}
      />

      {/* Model Group - Gender specific */}
      {modelGroup && (
        <ParameterGroup
          group={modelGroup}
          selections={selections}
          onChange={handleChange}
        />
      )}

      {/* Body Part Group - Jewelry specific */}
      {bodyPartGroup && (
        <ParameterGroup
          group={bodyPartGroup}
          selections={selections}
          onChange={handleChange}
        />
      )}

      {/* Negative Prompt Section */}
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2.5">
        <label className="mb-1.5 block text-[8px] font-medium uppercase tracking-wide text-red-300/80">
          🚫 Negative Prompt (What to avoid)
        </label>
        <textarea
          value={(selections['negative-prompt'] as string) || ''}
          onChange={(e) => handleChange('negative-prompt', e.target.value)}
          placeholder="blur, distortion, bad quality..."
          rows={2}
          className="w-full rounded border border-white/10 bg-white/[0.02] px-2 py-1.5 text-[9px] text-white/90 transition-colors placeholder:text-white/30 hover:border-white/20 focus:border-red-500/50 focus:outline-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        className={`mt-1 rounded-lg border py-3 text-[11px] font-semibold transition-all duration-300 ${
          canGenerate
            ? 'border-purple-500/50 bg-purple-500/20 text-purple-300 hover:border-purple-500/70 hover:bg-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
            : 'cursor-not-allowed border-white/5 bg-white/[0.02] text-white/30'
        }`}
      >
        {canGenerate
          ? '🎬 Generate Advanced Image'
          : 'Select Gender & Jewelry Type'}
      </button>

      {/* Info Text */}
      {canGenerate && (
        <p className="text-center text-[8px] text-white/40">
          All parameters are optional. Leave empty for default values.
        </p>
      )}
    </div>
  );
}

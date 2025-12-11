'use client';

import { useState } from 'react';
import { SelectiveCard } from '@/components/atoms/SelectiveCard';
import {
  womenModels,
  menModels,
  locations,
  moods,
  lightingStyles,
  cameraAngles,
  poses,
  buildSelectivePrompt,
} from '@/lib/selective-options';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('SelectiveMode');

interface SelectiveModeContentProps {
  gender: 'women' | 'men' | null;
  jewelryType: string | null;
  aspectRatio: string;
  onGenerate?: (prompt: string) => void;
}

export function SelectiveModeContent({
  gender,
  jewelryType,
  aspectRatio,
  onGenerate,
}: SelectiveModeContentProps) {
  // Selection state
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedLighting, setSelectedLighting] = useState<string | null>(null);
  const [selectedAngle, setSelectedAngle] = useState<string | null>(null);
  const [selectedPose, setSelectedPose] = useState<string | null>(null);

  // Get model options based on gender
  const modelOptions = gender === 'women' ? womenModels : menModels;

  // Check if all selections are made
  const isComplete =
    selectedModel &&
    selectedLocation &&
    selectedMood &&
    selectedLighting &&
    selectedAngle &&
    selectedPose &&
    gender &&
    jewelryType;

  // Handle generation
  const handleGenerate = () => {
    if (!isComplete) return;

    try {
      const prompt = buildSelectivePrompt(
        jewelryType,
        gender,
        selectedModel,
        selectedLocation,
        selectedMood,
        selectedLighting,
        selectedAngle,
        selectedPose,
        aspectRatio
      );

      if (onGenerate) {
        onGenerate(prompt);
      }
    } catch (error) {
      logger.error('Error building selective prompt:', error);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Models Section */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[9px] font-medium uppercase tracking-wide text-white/60">
            Model
          </span>
          {selectedModel && (
            <span className="text-[8px] text-purple-400">✓ Selected</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {modelOptions.map((model) => (
            <SelectiveCard
              key={model.id}
              id={model.id}
              name={model.name}
              description={model.description}
              image={model.image}
              isSelected={selectedModel === model.id}
              onSelect={setSelectedModel}
            />
          ))}
        </div>
      </div>

      {/* Locations Section */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[9px] font-medium uppercase tracking-wide text-white/60">
            Location
          </span>
          {selectedLocation && (
            <span className="text-[8px] text-purple-400">✓ Selected</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {locations.map((location) => (
            <SelectiveCard
              key={location.id}
              id={location.id}
              name={location.name}
              description={location.description}
              image={location.image}
              isSelected={selectedLocation === location.id}
              onSelect={setSelectedLocation}
            />
          ))}
        </div>
      </div>

      {/* Moods Section */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[9px] font-medium uppercase tracking-wide text-white/60">
            Mood
          </span>
          {selectedMood && (
            <span className="text-[8px] text-purple-400">✓ Selected</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {moods.map((mood) => (
            <SelectiveCard
              key={mood.id}
              id={mood.id}
              name={mood.name}
              description={mood.description}
              image={mood.image}
              isSelected={selectedMood === mood.id}
              onSelect={setSelectedMood}
            />
          ))}
        </div>
      </div>

      {/* Lighting Section */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[9px] font-medium uppercase tracking-wide text-white/60">
            Lighting Style
          </span>
          {selectedLighting && (
            <span className="text-[8px] text-purple-400">✓ Selected</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {lightingStyles.map((lighting) => (
            <SelectiveCard
              key={lighting.id}
              id={lighting.id}
              name={lighting.name}
              description={lighting.description}
              image={lighting.image}
              isSelected={selectedLighting === lighting.id}
              onSelect={setSelectedLighting}
            />
          ))}
        </div>
      </div>

      {/* Camera Angle Section */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[9px] font-medium uppercase tracking-wide text-white/60">
            📐 Camera Angle
          </span>
          {selectedAngle && (
            <span className="text-[8px] text-purple-400">✓ Selected</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {cameraAngles.map((angle) => (
            <SelectiveCard
              key={angle.id}
              id={angle.id}
              name={angle.name}
              description={angle.description}
              image={angle.image}
              isSelected={selectedAngle === angle.id}
              onSelect={setSelectedAngle}
            />
          ))}
        </div>
      </div>

      {/* Pose Section */}
      <div>
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-[9px] font-medium uppercase tracking-wide text-white/60">
            🤲 Pose / Gesture
          </span>
          {selectedPose && (
            <span className="text-[8px] text-purple-400">✓ Selected</span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {poses.map((pose) => (
            <SelectiveCard
              key={pose.id}
              id={pose.id}
              name={pose.name}
              description={pose.description}
              image={pose.image}
              isSelected={selectedPose === pose.id}
              onSelect={setSelectedPose}
            />
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!isComplete}
        className={`mt-2 rounded-lg border py-2.5 text-[11px] font-semibold transition-all duration-300 ${
          isComplete
            ? 'border-purple-500/50 bg-purple-500/20 text-purple-300 hover:border-purple-500/70 hover:bg-purple-500/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
            : 'cursor-not-allowed border-white/5 bg-white/[0.02] text-white/30'
        }`}
      >
        {isComplete ? 'Generate Custom Style' : 'Select All Options'}
      </button>
    </div>
  );
}

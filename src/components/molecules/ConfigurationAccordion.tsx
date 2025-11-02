import React from 'react';
import { SelectionDropdown } from '@/components/atoms/SelectionDropdown';
import { ArrowLeft } from 'lucide-react';

interface ConfigurationAccordionProps {
  gender: string | null;
  jewelryType: string | null;
  onGenderChange: (value: string) => void;
  onJewelryChange: (value: string) => void;
  genderOptions: Array<{ value: string; label: string }>;
  jewelryOptions: Array<{ value: string; label: string }>;
}

/**
 * ConfigurationAccordion - Simple side-by-side dropdowns for gender/jewelry selection
 */
export function ConfigurationAccordion({
  gender,
  jewelryType,
  onGenderChange,
  onJewelryChange,
  genderOptions,
  jewelryOptions,
}: ConfigurationAccordionProps) {
  const isJewelryDisabled = !gender;

  const isComplete = gender && jewelryType;

  return (
    <div className="relative">
      {/* Overlay Tooltip */}
      {!isComplete && (
        <div className="pointer-events-none absolute -left-2 top-1/2 z-10 w-[200px] -translate-x-full -translate-y-1/2 animate-fadeInSlide">
          <div className="rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-2.5 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-[10px] font-medium leading-relaxed text-white/90">
                  <span className="block text-purple-300">Get Started:</span>
                  Please select model gender and product type
                </p>
              </div>
              <ArrowLeft className="h-4 w-4 flex-shrink-0 animate-pulse text-purple-400" />
            </div>
          </div>
        </div>
      )}

      <div
        className={`flex items-center gap-2 rounded-lg border p-2 transition-all duration-300 ${
          isComplete
            ? 'border-white/10 bg-white/[0.02]'
            : 'animate-glow-pulse border-purple-500/60 bg-white/[0.02]'
        }`}
      >
        {/* Gender Selection */}
        <div className="flex-1">
          <SelectionDropdown
            label=""
            placeholder="Gender"
            options={genderOptions}
            value={gender}
            onChange={onGenderChange}
          />
        </div>

        {/* Jewelry Type Selection */}
        <div className="flex-1">
          <SelectionDropdown
            label=""
            placeholder="Jewelry"
            options={jewelryOptions}
            value={jewelryType}
            onChange={onJewelryChange}
            disabled={isJewelryDisabled}
          />
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { SelectionDropdown } from '@/components/atoms/SelectionDropdown';
import { ArrowRight } from 'lucide-react';

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
  const [isVisible, setIsVisible] = useState(!gender);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  // Handle gender selection - trigger fade out
  useEffect(() => {
    if (gender && isVisible) {
      const timer = setTimeout(() => {
        setIsAnimatingOut(true);
      }, 0);
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setIsAnimatingOut(false);
      }, 300); // Match fade-out duration
      return () => {
        clearTimeout(timer);
        clearTimeout(hideTimer);
      };
    } else if (!gender && !isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [gender, isVisible]);

  return (
    <div className="relative">
      {/* Overlay Tooltip - Left Side */}
      {isVisible && (
        <div
          className={`pointer-events-none absolute -left-3 top-1/2 z-50 w-[220px] -translate-x-full -translate-y-1/2 ${
            isAnimatingOut ? 'animate-fade-out' : 'animate-fade-in'
          }`}
        >
          <div className="rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <p className="text-[11px] font-medium leading-relaxed text-white/90">
                  <span className="block text-purple-300">Get Started:</span>
                  Please select gender and jewelry type
                </p>
              </div>
              <div className="animate-bounce-horizontal">
                <ArrowRight className="h-5 w-5 flex-shrink-0 text-purple-400" />
              </div>
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

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Check } from 'lucide-react';
import { SelectionDropdown } from '@/components/atoms/SelectionDropdown';

interface ConfigurationAccordionProps {
  gender: string | null;
  jewelryType: string | null;
  onGenderChange: (value: string) => void;
  onJewelryChange: (value: string) => void;
  genderOptions: Array<{ value: string; label: string }>;
  jewelryOptions: Array<{ value: string; label: string }>;
}

/**
 * ConfigurationAccordion - Auto-collapsing accordion for gender/jewelry selection
 * Collapses automatically when both selections are complete
 */
export function ConfigurationAccordion({
  gender,
  jewelryType,
  onGenderChange,
  onJewelryChange,
  genderOptions,
  jewelryOptions,
}: ConfigurationAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Auto-collapse when both are selected
  useEffect(() => {
    if (gender && jewelryType && isExpanded) {
      // Wait 300ms before auto-collapse for smooth UX
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [gender, jewelryType, isExpanded]);

  const isComplete = gender && jewelryType;
  const isJewelryDisabled = !gender;

  // Get labels for collapsed view
  const genderLabel = genderOptions.find((opt) => opt.value === gender)?.label;
  const jewelryLabel = jewelryOptions.find(
    (opt) => opt.value === jewelryType
  )?.label;

  return (
    <div className="relative">
      {/* Accordion Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-left transition-all duration-200 ${
          isExpanded
            ? 'border-purple-500/30 bg-white/[0.03]'
            : isComplete
              ? 'border-white/10 bg-white/[0.02] hover:border-purple-500/20 hover:bg-white/[0.03]'
              : 'border-red-400/30 bg-red-400/5'
        }`}
      >
        <div className="flex items-center gap-1.5">
          {isExpanded ? (
            <ChevronDown className="h-3 w-3 text-white/60" />
          ) : (
            <ChevronRight className="h-3 w-3 text-white/60" />
          )}
          <span className="text-[10px] font-medium text-white/70">
            {isComplete
              ? `${genderLabel} • ${jewelryLabel}`
              : 'Select Gender & Jewelry'}
          </span>
        </div>
        {isComplete && !isExpanded && (
          <Check className="h-3 w-3 text-green-400" />
        )}
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isExpanded ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-2 pt-2">
          {/* Gender Selection */}
          <SelectionDropdown
            label="Gender"
            placeholder="Select..."
            options={genderOptions}
            value={gender}
            onChange={onGenderChange}
            required
            inline
          />

          {/* Jewelry Type Selection */}
          <SelectionDropdown
            label="Jewelry"
            placeholder="Select..."
            options={jewelryOptions}
            value={jewelryType}
            onChange={onJewelryChange}
            disabled={isJewelryDisabled}
            required
            inline
          />
        </div>
      </div>
    </div>
  );
}

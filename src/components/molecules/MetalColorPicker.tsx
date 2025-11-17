/**
 * MetalColorPicker Component
 *
 * Slide-out color selector for metal recoloring
 * Opens to the left of Quick Actions Bar
 */

'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { MetalType } from '@/hooks/useMetalRecolor';

interface MetalOption {
  type: MetalType;
  name: string;
  color: string;
  gradient: string;
}

const METAL_OPTIONS: MetalOption[] = [
  {
    type: '14k',
    name: '14K Gold',
    color: '#DAA520',
    gradient: 'linear-gradient(135deg, #DAA520 0%, #F4D03F 100%)',
  },
  {
    type: '18k',
    name: '18K Gold',
    color: '#FFD700',
    gradient: 'linear-gradient(135deg, #FFD700 0%, #FFF4A3 100%)',
  },
  {
    type: '22k',
    name: '22K Gold',
    color: '#FFCC00',
    gradient: 'linear-gradient(135deg, #FFCC00 0%, #FFE14D 100%)',
  },
  {
    type: 'rose',
    name: 'Rose Gold',
    color: '#B76E79',
    gradient: 'linear-gradient(135deg, #B76E79 0%, #D4A5B0 100%)',
  },
  {
    type: 'white',
    name: 'White Gold',
    color: '#E5E4E2',
    gradient: 'linear-gradient(135deg, #E5E4E2 0%, #F5F5F5 100%)',
  },
];

interface MetalColorPickerProps {
  isOpen: boolean;
  onSelect: (metalType: MetalType) => void;
  selectedMetal?: MetalType | null;
  disabled?: boolean;
}

export const MetalColorPicker: React.FC<MetalColorPickerProps> = ({
  isOpen,
  onSelect,
  selectedMetal,
  disabled = false,
}) => {
  return (
    <div
      className="fixed z-20 transition-all duration-300 ease-out"
      style={{
        right: '60px', // Left of Quick Actions Bar
        top: '90px',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'translateX(0)' : 'translateX(20px)',
        pointerEvents: isOpen ? 'auto' : 'none',
      }}
    >
      {/* Container */}
      <div className="flex flex-col gap-2 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.9)] p-2 backdrop-blur-[20px]">
        {/* Title */}
        <div className="px-2 py-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
            Metal Color
          </p>
        </div>

        {/* Metal Options */}
        <div className="flex flex-col gap-1.5">
          {METAL_OPTIONS.map((metal) => (
            <button
              key={metal.type}
              onClick={() => !disabled && onSelect(metal.type)}
              disabled={disabled}
              className={`group relative flex items-center gap-2 rounded-md border px-3 py-2 transition-all ${
                disabled
                  ? 'cursor-not-allowed border-white/10 bg-white/5'
                  : selectedMetal === metal.type
                    ? 'border-[rgba(139,92,246,0.4)] bg-[rgba(139,92,246,0.15)]'
                    : 'border-white/20 bg-white/5 hover:border-[rgba(139,92,246,0.3)] hover:bg-[rgba(139,92,246,0.1)]'
              }`}
              title={metal.name}
            >
              {/* Color Swatch */}
              <div
                className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-white/30 shadow-sm"
                style={{
                  background: metal.gradient,
                }}
              />

              {/* Metal Name */}
              <span
                className={`text-xs font-medium transition-colors ${
                  disabled
                    ? 'text-white/30'
                    : selectedMetal === metal.type
                      ? 'text-white'
                      : 'text-white/70 group-hover:text-white/90'
                }`}
              >
                {metal.name}
              </span>

              {/* Selected Check */}
              {selectedMetal === metal.type && (
                <Check className="ml-auto h-3.5 w-3.5 text-purple-400" />
              )}
            </button>
          ))}
        </div>

        {/* Info Text */}
        <div className="mt-1 px-2">
          <p className="text-[9px] text-white/40">
            Click to change metal color
          </p>
        </div>
      </div>
    </div>
  );
};

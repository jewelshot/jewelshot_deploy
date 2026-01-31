'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Palette } from 'lucide-react';
import BackgroundOption from '@/components/atoms/BackgroundOption';

export type BackgroundType = 'none' | 'black' | 'gray' | 'white' | 'alpha';

interface BackgroundSelectorProps {
  /**
   * Current background type
   */
  background: BackgroundType;
  /**
   * Change handler
   */
  onBackgroundChange: (bg: BackgroundType) => void;
}

const backgrounds = [
  { type: 'none' as const, label: 'Default' },
  { type: 'black' as const, label: 'Black' },
  { type: 'gray' as const, label: '50% Gray' },
  { type: 'white' as const, label: 'White' },
  { type: 'alpha' as const, label: 'Alpha' },
];

export function BackgroundSelector({
  background,
  onBackgroundChange,
}: BackgroundSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-white/20 hover:bg-white/[0.08] hover:text-white/80"
        title="Background"
      >
        <Palette className="h-3.5 w-3.5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-40 rounded-lg border border-white/10 bg-[rgba(10,10,10,0.95)] p-2 shadow-lg backdrop-blur-[16px]">
          {backgrounds.map((bg) => (
            <BackgroundOption
              key={bg.type}
              type={bg.type}
              label={bg.label}
              active={background === bg.type}
              onClick={() => {
                onBackgroundChange(bg.type);
                setIsOpen(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default BackgroundSelector;

/**
 * PresetModeTabs Component
 * 
 * Tab switcher for Quick / Selective / Advanced preset modes
 */

'use client';

import React from 'react';
import { Zap, Sliders, Code } from 'lucide-react';

export type PresetMode = 'quick' | 'selective' | 'advanced';

interface PresetModeTabsProps {
  activeMode: PresetMode;
  onModeChange: (mode: PresetMode) => void;
}

const MODES = [
  { id: 'quick' as PresetMode, label: 'Quick', icon: Zap, description: 'One-click presets' },
  { id: 'selective' as PresetMode, label: 'Selective', icon: Sliders, description: 'Build your look' },
  { id: 'advanced' as PresetMode, label: 'Advanced', icon: Code, description: 'Full control' },
];

export function PresetModeTabs({ activeMode, onModeChange }: PresetModeTabsProps) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-white/[0.02] p-0.5">
      {MODES.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;
        
        return (
          <button
            key={mode.id}
            onClick={() => onModeChange(mode.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[10px] font-medium transition-all ${
              isActive
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-white/50 hover:text-white/70'
            }`}
            title={mode.description}
          >
            <Icon className="h-3 w-3" />
            <span>{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default PresetModeTabs;

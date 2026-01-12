/**
 * PresetModeTabs Component
 * 
 * Tab switcher for Quick / Selective / Advanced preset modes
 */

'use client';

import React from 'react';
import { Zap, Sliders, Code } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';

export type PresetMode = 'quick' | 'selective' | 'advanced';

interface PresetModeTabsProps {
  activeMode: PresetMode;
  onModeChange: (mode: PresetMode) => void;
}

export function PresetModeTabs({ activeMode, onModeChange }: PresetModeTabsProps) {
  const { t } = useLanguage();
  
  const MODES = [
    { id: 'quick' as PresetMode, label: t.presets.quick, icon: Zap },
    { id: 'selective' as PresetMode, label: t.presets.selective, icon: Sliders },
    { id: 'advanced' as PresetMode, label: t.presets.advanced, icon: Code },
  ];
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

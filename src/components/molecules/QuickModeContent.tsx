import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PresetCard } from '@/components/atoms/PresetCard';

interface QuickModeContentProps {
  onPresetSelect: (presetName: string) => void;
}

/**
 * QuickModeContent - Quick presets organized by categories
 * Shows visual preset cards in collapsible accordion sections
 */
export function QuickModeContent({ onPresetSelect }: QuickModeContentProps) {
  // Accordion states - Etsy Optimized open by default
  const [etsyOpen, setEtsyOpen] = useState(true);
  const [ecommerceOpen, setEcommerceOpen] = useState(false);
  const [generalOpen, setGeneralOpen] = useState(false);

  // Etsy Optimized presets (empty for now)
  const etsyPresets: Array<{ id: string; title: string; imagePath: string }> =
    [];

  // E-commerce presets (empty for now)
  const ecommercePresets: Array<{
    id: string;
    title: string;
    imagePath: string;
  }> = [];

  // General Styles presets (existing presets)
  const generalPresets = [
    {
      id: 'e-commerce',
      title: 'White Background',
      imagePath: '/presets/e-commerce.webp',
    },
    {
      id: 'still-life',
      title: 'Still Life',
      imagePath: '/presets/still-life.webp',
    },
    {
      id: 'on-model',
      title: 'On Model',
      imagePath: '/presets/on-model.webp',
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle',
      imagePath: '/presets/lifestyle.webp',
    },
    {
      id: 'luxury',
      title: 'Luxury',
      imagePath: '/presets/luxury.webp',
    },
    {
      id: 'close-up',
      title: 'Close Up',
      imagePath: '/presets/close-up.webp',
    },
  ];

  return (
    <div className="space-y-2">
      {/* Info text */}
      <p className="text-[9px] text-white/40">
        Select a preset category and style
      </p>

      {/* Accordion Categories */}
      <div className="space-y-1.5">
        {/* 1. Etsy Optimized */}
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setEtsyOpen(!etsyOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🏪</span>
              <span className="text-[11px] font-medium text-white/90">
                Etsy Optimized
              </span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                etsyOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {etsyOpen && (
            <div className="border-t border-white/5 p-2">
              {etsyPresets.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {etsyPresets.map((preset) => (
                    <PresetCard
                      key={preset.id}
                      title={preset.title}
                      imagePath={preset.imagePath}
                      onClick={() => onPresetSelect(preset.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-2 text-center text-[9px] text-white/30">
                  Coming soon...
                </p>
              )}
            </div>
          )}
        </div>

        {/* 2. E-commerce */}
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setEcommerceOpen(!ecommerceOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🛒</span>
              <span className="text-[11px] font-medium text-white/90">
                E-commerce
              </span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                ecommerceOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {ecommerceOpen && (
            <div className="border-t border-white/5 p-2">
              {ecommercePresets.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {ecommercePresets.map((preset) => (
                    <PresetCard
                      key={preset.id}
                      title={preset.title}
                      imagePath={preset.imagePath}
                      onClick={() => onPresetSelect(preset.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="py-2 text-center text-[9px] text-white/30">
                  Coming soon...
                </p>
              )}
            </div>
          )}
        </div>

        {/* 3. General Styles */}
        <div className="rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setGeneralOpen(!generalOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🎨</span>
              <span className="text-[11px] font-medium text-white/90">
                General Styles
              </span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                generalOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
          {generalOpen && (
            <div className="border-t border-white/5 p-2">
              <div className="grid grid-cols-2 gap-2">
                {generalPresets.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    title={preset.title}
                    imagePath={preset.imagePath}
                    onClick={() => onPresetSelect(preset.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

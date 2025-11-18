'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PresetCard } from '@/components/atoms/PresetCard';
import { BatchControls } from '@/components/molecules/BatchControls';

interface BatchSidebarProps {
  imageCount: number;
  selectedPreset: string | null;
  onPresetSelect: (presetId: string) => void;
  batchName: string;
  onBatchNameChange: (name: string) => void;
  onStartBatch: () => void;
  isProcessing: boolean;
}

/**
 * BatchSidebar - Right sidebar for batch preset selection and controls
 */
export function BatchSidebar({
  imageCount,
  selectedPreset,
  onPresetSelect,
  batchName,
  onBatchNameChange,
  onStartBatch,
  isProcessing,
}: BatchSidebarProps) {
  const [generalOpen, setGeneralOpen] = useState(true);

  // General presets (same as Quick Mode)
  const presets = [
    { id: 'e-commerce', title: 'White Background', imagePath: '/presets/e-commerce.webp' },
    { id: 'still-life', title: 'Still Life', imagePath: '/presets/still-life.webp' },
    { id: 'luxury', title: 'Luxury', imagePath: '/presets/luxury.webp' },
    { id: 'close-up', title: 'Close Up', imagePath: '/presets/close-up.webp' },
  ];

  return (
    <aside className="fixed right-0 top-0 z-30 flex h-screen w-[280px] flex-col border-l border-white/10 bg-[rgba(10,10,10,0.7)] backdrop-blur-xl">
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-white/10 p-4">
          <h2 className="text-sm font-semibold text-white">
            Batch Configuration
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Select preset and start processing
          </p>
        </div>

        {/* Presets */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {/* Preset Selection */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-medium text-white/60">
                  Select Preset
                </span>
              </div>

              {/* Accordion */}
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
                      {presets.map((preset) => (
                        <div
                          key={preset.id}
                          className={`cursor-pointer ${
                            selectedPreset === preset.id
                              ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-black/50 rounded-lg'
                              : ''
                          }`}
                          onClick={() => onPresetSelect(preset.id)}
                        >
                          <PresetCard
                            title={preset.title}
                            imagePath={preset.imagePath}
                            onClick={() => {}}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Footer */}
        <div className="border-t border-white/10 p-4">
          <BatchControls
            imageCount={imageCount}
            selectedPreset={selectedPreset}
            batchName={batchName}
            onBatchNameChange={onBatchNameChange}
            onStartBatch={onStartBatch}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </aside>
  );
}


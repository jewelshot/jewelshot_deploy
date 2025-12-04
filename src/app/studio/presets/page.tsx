/**
 * Studio Presets - Quick Preset Library
 * 
 * Ready-made prompt combinations with generation settings
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Sparkles, Copy, Check, Code, Settings, ArrowRight, Ratio } from 'lucide-react';
import { getQuickPresets, type QuickPreset } from '@/lib/prompt-system/quick-presets';
import { BLOCK_REGISTRY } from '@/lib/prompt-system/registry';
import { buildPromptFromSelections, buildGroupedJSON, buildAPIPrompt } from '@/lib/prompt-system/builder';
import type { Gender, JewelryType } from '@/lib/prompt-system/types';
import { saveGenerationSettings } from '@/lib/generation-settings-storage';
import { useRouter } from 'next/navigation';

// Aspect ratio options
const ASPECT_RATIOS = [
  { value: '9:16', label: '9:16', description: 'Vertical (Stories)' },
  { value: '4:5', label: '4:5', description: 'Vertical (Instagram)' },
  { value: '1:1', label: '1:1', description: 'Square' },
  { value: '4:3', label: '4:3', description: 'Standard' },
  { value: '3:2', label: '3:2', description: 'Classic' },
  { value: '16:9', label: '16:9', description: 'Widescreen' },
  { value: '21:9', label: '21:9', description: 'Ultrawide' },
];

export default function PresetsPage() {
  const router = useRouter();
  
  // Enable body scroll for presets page (override globals.css)
  useEffect(() => {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    
    return () => {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    };
  }, []);

  const [gender, setGender] = useState<Gender | null>(null);
  const [jewelryType, setJewelryType] = useState<JewelryType | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('9:16');
  const [selectedPreset, setSelectedPreset] = useState<QuickPreset | null>(null);
  const [showJsonView, setShowJsonView] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Get presets based on selection
  const presets = useMemo(() => {
    if (!gender || !jewelryType) return [];
    return getQuickPresets(gender, jewelryType);
  }, [gender, jewelryType]);

  // Build prompt with generation settings
  const builtPrompt = useMemo(() => {
    if (!selectedPreset || !gender || !jewelryType) return '';
    const allBlocks = BLOCK_REGISTRY.getBlocks({ gender, jewelryType });
    const { prompt } = buildAPIPrompt(
      { gender, jewelryType },
      selectedPreset.selections,
      allBlocks,
      aspectRatio
    );
    return prompt;
  }, [selectedPreset, gender, jewelryType, aspectRatio]);

  // Build JSON with generation settings
  const builtJson = useMemo(() => {
    if (!selectedPreset || !gender || !jewelryType) return null;
    const allBlocks = BLOCK_REGISTRY.getBlocks({ gender, jewelryType });
    return buildGroupedJSON(
      { gender, jewelryType },
      selectedPreset.selections,
      allBlocks,
      aspectRatio
    );
  }, [selectedPreset, gender, jewelryType, aspectRatio]);

  // Copy JSON to clipboard
  const copyJsonToClipboard = async () => {
    if (!builtJson) return;
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(builtJson, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  // Copy Prompt to clipboard
  const copyPromptToClipboard = async () => {
    if (!builtPrompt) return;
    
    try {
      await navigator.clipboard.writeText(builtPrompt);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  // Use preset in Studio
  const handleUseInStudio = () => {
    if (!gender || !jewelryType || !selectedPreset) return;
    
    // Save generation settings
    saveGenerationSettings({
      gender,
      jewelryType,
      aspectRatio,
      applyToAll: true,
      timestamp: Date.now(),
    });

    // Save preset prompt to sessionStorage for Studio to pick up
    sessionStorage.setItem('jewelshot_preset_prompt', builtPrompt);
    sessionStorage.setItem('jewelshot_preset_name', selectedPreset.name);
    
    // Navigate to Studio
    router.push('/studio');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <Sparkles className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Quick Presets</h1>
              <p className="text-white/60">Ready-made prompt combinations</p>
            </div>
          </div>
        </div>

        {/* Generation Settings */}
        <div className="mb-8 rounded-2xl border border-purple-500/30 bg-purple-500/5 p-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-400" />
            Generation Settings
          </h2>
          
          {/* Gender Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">Gender</label>
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <button
                onClick={() => {
                  setGender('women');
                  setJewelryType(null);
                  setSelectedPreset(null);
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  gender === 'women'
                    ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="text-4xl mb-3">👩</div>
                <div className="text-lg font-semibold">Women</div>
              </button>
              <button
                onClick={() => {
                  setGender('men');
                  setJewelryType(null);
                  setSelectedPreset(null);
                }}
                className={`p-6 rounded-xl border-2 transition-all ${
                  gender === 'men'
                    ? 'border-blue-500 bg-blue-500/20 shadow-lg shadow-blue-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }`}
              >
                <div className="text-4xl mb-3">👨</div>
                <div className="text-lg font-semibold">Men</div>
              </button>
            </div>
          </div>

          {/* Jewelry Type Selection */}
          {gender && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">Jewelry Type</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
                <button
                  onClick={() => {
                    setJewelryType('ring');
                    setSelectedPreset(null);
                  }}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    jewelryType === 'ring'
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">💍</div>
                  <div className="font-semibold">Ring</div>
                </button>
                <button
                  onClick={() => {
                    setJewelryType('necklace');
                    setSelectedPreset(null);
                  }}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    jewelryType === 'necklace'
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">📿</div>
                  <div className="font-semibold">Necklace</div>
                </button>
                <button
                  onClick={() => {
                    setJewelryType('earring');
                    setSelectedPreset(null);
                  }}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    jewelryType === 'earring'
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">💎</div>
                  <div className="font-semibold">Earring</div>
                </button>
                <button
                  onClick={() => {
                    setJewelryType('bracelet');
                    setSelectedPreset(null);
                  }}
                  className={`p-5 rounded-xl border-2 transition-all ${
                    jewelryType === 'bracelet'
                      ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="text-3xl mb-2">⌚</div>
                  <div className="font-semibold">Bracelet</div>
                </button>
              </div>
            </div>
          )}

          {/* Aspect Ratio Selection */}
          {gender && jewelryType && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-3 flex items-center gap-2">
                <Ratio className="h-4 w-4" />
                Aspect Ratio
              </label>
              <div className="flex flex-wrap gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                      aspectRatio === ratio.value
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10'
                    }`}
                    title={ratio.description}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-white/40 mt-2">
                Selected: {ASPECT_RATIOS.find(r => r.value === aspectRatio)?.description}
              </p>
            </div>
          )}
        </div>

        {/* Presets Grid */}
        {gender && jewelryType && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Preset Cards */}
            <div className="lg:col-span-2">
              {presets.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-16 text-center">
                  <div className="text-6xl mb-4">🚧</div>
                  <h3 className="text-2xl font-semibold mb-3">Coming Soon</h3>
                  <p className="text-white/60 text-lg">
                    Quick presets for {gender} {jewelryType} are being prepared.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold mb-4">
                    {presets.length} Presets Available
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedPreset(preset)}
                        className={`rounded-xl border-2 p-5 text-left transition-all ${
                          selectedPreset?.id === preset.id
                            ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                            : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
                        }`}
                      >
                        <div className="mb-3">
                          <h4 className="font-semibold text-lg mb-1">{preset.name}</h4>
                          <p className="text-sm text-white/60">{preset.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {preset.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Preview */}
            {selectedPreset && (
              <div className="lg:col-span-1">
                <div className="sticky top-6 rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                  {/* Header */}
                  <div className="p-5 border-b border-white/10">
                    <h3 className="font-semibold text-lg mb-1">{selectedPreset.name}</h3>
                    <p className="text-sm text-white/60">
                      {gender} · {jewelryType} · {aspectRatio}
                    </p>
                  </div>

                  {/* View Toggle */}
                  <div className="flex gap-2 p-3 border-b border-white/10 bg-white/5">
                    <button
                      onClick={() => setShowJsonView(false)}
                      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        !showJsonView
                          ? 'bg-purple-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <Code className="inline h-4 w-4 mr-1.5" />
                      Prompt
                    </button>
                    <button
                      onClick={() => setShowJsonView(true)}
                      className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        showJsonView
                          ? 'bg-green-500 text-white'
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      <Settings className="inline h-4 w-4 mr-1.5" />
                      JSON
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-5 max-h-[400px] overflow-y-auto">
                    {!showJsonView ? (
                      <>
                        <div className="flex items-center justify-end mb-3">
                          <button
                            onClick={copyPromptToClipboard}
                            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-sm text-purple-400 transition-colors hover:bg-purple-500/20"
                          >
                            {copiedPrompt ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy Prompt
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-sm text-white/80 font-mono leading-relaxed">
                          {builtPrompt}
                        </pre>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-end mb-3">
                          <button
                            onClick={copyJsonToClipboard}
                            className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-sm text-green-400 transition-colors hover:bg-green-500/20"
                          >
                            {copiedJson ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="h-3.5 w-3.5" />
                                Copy JSON
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap text-xs text-green-400 font-mono leading-relaxed">
                          {builtJson ? JSON.stringify(builtJson, null, 2) : '{}'}
                        </pre>
                      </>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="p-4 border-t border-white/10 bg-white/5">
                    <button
                      onClick={handleUseInStudio}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-semibold text-white transition-all hover:from-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                      Use in Studio
                      <ArrowRight className="h-5 w-5" />
                    </button>
                    <p className="text-xs text-white/40 text-center mt-2">
                      Opens Studio with this preset ready to generate
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Studio Lab - Experimental Prompt Builder
 * 
 * Testing ground for advanced mode micro blocks
 * NOT linked in production navigation
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Settings, ChevronDown, ChevronUp, Zap, Code } from 'lucide-react';
import { BLOCK_REGISTRY } from '@/lib/prompt-system/registry';
import { buildPromptFromSelections } from '@/lib/prompt-system/builder';
import type { BlockSelections, Gender, JewelryType, BlockCategory } from '@/lib/prompt-system/types';

export default function StudioLabPage() {
  // Enable body scroll for lab page (override globals.css)
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
  const [selections, setSelections] = useState<BlockSelections>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [showJsonView, setShowJsonView] = useState(false);
  
  // Get applicable categories based on context
  const categories = useMemo(() => {
    if (!gender || !jewelryType) return [];
    return BLOCK_REGISTRY.getCategories({ gender, jewelryType });
  }, [gender, jewelryType]);
  
  // Separate UNIVERSAL women features vs JEWELRY-SPECIFIC features
  const universalWomenCategories = useMemo(() => {
    return categories.filter(cat => {
      // Universal: Exist across ALL jewelry types (skin tone, general features)
      const jewelryTypes = cat.applicableTo.jewelryTypes;
      return jewelryTypes.length > 1;
    }).sort((a, b) => a.order - b.order);
  }, [categories]);
  
  const jewelrySpecificCategories = useMemo(() => {
    return categories.filter(cat => {
      // Jewelry-specific: Only for this specific jewelry type
      const jewelryTypes = cat.applicableTo.jewelryTypes;
      return jewelryTypes.length === 1 && jewelryTypes.includes(jewelryType);
    }).sort((a, b) => a.order - b.order);
  }, [categories, jewelryType]);
  
  // Handle gender selection
  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    setJewelryType(null); // Reset jewelry selection
    setSelections({});
    setExpandedCategories(new Set());
    setGeneratedPrompt('');
  };

  const handleBlockSelect = (categoryId: string, blockId: string) => {
    setSelections(prev => ({
      ...prev,
      [categoryId]: blockId,
    }));
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleGeneratePrompt = () => {
    if (!gender || !jewelryType) return;
    const allBlocks = BLOCK_REGISTRY.getBlocks({ gender, jewelryType });
    const prompt = buildPromptFromSelections(
      { gender, jewelryType },
      selections,
      allBlocks,
      '9:16'
    );
    setGeneratedPrompt(prompt);
  };

  const selectedCount = Object.keys(selections).length;
  const totalCategories = categories.length;
  
  // Build JSON representation of selections
  const selectionsJson = useMemo(() => {
    if (!gender || !jewelryType) {
      return JSON.stringify({ message: 'Please select gender first' }, null, 2);
    }
    
    const json: Record<string, any> = {
      context: {
        gender,
        jewelryType,
        aspectRatio: '9:16',
      },
      selections: {},
    };
    
    Object.entries(selections).forEach(([categoryId, blockId]) => {
      const block = BLOCK_REGISTRY.getBlock(blockId);
      const category = categories.find(c => c.id === categoryId);
      
      if (block && category) {
        json.selections[categoryId] = {
          category: category.name,
          block: block.name,
          promptFragment: block.promptFragment,
        };
      }
    });
    
    return JSON.stringify(json, null, 2);
  }, [gender, jewelryType, selections, categories]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 pb-12">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                <Settings className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">🧪 Studio Lab</h1>
                <p className="text-sm text-white/60">
                  Experimental Prompt Builder - Context-Aware Blocks
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-white/60">Selections:</span>{' '}
                <span className="font-medium text-purple-400">
                  {selectedCount}/{totalCategories}
                </span>
              </div>
            </div>
          </div>
          
            {/* Gender Selector - PRIMARY */}
            <div>
              <label className="mb-3 block text-xl font-semibold text-white">
                1️⃣ Select Gender
              </label>
              <div className="flex gap-3">
                <button
                  onClick={() => handleGenderChange('women')}
                  className={`flex-1 rounded-xl border-2 px-8 py-6 text-lg font-semibold transition-all ${
                    gender === 'women'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-300 shadow-xl shadow-purple-500/30'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="text-4xl mb-2">👩</div>
                  Women
                </button>
                <button
                  onClick={() => handleGenderChange('men')}
                  disabled
                  className="flex-1 rounded-xl border-2 border-white/10 bg-white/5 px-8 py-6 text-lg font-semibold text-white/30 cursor-not-allowed"
                >
                  <div className="text-4xl mb-2">👨</div>
                  Men
                  <div className="text-xs mt-1">(Coming Soon)</div>
                </button>
              </div>
            </div>
        </div>

        {/* Jewelry Type Selector - Shows after gender selection */}
        {gender && !jewelryType && (
          <div className="mb-6">
            <label className="mb-3 block text-xl font-semibold text-white">
              2️⃣ Select Jewelry Type
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'ring', label: 'Ring', icon: '💍' },
                { value: 'necklace', label: 'Necklace', icon: '📿' },
                { value: 'earring', label: 'Earring', icon: '💎', disabled: true },
                { value: 'bracelet', label: 'Bracelet', icon: '⌚', disabled: true },
              ].map(type => (
                <button
                  key={type.value}
                  onClick={() => !type.disabled && setJewelryType(type.value as JewelryType)}
                  disabled={type.disabled}
                  className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 px-6 py-6 font-semibold transition-all ${
                    type.disabled
                      ? 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed'
                      : 'border-white/10 bg-white/5 text-white/80 hover:border-purple-500/50 hover:bg-purple-500/10 hover:text-white'
                  }`}
                >
                  <span className="text-3xl">{type.icon}</span>
                  <span className="text-sm">{type.label}</span>
                  {type.disabled && (
                    <span className="text-xs text-white/40">Coming Soon</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Block Selection - Shows after both gender and jewelry selected */}
        {gender && jewelryType && (
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            {/* Left: Block Selection */}
            <div className="space-y-8 w-full">
              {/* 1️⃣ UNIVERSAL WOMEN FEATURES - Applies to ALL jewelry types */}
              {universalWomenCategories.length > 0 && (
              <div className="rounded-2xl border-2 border-purple-500/30 bg-purple-500/5 p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20">
                    <span className="text-2xl">👩</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Universal Women Features
                    </h2>
                    <p className="text-xs text-white/60">
                      Applies to all jewelry types · {universalWomenCategories.length} categories
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  {universalWomenCategories.map(category => renderCategory(category))}
                </div>
              </div>
            )}
            
              {/* 2️⃣ JEWELRY-SPECIFIC FEATURES - Only for selected jewelry */}
              {jewelrySpecificCategories.length > 0 && (
                <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-500/5 p-5">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                      <span className="text-2xl">
                        {jewelryType === 'ring' && '💍'}
                        {jewelryType === 'necklace' && '📿'}
                        {jewelryType === 'earring' && '💎'}
                        {jewelryType === 'bracelet' && '⌚'}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">
                        {jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}-Specific Features
                      </h2>
                      <p className="text-xs text-white/60">
                        Only for {jewelryType}s · {jewelrySpecificCategories.length} categories
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {jewelrySpecificCategories.map(category => renderCategory(category))}
                  </div>
                </div>
              )}
            
            </div>

            {/* Right: Prompt Preview */}
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Generated Output</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowJsonView(false)}
                  className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                    !showJsonView
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Prompt
                </button>
                <button
                  onClick={() => setShowJsonView(true)}
                  className={`flex items-center gap-1 rounded px-3 py-1 text-xs font-medium transition-colors ${
                    showJsonView
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Code className="h-3 w-3" />
                  JSON
                </button>
              </div>
            </div>

            {!showJsonView ? (
              // Prompt View
              <>
                <button
                  onClick={handleGeneratePrompt}
                  disabled={selectedCount === 0}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="h-4 w-4" />
                  Generate Prompt ({selectedCount} blocks selected)
                </button>

                {generatedPrompt ? (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs text-white/80 font-mono leading-relaxed">
                      {generatedPrompt}
                    </pre>
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-white/20 bg-white/5 p-8 text-center text-white/60">
                    <Zap className="mx-auto mb-2 h-8 w-8 text-white/40" />
                    <p className="text-sm">
                      Select blocks and click Generate to see the prompt
                    </p>
                  </div>
                )}
              </>
            ) : (
              // JSON View
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 max-h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-xs text-green-400 font-mono leading-relaxed">
                  {selectionsJson}
                </pre>
              </div>
            )}

            {/* Selected Blocks Summary */}
            {selectedCount > 0 && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 text-sm font-medium text-white/80">
                  Selected Blocks ({selectedCount})
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {Object.entries(selections).map(([categoryId, blockId]) => {
                    const category = categories.find(c => c.id === categoryId);
                    const block = BLOCK_REGISTRY.getBlock(blockId);
                    
                    if (!category || !block) return null;
                    
                    return (
                      <div
                        key={categoryId}
                        className="flex items-center justify-between rounded border border-white/10 bg-white/5 px-3 py-2 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span>{category.icon}</span>
                          <span className="text-white/60">{category.name}:</span>
                        </div>
                        <div className="font-medium text-purple-400">
                          {block.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
  
  // Helper function to render category
  function renderCategory(category: BlockCategory) {
    if (!gender || !jewelryType) return null;
    const isExpanded = expandedCategories.has(category.id);
    const selectedBlockId = selections[category.id];
    const categoryBlocks = BLOCK_REGISTRY.getBlocksByCategory(category.id, { gender, jewelryType });

    return (
      <div
        key={category.id}
        className="rounded-lg border border-white/10 bg-white/5 overflow-hidden"
      >
        {/* Category Header */}
        <button
          onClick={() => toggleCategory(category.id)}
          className="flex w-full items-center justify-between p-3 transition-colors hover:bg-white/5"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{category.icon}</span>
            <div className="text-left">
              <div className="text-sm font-medium">{category.name}</div>
              <div className="text-xs text-white/60">
                {category.description}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {category.required && (
              <div className="rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                Required
              </div>
            )}
            {selectedBlockId && (
              <div className="rounded-full bg-purple-500/20 px-2 py-0.5 text-xs text-purple-400">
                ✓
              </div>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-white/60" />
            ) : (
              <ChevronDown className="h-4 w-4 text-white/60" />
            )}
          </div>
        </button>

        {/* Category Blocks */}
        {isExpanded && (
          <div className="border-t border-white/10 p-3">
            <div className="grid grid-cols-2 gap-2">
              {categoryBlocks.map(block => {
                const isSelected = selectedBlockId === block.id;
                
                return (
                  <button
                    key={block.id}
                    onClick={() => handleBlockSelect(category.id, block.id)}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      {block.icon && (
                        <span className="text-base">{block.icon}</span>
                      )}
                      <div className="text-xs font-medium">
                        {block.name}
                      </div>
                    </div>
                    {block.description && (
                      <div className="text-[10px] text-white/60 leading-tight">
                        {block.description}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}


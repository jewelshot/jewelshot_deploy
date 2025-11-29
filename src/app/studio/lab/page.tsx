/**
 * Studio Lab - Experimental Prompt Builder
 * 
 * Testing ground for advanced mode micro blocks
 * NOT linked in production navigation
 */

'use client';

import { useState, useMemo } from 'react';
import { Settings, ChevronDown, ChevronUp, Zap, Code } from 'lucide-react';
import { BLOCK_REGISTRY } from '@/lib/prompt-system/registry';
import { buildPromptFromSelections } from '@/lib/prompt-system/builder';
import type { BlockSelections, Gender, JewelryType, BlockCategory } from '@/lib/prompt-system/types';

const JEWELRY_TYPES: { value: JewelryType; label: string; icon: string }[] = [
  { value: 'ring', label: 'Ring', icon: '💍' },
  { value: 'necklace', label: 'Necklace', icon: '📿' },
  { value: 'earring', label: 'Earring', icon: '💎' },
  { value: 'bracelet', label: 'Bracelet', icon: '⌚' },
];

export default function StudioLabPage() {
  const [gender, setGender] = useState<Gender>('women');
  const [jewelryType, setJewelryType] = useState<JewelryType>('ring');
  const [selections, setSelections] = useState<BlockSelections>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [showJsonView, setShowJsonView] = useState(false);
  
  // Get applicable categories based on context
  const categories = useMemo(() => {
    return BLOCK_REGISTRY.getCategories({ gender, jewelryType });
  }, [gender, jewelryType]);
  
  // Separate gender-based and jewelry-based categories
  const genderBasedCategories = useMemo(() => {
    return categories.filter(cat => {
      // Categories that exist across multiple jewelry types (gender-specific)
      const jewelryTypes = cat.applicableTo.jewelryTypes;
      return jewelryTypes.length > 1;
    });
  }, [categories]);
  
  const jewelryBasedCategories = useMemo(() => {
    return categories.filter(cat => {
      // Categories specific to this jewelry type
      const jewelryTypes = cat.applicableTo.jewelryTypes;
      return jewelryTypes.length === 1 && jewelryTypes.includes(jewelryType);
    });
  }, [categories, jewelryType]);
  
  // Reset selections when context changes
  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    setSelections({});
    setExpandedCategories(new Set());
    setGeneratedPrompt('');
  };
  
  const handleJewelryTypeChange = (newType: JewelryType) => {
    setJewelryType(newType);
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
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
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
          
          {/* Context Selectors */}
          <div className="space-y-4">
            {/* Gender Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                👤 Gender
              </label>
              <div className="flex gap-2">
                {(['women', 'men'] as Gender[]).map(g => (
                  <button
                    key={g}
                    onClick={() => handleGenderChange(g)}
                    className={`flex-1 rounded-lg border px-6 py-3 text-sm font-medium transition-all ${
                      gender === g
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {g === 'women' ? '👩 Women' : '👨 Men'}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Jewelry Type Selector */}
            <div>
              <label className="mb-2 block text-sm font-medium text-white/80">
                💎 Jewelry Type
              </label>
              <div className="grid grid-cols-4 gap-2">
                {JEWELRY_TYPES.map(type => (
                  <button
                    key={type.value}
                    onClick={() => handleJewelryTypeChange(type.value)}
                    className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                      jewelryType === type.value
                        ? 'border-purple-500 bg-purple-500/10 text-purple-400 shadow-lg shadow-purple-500/20'
                        : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Block Selection */}
          <div className="space-y-6">
            {/* Gender-Based Blocks */}
            {genderBasedCategories.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">{gender === 'women' ? '👩' : '👨'}</span>
                  Gender-Specific Blocks
                  <span className="text-xs font-normal text-white/60">
                    ({genderBasedCategories.length} categories)
                  </span>
                </h2>
                <div className="space-y-3">
                  {genderBasedCategories.map(category => renderCategory(category))}
                </div>
              </div>
            )}
            
            {/* Jewelry-Based Blocks */}
            {jewelryBasedCategories.length > 0 && (
              <div>
                <h2 className="mb-3 text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">
                    {JEWELRY_TYPES.find(t => t.value === jewelryType)?.icon}
                  </span>
                  {jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}-Specific Blocks
                  <span className="text-xs font-normal text-white/60">
                    ({jewelryBasedCategories.length} categories)
                  </span>
                </h2>
                <div className="space-y-3">
                  {jewelryBasedCategories.map(category => renderCategory(category))}
                </div>
              </div>
            )}
            
            {/* No blocks available */}
            {categories.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/20 bg-white/5 p-8 text-center text-white/60">
                <p className="text-sm">
                  No blocks available for this combination yet.
                  <br />
                  <span className="text-xs">
                    Try: Women + Ring, Men + Ring, or Women + Necklace
                  </span>
                </p>
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
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 max-h-96 overflow-y-auto">
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
              <div className="rounded-lg border border-white/10 bg-white/5 p-4 max-h-[500px] overflow-y-auto">
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
                <div className="space-y-2">
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
      </div>
    </div>
  );
  
  // Helper function to render category
  function renderCategory(category: BlockCategory) {
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


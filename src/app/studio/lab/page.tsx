/**
 * Studio Lab - Experimental Prompt Builder
 * 
 * Testing ground for advanced mode micro blocks
 * NOT linked in production navigation
 */

'use client';

import { useState } from 'react';
import { Settings, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { WOMEN_RING_CATEGORIES, WOMEN_RING_BLOCKS } from '@/lib/prompt-system/blocks/women-ring';
import { buildPromptFromSelections } from '@/lib/prompt-system/builder';
import type { BlockSelections, Gender, JewelryType } from '@/lib/prompt-system/types';

export default function StudioLabPage() {
  const [gender] = useState<Gender>('women');
  const [jewelryType] = useState<JewelryType>('ring');
  const [selections, setSelections] = useState<BlockSelections>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['hand-pose']) // Hand pose open by default
  );
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

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
    const prompt = buildPromptFromSelections(
      { gender, jewelryType },
      selections,
      WOMEN_RING_BLOCKS,
      '9:16'
    );
    setGeneratedPrompt(prompt);
  };

  const selectedCount = Object.keys(selections).length;
  const totalCategories = WOMEN_RING_CATEGORIES.length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Settings className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">🧪 Studio Lab</h1>
              <p className="text-sm text-white/60">
                Experimental Advanced Mode - Women's Ring
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-4 flex gap-4 text-sm">
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-white/60">Context:</span>{' '}
              <span className="font-medium text-purple-400">
                {gender.charAt(0).toUpperCase() + gender.slice(1)}'s {jewelryType}
              </span>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <span className="text-white/60">Selections:</span>{' '}
              <span className="font-medium text-purple-400">
                {selectedCount}/{totalCategories}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: Block Selection */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select Blocks</h2>
            
            {WOMEN_RING_CATEGORIES.map(category => {
              const isExpanded = expandedCategories.has(category.id);
              const selectedBlockId = selections[category.id];
              const categoryBlocks = WOMEN_RING_BLOCKS.filter(
                b => b.categoryId === category.id
              );

              return (
                <div
                  key={category.id}
                  className="rounded-lg border border-white/10 bg-white/5 overflow-hidden"
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="flex w-full items-center justify-between p-4 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div className="text-left">
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-white/60">
                          {category.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {selectedBlockId && (
                        <div className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-400">
                          Selected
                        </div>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-white/60" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-white/60" />
                      )}
                    </div>
                  </button>

                  {/* Category Blocks */}
                  {isExpanded && (
                    <div className="border-t border-white/10 p-4">
                      <div className="grid grid-cols-2 gap-2">
                        {categoryBlocks.map(block => {
                          const isSelected = selectedBlockId === block.id;
                          
                          return (
                            <button
                              key={block.id}
                              onClick={() => handleBlockSelect(category.id, block.id)}
                              className={`rounded-lg border p-3 text-left transition-all ${
                                isSelected
                                  ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                              }`}
                            >
                              <div className="mb-1 flex items-center gap-2">
                                {block.icon && (
                                  <span className="text-lg">{block.icon}</span>
                                )}
                                <div className="text-sm font-medium">
                                  {block.name}
                                </div>
                              </div>
                              {block.description && (
                                <div className="text-xs text-white/60">
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
            })}
          </div>

          {/* Right: Prompt Preview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Generated Prompt</h2>
              <button
                onClick={handleGeneratePrompt}
                disabled={selectedCount === 0}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Zap className="h-4 w-4" />
                Generate
              </button>
            </div>

            {generatedPrompt ? (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <pre className="whitespace-pre-wrap text-xs text-white/80 font-mono">
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

            {/* Selected Blocks Summary */}
            {selectedCount > 0 && (
              <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                <h3 className="mb-3 text-sm font-medium text-white/80">
                  Selected Blocks ({selectedCount})
                </h3>
                <div className="space-y-2">
                  {Object.entries(selections).map(([categoryId, blockId]) => {
                    const category = WOMEN_RING_CATEGORIES.find(
                      c => c.id === categoryId
                    );
                    const block = WOMEN_RING_BLOCKS.find(b => b.id === blockId);
                    
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
}


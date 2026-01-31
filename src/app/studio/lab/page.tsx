/**
 * Studio Lab - Experimental Prompt Builder
 * 
 * Testing ground for advanced mode micro blocks
 * NOT linked in production navigation
 */

'use client';

import { useState, useMemo, useEffect } from 'react';
import { Settings, ChevronDown, ChevronUp, Zap, Code, Shuffle, Copy, Check } from 'lucide-react';
import { BLOCK_REGISTRY } from '@/lib/prompt-system/registry';
import { buildPromptFromSelections, buildGroupedJSON } from '@/lib/prompt-system/builder';
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
  const [showFaceDetails, setShowFaceDetails] = useState(false); // Toggle for Face Details
  const [copiedJson, setCopiedJson] = useState(false); // Track if JSON was copied
  
  // Accordion states for main sections
  const [showGenderJewelry, setShowGenderJewelry] = useState(true);
  const [showWomenFeatures, setShowWomenFeatures] = useState(true);
  const [showStyling, setShowStyling] = useState(true);
  const [showEnvironment, setShowEnvironment] = useState(true);
  const [showCamera, setShowCamera] = useState(true);
  const [showPostProduction, setShowPostProduction] = useState(true);
  const [showCreativeDirection, setShowCreativeDirection] = useState(true);
  const [showLifestyleExtras, setShowLifestyleExtras] = useState(false); // Optional, default closed
  const [showFaceDetailsSection, setShowFaceDetailsSection] = useState(false);
  const [showJewelrySpecific, setShowJewelrySpecific] = useState(true);
  
  // Get applicable categories based on context
  const categories = useMemo(() => {
    if (!gender || !jewelryType) return [];
    return BLOCK_REGISTRY.getCategories({ gender, jewelryType });
  }, [gender, jewelryType]);
  
  // Styling category IDs (to separate from Women body features)
  const STYLING_CATEGORY_IDS = [
    // Women styling
    'clothing-type', 'upper-clothing', 'upper-color', 'lower-clothing', 'lower-color',
    // Men styling
    'upper-clothing-men', 'neckline-opening-men', 'collar-type-men', 'fit-style-men', 
    'sleeve-style-men', 'upper-pattern-men', 'upper-color-men', 'lower-clothing-men', 'lower-color-men'
  ];
  
  // Environment category IDs (to separate from other features)
  const ENVIRONMENT_CATEGORY_IDS = [
    // Women environment
    'location-background', 'lighting',
    // Men environment
    'location-background-men', 'lighting-men'
  ];
  
  // Camera category IDs (to separate from other features)
  const CAMERA_CATEGORY_IDS = [
    // Women camera
    'jewelry-framing', 'viewing-angle', 'focus-depth', 'composition-rules',
    // Men camera
    'jewelry-framing-men', 'viewing-angle-men', 'focus-depth-men', 'composition-rules-men'
  ];
  
  // Post-production category IDs
  const POST_PRODUCTION_CATEGORY_IDS = [
    // Women post-production
    'post-processing-level', 'color-grading',
    // Men post-production
    'post-processing-level-men', 'color-grading-men'
  ];
  
  // Creative direction category IDs
  const CREATIVE_DIRECTION_CATEGORY_IDS = [
    // Women creative direction
    'presentation-intent', 'mood-atmosphere', 'jewelry-context',
    // Men creative direction
    'presentation-intent-men', 'mood-atmosphere-men', 'jewelry-context-men'
  ];
  
  // Lifestyle extras category IDs
  const LIFESTYLE_EXTRAS_CATEGORY_IDS = [
    // Women lifestyle
    'props-accessories',
    // Men lifestyle
    'props-accessories-men'
  ];
  
  // Separate WOMEN BODY FEATURES, STYLING, ENVIRONMENT, CAMERA, POST-PRODUCTION, CREATIVE DIRECTION, LIFESTYLE EXTRAS, CONDITIONAL (Face Details), and JEWELRY-SPECIFIC features
  const universalWomenCategories = useMemo(() => {
    return categories.filter(cat => {
      // Universal WOMEN BODY: Exist across ALL jewelry types & NOT conditional & NOT styling & NOT environment & NOT camera & NOT post & NOT creative & NOT lifestyle
      const jewelryTypes = cat.applicableTo.jewelryTypes;
      return jewelryTypes.length > 1 && 
             !cat.conditional && 
             !STYLING_CATEGORY_IDS.includes(cat.id) && 
             !ENVIRONMENT_CATEGORY_IDS.includes(cat.id) && 
             !CAMERA_CATEGORY_IDS.includes(cat.id) &&
             !POST_PRODUCTION_CATEGORY_IDS.includes(cat.id) &&
             !CREATIVE_DIRECTION_CATEGORY_IDS.includes(cat.id) &&
             !LIFESTYLE_EXTRAS_CATEGORY_IDS.includes(cat.id);
    }).sort((a, b) => a.order - b.order);
  }, [categories]);
  
  const stylingCategories = useMemo(() => {
    // Always show styling (universal, not gender/jewelry dependent)
    const allCategories = BLOCK_REGISTRY.getAllCategories();
    return allCategories.filter(cat => STYLING_CATEGORY_IDS.includes(cat.id)).sort((a, b) => a.order - b.order);
  }, []);
  
  const environmentCategories = useMemo(() => {
    // Always show environment (universal, not gender/jewelry dependent)
    const allCategories = BLOCK_REGISTRY.getAllCategories();
    return allCategories.filter(cat => ENVIRONMENT_CATEGORY_IDS.includes(cat.id)).sort((a, b) => a.order - b.order);
  }, []);
  
  const cameraCategories = useMemo(() => {
    // Always show camera (universal, not gender/jewelry dependent)
    const allCategories = BLOCK_REGISTRY.getAllCategories();
    return allCategories.filter(cat => CAMERA_CATEGORY_IDS.includes(cat.id)).sort((a, b) => a.order - b.order);
  }, []);
  
  const postProductionCategories = useMemo(() => {
    // Always show post-production (universal, not gender/jewelry dependent)
    const allCategories = BLOCK_REGISTRY.getAllCategories();
    return allCategories.filter(cat => POST_PRODUCTION_CATEGORY_IDS.includes(cat.id)).sort((a, b) => a.order - b.order);
  }, []);
  
  const creativeDirectionCategories = useMemo(() => {
    // Always show creative direction (universal, not gender/jewelry dependent)
    const allCategories = BLOCK_REGISTRY.getAllCategories();
    return allCategories.filter(cat => CREATIVE_DIRECTION_CATEGORY_IDS.includes(cat.id)).sort((a, b) => a.order - b.order);
  }, []);
  
  const lifestyleExtrasCategories = useMemo(() => {
    // Always show lifestyle extras (universal, not gender/jewelry dependent)
    const allCategories = BLOCK_REGISTRY.getAllCategories();
    return allCategories.filter(cat => LIFESTYLE_EXTRAS_CATEGORY_IDS.includes(cat.id)).sort((a, b) => a.order - b.order);
  }, []);
  
  const conditionalFaceCategories = useMemo(() => {
    return categories.filter(cat => {
      // Conditional: Face details (hidden until toggled)
      return cat.conditional === true;
    }).sort((a, b) => a.order - b.order);
  }, [categories]);
  
  const jewelrySpecificCategories = useMemo(() => {
    if (!jewelryType) return [];
    const currentJewelryType = jewelryType; // Type narrowing for TypeScript
    return categories.filter(cat => {
      // Jewelry-specific: Only for this specific jewelry type
      const jewelryTypes = cat.applicableTo.jewelryTypes;
      return jewelryTypes.length === 1 && jewelryTypes.includes(currentJewelryType);
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

  // Handle jewelry type change (without resetting gender)
  const handleJewelryTypeChange = (newJewelryType: JewelryType) => {
    setJewelryType(newJewelryType);
    setSelections({}); // Reset selections when jewelry changes
    setExpandedCategories(new Set());
    setGeneratedPrompt('');
  };

  // Reset all selections
  const handleResetAll = () => {
    setGender(null);
    setJewelryType(null);
    setSelections({});
    setExpandedCategories(new Set());
    setGeneratedPrompt('');
  };

  /**
   * Randomize blocks for specific categories
   */
  const randomizeCategories = (categoryIds: string[]) => {
    if (!gender || !jewelryType) return;

    const newSelections = { ...selections };
    
    categoryIds.forEach(categoryId => {
      const categoryBlocks = BLOCK_REGISTRY.getBlocksByCategory(categoryId, { gender, jewelryType });
      if (categoryBlocks.length > 0) {
        const randomBlock = categoryBlocks[Math.floor(Math.random() * categoryBlocks.length)];
        newSelections[categoryId] = randomBlock.id;
      }
    });

    setSelections(newSelections);
  };

  /**
   * Randomize ALL categories except Gender and Jewelry Type
   */
  const randomizeAll = () => {
    if (!gender || !jewelryType) return;

    const allCategories = BLOCK_REGISTRY.getCategories({ gender, jewelryType });
    const categoryIds = allCategories.map(cat => cat.id);
    
    randomizeCategories(categoryIds);
  };

  /**
   * Copy JSON to clipboard
   */
  const copyJsonToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(selectionsJson);
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  const handleBlockSelect = (categoryId: string, blockId: string) => {
    setSelections(prev => {
      const newSelections = {
        ...prev,
        [categoryId]: blockId,
      };
      
      // If clothing-type is selected, clear conflicting selections
      if (categoryId === 'clothing-type') {
        const selectedBlock = BLOCK_REGISTRY.getBlock(blockId);
        if (selectedBlock?.conflictsWith) {
          // Remove any selections that conflict with this clothing type
          const conflictIds = selectedBlock.conflictsWith;
          Object.keys(newSelections).forEach(key => {
            const selectedBlockId = newSelections[key];
            if (conflictIds.includes(selectedBlockId)) {
              delete newSelections[key];
            }
          });
        }
      }
      
      return newSelections;
    });
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
  
  // Build simplified JSON representation of selections (only promptFragment)
  const selectionsJson = useMemo(() => {
    if (!gender || !jewelryType) {
      return JSON.stringify({ message: 'Please select gender and jewelry type first' }, null, 2);
    }
    
    // Use new grouped JSON builder
    const allBlocks = BLOCK_REGISTRY.getBlocks({ gender, jewelryType });
    const groupedJson = buildGroupedJSON(
      { gender, jewelryType },
      selections,
      allBlocks,
      '9:16' // Default aspect ratio for lab
    );
    
    // Debug: Check for unmapped categories
    const unmappedCategories: string[] = [];
    Object.keys(selections).forEach(categoryId => {
      const block = allBlocks.find(b => b.id === selections[categoryId]);
      if (block && !Object.keys(groupedJson).some(key => {
        if (typeof groupedJson[key] === 'object' && groupedJson[key] !== null) {
          return JSON.stringify(groupedJson[key]).includes(block.promptFragment);
        }
        return false;
      })) {
        unmappedCategories.push(categoryId);
      }
    });
    
    if (unmappedCategories.length > 0) {
      groupedJson['_debug_unmapped_categories'] = unmappedCategories;
    }
    
    return JSON.stringify(groupedJson, null, 2);
  }, [gender, jewelryType, selections]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl p-4 sm:p-6 pb-12">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Settings className="h-6 w-6 text-white/60" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">🧪 Studio Lab</h1>
                <p className="text-sm text-white/60">
                  Experimental Prompt Builder - Context-Aware Blocks
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 text-sm">
              {gender && jewelryType && (
                <button
                  onClick={randomizeAll}
                  className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white/70 transition-colors hover:bg-white/20 hover:border-white/30"
                >
                  <Shuffle className="h-4 w-4" />
                  Random All
                </button>
              )}
              {(gender || jewelryType) && (
                <button
                  onClick={handleResetAll}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-red-400 transition-colors hover:bg-red-500/20 hover:border-red-500/50"
                >
                  Reset All
                </button>
              )}
              <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-2">
                <span className="text-white/60">Selections:</span>{' '}
                <span className="font-medium text-white">
                  {selectedCount}/{totalCategories}
                </span>
              </div>
            </div>
          </div>
          
            {/* MICRO Gender & Jewelry Type - Accordion */}
            <div className="rounded-xl border border-white/10 bg-black/30">
              <button
                onClick={() => setShowGenderJewelry(!showGenderJewelry)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-all rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-blue-400" />
                  <div className="text-left">
                    <h3 className="text-sm font-semibold text-white">Gender & Jewelry Type</h3>
                    <p className="text-xs text-white/50">
                      {gender ? `${gender === 'women' ? '👩 Women' : '👨 Men'}` : 'Not selected'}
                      {jewelryType && ` · ${jewelryType === 'ring' ? '💍 Ring' : jewelryType === 'necklace' ? '📿 Necklace' : jewelryType === 'earring' ? '💎 Earring' : '⌚ Bracelet'}`}
                    </p>
                  </div>
                </div>
                {showGenderJewelry ? <ChevronUp className="h-4 w-4 text-white/40" /> : <ChevronDown className="h-4 w-4 text-white/40" />}
              </button>
              
              {showGenderJewelry && (
                <div className="px-4 pb-4 space-y-3 border-t border-white/10 pt-3">
                  {/* Gender - Compact */}
                  <div>
                    <label className="block text-xs font-medium text-white/60 mb-2">Gender</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenderChange('women')}
                        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          gender === 'women'
                            ? 'border-white/40 bg-white/10 text-white'
                            : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        👩 Women
                      </button>
                      <button
                        onClick={() => handleGenderChange('men')}
                        className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          gender === 'men'
                            ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                            : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        👨 Men
                      </button>
                    </div>
                  </div>
                  
                  {/* Jewelry Type - Compact */}
                  {gender && (
                    <div>
                      <label className="block text-xs font-medium text-white/60 mb-2">Jewelry Type</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { value: 'ring', label: 'Ring', icon: '💍' },
                          { value: 'necklace', label: 'Necklace', icon: '📿' },
                          { value: 'earring', label: 'Earring', icon: '💎', disabled: false },
                          { value: 'bracelet', label: 'Bracelet', icon: '⌚', disabled: false },
                        ].map(type => (
                          <button
                            key={type.value}
                            onClick={() => !type.disabled && handleJewelryTypeChange(type.value as JewelryType)}
                            disabled={type.disabled}
                            className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs font-medium transition-all ${
                              type.disabled
                                ? 'border-white/10 bg-white/5 text-white/30 cursor-not-allowed'
                                : jewelryType === type.value
                                ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                                : 'border-white/20 bg-white/5 text-white/60 hover:border-blue-500/50 hover:text-white'
                            }`}
                          >
                            <span className="text-lg">{type.icon}</span>
                            <span>{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
        </div>

        {/* Block Selection - Always visible, some sections require gender/jewelry selection */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* Left: Block Selection */}
          <div className="space-y-8 w-full">
            {/* 1️⃣ UNIVERSAL FEATURES - Accordion (requires gender & jewelry) */}
            {gender && jewelryType && universalWomenCategories.length > 0 && (
              <div className={`rounded-2xl border-2 ${gender === 'women' ? 'border-white/20 bg-white/5' : 'border-white/20 bg-white/5'}`}>
                <button
                  onClick={() => setShowWomenFeatures(!showWomenFeatures)}
                  className={`w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all rounded-t-2xl`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/10`}>
                      <span className="text-2xl">{gender === 'women' ? '👩' : '👨'}</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-white">
                        Universal {gender === 'women' ? 'Women' : 'Men'} Features
                      </h2>
                      <p className="text-xs text-white/60">
                        Applies to all jewelry types · {universalWomenCategories.length} categories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        randomizeCategories(universalWomenCategories.map(c => c.id));
                      }}
                      className={`rounded-lg border border-white/20 bg-white/10 text-white/70 hover:bg-white/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5`}
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Random
                    </button>
                    {showWomenFeatures ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                  </div>
                </button>
                {showWomenFeatures && (
                  <div className={`p-5 pt-0 space-y-3 border-t border-white/10`}>
                    {universalWomenCategories.map(category => renderCategory(category))}
                  </div>
                )}
              </div>
            )}
            
              {/* 👗 STYLING - Accordion (requires gender & jewelry) */}
              {gender && jewelryType && stylingCategories.length > 0 && (
              <div className="rounded-2xl border-2 border-orange-500/30 bg-orange-500/5">
                <button
                  onClick={() => setShowStyling(!showStyling)}
                  className="w-full flex items-center justify-between p-5 hover:bg-orange-500/10 transition-all rounded-t-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/20">
                      <span className="text-2xl">👗</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-white">
                        Styling
                      </h2>
                      <p className="text-xs text-white/60">
                        Clothing, patterns, and colors · {stylingCategories.length} categories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        randomizeCategories(stylingCategories.map(c => c.id));
                      }}
                      className="rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Random
                    </button>
                    {showStyling ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                  </div>
                </button>
                {showStyling && (
                  <div className="p-5 pt-0 space-y-3 border-t border-orange-500/20">
                    {stylingCategories.map(category => renderCategory(category))}
                  </div>
                )}
              </div>
            )}
            
              {/* 📍 ENVIRONMENT - Accordion (requires gender & jewelry) */}
              {gender && jewelryType && environmentCategories.length > 0 && (
              <div className="rounded-2xl border-2 border-green-500/30 bg-green-500/5">
                <button
                  onClick={() => setShowEnvironment(!showEnvironment)}
                  className="w-full flex items-center justify-between p-5 hover:bg-green-500/10 transition-all rounded-t-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-white">
                        Environment
                      </h2>
                      <p className="text-xs text-white/60">
                        Location, background & lighting · {environmentCategories.length} categories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        randomizeCategories(environmentCategories.map(c => c.id));
                      }}
                      className="rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Random
                    </button>
                    {showEnvironment ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                  </div>
                </button>
                {showEnvironment && (
                  <div className="p-5 pt-0 space-y-3 border-t border-green-500/20">
                    {environmentCategories.map(category => renderCategory(category))}
                  </div>
                )}
              </div>
            )}
            
              {/* 📷 CAMERA - Accordion (requires gender & jewelry) */}
              {gender && jewelryType && cameraCategories.length > 0 && (
              <div className="rounded-2xl border-2 border-cyan-500/30 bg-cyan-500/5">
                <button
                  onClick={() => setShowCamera(!showCamera)}
                  className="w-full flex items-center justify-between p-5 hover:bg-cyan-500/10 transition-all rounded-t-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20">
                      <span className="text-2xl">📷</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-white">
                        Camera & Composition
                      </h2>
                      <p className="text-xs text-white/60">
                        Jewelry framing, viewing angle & focus · {cameraCategories.length} categories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        randomizeCategories(cameraCategories.map(c => c.id));
                      }}
                      className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Random
                    </button>
                    {showCamera ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                  </div>
                </button>
                {showCamera && (
                  <div className="p-5 pt-0 space-y-3 border-t border-cyan-500/20">
                    {cameraCategories.map(category => renderCategory(category))}
                  </div>
                )}
              </div>
            )}
            
              {/* ✨ POST-PRODUCTION - Accordion (requires gender & jewelry) */}
              {gender && jewelryType && postProductionCategories.length > 0 && (
              <div className="rounded-2xl border-2 border-pink-500/30 bg-pink-500/5">
                <button
                  onClick={() => setShowPostProduction(!showPostProduction)}
                  className="w-full flex items-center justify-between p-5 hover:bg-pink-500/10 transition-all rounded-t-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-white">
                        Post-Production
                      </h2>
                      <p className="text-xs text-white/60">
                        Processing level & color grading · {postProductionCategories.length} categories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        randomizeCategories(postProductionCategories.map(c => c.id));
                      }}
                      className="rounded-lg border border-pink-500/30 bg-pink-500/10 text-pink-400 hover:bg-pink-500/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Random
                    </button>
                    {showPostProduction ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                  </div>
                </button>
                {showPostProduction && (
                  <div className="p-5 pt-0 space-y-3 border-t border-pink-500/20">
                    {postProductionCategories.map(category => renderCategory(category))}
                  </div>
                )}
              </div>
            )}
            
              {/* 🎯 CREATIVE DIRECTION - Accordion (requires gender & jewelry) */}
              {gender && jewelryType && creativeDirectionCategories.length > 0 && (
              <div className="rounded-2xl border-2 border-indigo-500/30 bg-indigo-500/5">
                <button
                  onClick={() => setShowCreativeDirection(!showCreativeDirection)}
                  className="w-full flex items-center justify-between p-5 hover:bg-indigo-500/10 transition-all rounded-t-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-white">
                        Creative Direction
                      </h2>
                      <p className="text-xs text-white/60">
                        Intent, mood & jewelry context · {creativeDirectionCategories.length} categories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        randomizeCategories(creativeDirectionCategories.map(c => c.id));
                      }}
                      className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Random
                    </button>
                    {showCreativeDirection ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                  </div>
                </button>
                {showCreativeDirection && (
                  <div className="p-5 pt-0 space-y-3 border-t border-indigo-500/20">
                    {creativeDirectionCategories.map(category => renderCategory(category))}
                  </div>
                )}
              </div>
            )}
            
              {/* 🌸 LIFESTYLE EXTRAS - Accordion (requires gender & jewelry) */}
              {gender && jewelryType && lifestyleExtrasCategories.length > 0 && (
              <div className="rounded-2xl border-2 border-rose-500/30 bg-rose-500/5">
                <button
                  onClick={() => setShowLifestyleExtras(!showLifestyleExtras)}
                  className="w-full flex items-center justify-between p-5 hover:bg-rose-500/10 transition-all rounded-t-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/20">
                      <span className="text-2xl">🌸</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-lg font-bold text-white">
                        Lifestyle Extras
                      </h2>
                      <p className="text-xs text-white/60">
                        Optional props & accessories · {lifestyleExtrasCategories.length} categories
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        randomizeCategories(lifestyleExtrasCategories.map(c => c.id));
                      }}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5"
                    >
                      <Shuffle className="h-3.5 w-3.5" />
                      Random
                    </button>
                    {showLifestyleExtras ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                  </div>
                </button>
                {showLifestyleExtras && (
                  <div className="p-5 pt-0 space-y-3 border-t border-rose-500/20">
                    {lifestyleExtrasCategories.map(category => renderCategory(category))}
                  </div>
                )}
              </div>
            )}
            
              {/* 🎭 FACE DETAILS - Accordion (requires gender & jewelry) */}
              {gender && jewelryType && conditionalFaceCategories.length > 0 && (
                <div className="rounded-2xl border-2 border-yellow-500/30 bg-yellow-500/5">
                  <button
                    onClick={() => {
                      setShowFaceDetailsSection(!showFaceDetailsSection);
                      if (!showFaceDetailsSection) setShowFaceDetails(true);
                    }}
                    className="w-full flex items-center justify-between p-5 hover:bg-yellow-500/10 transition-all rounded-t-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/20">
                        <span className="text-2xl">🎭</span>
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-bold text-white">
                          Face Details
                        </h2>
                        <p className="text-xs text-white/60">
                          Optional detailed face features · {conditionalFaceCategories.length} categories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          randomizeCategories(conditionalFaceCategories.map(c => c.id));
                        }}
                        className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5"
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                        Random
                      </button>
                      {showFaceDetailsSection ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                    </div>
                  </button>
                  {showFaceDetailsSection && (
                    <div className="p-5 pt-0 space-y-3 border-t border-yellow-500/20">
                      {conditionalFaceCategories.map(category => renderCategory(category))}
                    </div>
                  )}
                </div>
              )}
            
              {/* 2️⃣ JEWELRY-SPECIFIC FEATURES - Accordion (requires gender & jewelry) */}
              {gender && jewelryType && jewelrySpecificCategories.length > 0 && (
                <div className="rounded-2xl border-2 border-blue-500/30 bg-blue-500/5">
                  <button
                    onClick={() => setShowJewelrySpecific(!showJewelrySpecific)}
                    className="w-full flex items-center justify-between p-5 hover:bg-blue-500/10 transition-all rounded-t-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20">
                        <span className="text-2xl">
                          {jewelryType === 'ring' && '💍'}
                          {jewelryType === 'necklace' && '📿'}
                          {jewelryType === 'earring' && '💎'}
                          {jewelryType === 'bracelet' && '⌚'}
                        </span>
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-bold text-white">
                          {jewelryType.charAt(0).toUpperCase() + jewelryType.slice(1)}-Specific Features
                        </h2>
                        <p className="text-xs text-white/60">
                          Only for {jewelryType}s · {jewelrySpecificCategories.length} categories
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          randomizeCategories(jewelrySpecificCategories.map(c => c.id));
                        }}
                        className="rounded-lg border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-1.5 text-sm transition-colors flex items-center gap-1.5"
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                        Random
                      </button>
                      {showJewelrySpecific ? <ChevronUp className="h-5 w-5 text-white/40" /> : <ChevronDown className="h-5 w-5 text-white/40" />}
                    </div>
                  </button>
                  {showJewelrySpecific && (
                    <div className="p-5 pt-0 space-y-3 border-t border-blue-500/20">
                      {jewelrySpecificCategories.map(category => renderCategory(category))}
                    </div>
                  )}
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
                      ? 'bg-white/20 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  Prompt
                </button>
                <button
                  onClick={() => setShowJsonView(true)}
                  className={`flex items-center gap-1 rounded px-3 py-1 text-xs font-medium transition-colors ${
                    showJsonView
                      ? 'bg-white/20 text-white'
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
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
              <>
                <div className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
                  {/* JSON Header with Copy Button */}
                  <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
                    <div className="text-sm font-medium text-white/80">JSON Output</div>
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
                  
                  {/* JSON Content */}
                  <div className="p-4 max-h-[600px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-xs text-green-400 font-mono leading-relaxed">
                      {selectionsJson}
                    </pre>
                  </div>
                </div>
                
                {/* Generate Prompt Button in JSON View */}
                {selectedCount > 0 && (
                  <button
                    onClick={() => {
                      const allBlocks = BLOCK_REGISTRY.getBlocks({ gender: gender!, jewelryType: jewelryType! });
                      const prompt = buildPromptFromSelections(
                        { gender: gender!, jewelryType: jewelryType! },
                        selections,
                        allBlocks,
                        '9:16'
                      );
                      setGeneratedPrompt(prompt);
                    }}
                    className="w-full mt-4 rounded-lg bg-white/10 px-6 py-3 font-semibold text-white shadow-xl transition-all hover:bg-white/20 hover:shadow-2xl hover:shadow-white/20 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Zap className="h-5 w-5" />
                    Generate Full Prompt
                  </button>
                )}
              </>
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
                        <div className="font-medium text-white">
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
              <div className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">
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
                
                // Check if this block conflicts with selected clothing type
                const selectedClothingId = selections['clothing-type'];
                const selectedClothing = selectedClothingId ? BLOCK_REGISTRY.getBlock(selectedClothingId) : null;
                const isConflicting = selectedClothing?.conflictsWith?.includes(block.id) || false;
                const isDisabled = isConflicting && !isSelected;
                
                return (
                  <button
                    key={block.id}
                    onClick={() => !isDisabled && handleBlockSelect(category.id, block.id)}
                    disabled={isDisabled}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      isSelected
                        ? 'border-white/40 bg-white/10 shadow-lg shadow-white/10'
                        : isDisabled
                        ? 'border-red-500/20 bg-red-500/5 opacity-40 cursor-not-allowed'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      {block.icon && (
                        <span className="text-base">{block.icon}</span>
                      )}
                      <div className="text-xs font-medium">
                        {block.name}
                        {isDisabled && <span className="ml-1 text-red-400">⚠️</span>}
                      </div>
                    </div>
                    {block.description && (
                      <div className="text-[10px] text-white/60 leading-tight">
                        {block.description}
                      </div>
                    )}
                    {isDisabled && (
                      <div className="mt-1 text-[9px] text-red-400/80">
                        Conflicts with clothing
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


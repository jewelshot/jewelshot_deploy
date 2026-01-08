/**
 * DesignOfficeContent - Product Variation & Collection Generator
 * 
 * Features:
 * - Upload reference product
 * - Generate matching set pieces (ring, earring, necklace, bracelet)
 * - Create variations (with/without stones, different gems)
 * - Sketch to realistic product conversion
 * - Collection builder
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import {
  Upload,
  Sparkles,
  Briefcase,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  Diamond,
  Gem,
  CircleDot,
  Circle,
  Loader2,
  Download,
  RefreshCw,
  Trash2,
  Eye,
  Check,
  Palette,
  Pencil,
  Image as ImageIcon,
  Copy,
  Settings,
  Wand2,
  Layers,
  Grid3X3,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

// Types
type JewelryType = 'ring' | 'earring' | 'necklace' | 'bracelet' | 'pendant' | 'brooch';
type VariationType = 'set-piece' | 'stone-variant' | 'material-variant' | 'sketch-to-real';

interface GeneratedVariation {
  id: string;
  type: VariationType;
  jewelryType?: JewelryType;
  label: string;
  imageUrl: string;
  prompt: string;
  selected: boolean;
}

interface StoneOption {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
}

interface MaterialOption {
  id: string;
  name: string;
  color: string;
}

// Stone options
const STONE_OPTIONS: StoneOption[] = [
  { id: 'none', name: 'No Stone', color: '#6B7280', icon: <CircleDot className="h-4 w-4" /> },
  { id: 'diamond', name: 'Diamond', color: '#E5E7EB', icon: <Diamond className="h-4 w-4" /> },
  { id: 'ruby', name: 'Ruby', color: '#DC2626', icon: <Gem className="h-4 w-4" /> },
  { id: 'sapphire', name: 'Sapphire', color: '#2563EB', icon: <Gem className="h-4 w-4" /> },
  { id: 'emerald', name: 'Emerald', color: '#059669', icon: <Gem className="h-4 w-4" /> },
  { id: 'amethyst', name: 'Amethyst', color: '#7C3AED', icon: <Gem className="h-4 w-4" /> },
  { id: 'topaz', name: 'Topaz', color: '#F59E0B', icon: <Gem className="h-4 w-4" /> },
  { id: 'pearl', name: 'Pearl', color: '#FDF4E7', icon: <Circle className="h-4 w-4" /> },
];

// Material options
const MATERIAL_OPTIONS: MaterialOption[] = [
  { id: 'yellow-gold', name: 'Yellow Gold', color: '#D4AF37' },
  { id: 'white-gold', name: 'White Gold', color: '#E5E4E2' },
  { id: 'rose-gold', name: 'Rose Gold', color: '#B76E79' },
  { id: 'platinum', name: 'Platinum', color: '#E5E4E2' },
  { id: 'silver', name: 'Silver', color: '#C0C0C0' },
];

// Jewelry type icons
const JEWELRY_TYPES: { type: JewelryType; label: string; description: string }[] = [
  { type: 'ring', label: 'Ring', description: 'Finger ring variations' },
  { type: 'earring', label: 'Earrings', description: 'Matching earrings pair' },
  { type: 'necklace', label: 'Necklace', description: 'Necklace or chain' },
  { type: 'bracelet', label: 'Bracelet', description: 'Wrist bracelet' },
  { type: 'pendant', label: 'Pendant', description: 'Hanging pendant' },
  { type: 'brooch', label: 'Brooch', description: 'Decorative brooch' },
];

type ActiveMode = 'set-pieces' | 'variations' | 'sketch' | 'collection';

export default function DesignOfficeContent() {
  // Layout state
  const { leftOpen } = useSidebarStore();
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [activeMode, setActiveMode] = useState<ActiveMode>('set-pieces');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVariations, setGeneratedVariations] = useState<GeneratedVariation[]>([]);
  
  // Set Pieces mode state
  const [selectedJewelryTypes, setSelectedJewelryTypes] = useState<JewelryType[]>([]);
  
  // Variations mode state
  const [selectedStones, setSelectedStones] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  
  // Sketch mode state
  const [sketchStyle, setSketchStyle] = useState<'realistic' | 'studio' | 'lifestyle'>('realistic');

  // Mode config
  const modes = [
    { id: 'set-pieces' as const, label: 'Set Pieces', icon: Layers, description: 'Generate matching jewelry set' },
    { id: 'variations' as const, label: 'Variations', icon: Grid3X3, description: 'Stone & material variants' },
    { id: 'sketch' as const, label: 'Sketch to Real', icon: Pencil, description: 'Convert sketches to photos' },
    { id: 'collection' as const, label: 'Collection', icon: Briefcase, description: 'Build full collection' },
  ];

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      setSourceImage(event.target?.result as string);
      setIsUploading(false);
      setGeneratedVariations([]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  // Toggle jewelry type selection
  const toggleJewelryType = useCallback((type: JewelryType) => {
    setSelectedJewelryTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  // Toggle stone selection
  const toggleStone = useCallback((stoneId: string) => {
    setSelectedStones(prev =>
      prev.includes(stoneId) ? prev.filter(s => s !== stoneId) : [...prev, stoneId]
    );
  }, []);

  // Toggle material selection
  const toggleMaterial = useCallback((materialId: string) => {
    setSelectedMaterials(prev =>
      prev.includes(materialId) ? prev.filter(m => m !== materialId) : [...prev, materialId]
    );
  }, []);

  // Generate variations
  const handleGenerate = useCallback(async () => {
    if (!sourceImage) return;
    
    setIsGenerating(true);
    
    // Simulate generation - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockVariations: GeneratedVariation[] = [];
    
    if (activeMode === 'set-pieces') {
      selectedJewelryTypes.forEach((type, index) => {
        mockVariations.push({
          id: `set-${type}-${index}`,
          type: 'set-piece',
          jewelryType: type,
          label: JEWELRY_TYPES.find(j => j.type === type)?.label || type,
          imageUrl: sourceImage, // In real app, this would be generated image
          prompt: `Matching ${type} in the same style`,
          selected: false,
        });
      });
    } else if (activeMode === 'variations') {
      selectedStones.forEach((stoneId, index) => {
        const stone = STONE_OPTIONS.find(s => s.id === stoneId);
        mockVariations.push({
          id: `stone-${stoneId}-${index}`,
          type: 'stone-variant',
          label: stone?.name || stoneId,
          imageUrl: sourceImage,
          prompt: `Same design with ${stone?.name}`,
          selected: false,
        });
      });
      selectedMaterials.forEach((materialId, index) => {
        const material = MATERIAL_OPTIONS.find(m => m.id === materialId);
        mockVariations.push({
          id: `material-${materialId}-${index}`,
          type: 'material-variant',
          label: material?.name || materialId,
          imageUrl: sourceImage,
          prompt: `Same design in ${material?.name}`,
          selected: false,
        });
      });
    } else if (activeMode === 'sketch') {
      mockVariations.push({
        id: 'sketch-real-1',
        type: 'sketch-to-real',
        label: `${sketchStyle.charAt(0).toUpperCase() + sketchStyle.slice(1)} Photo`,
        imageUrl: sourceImage,
        prompt: `Realistic ${sketchStyle} jewelry photo from sketch`,
        selected: false,
      });
    }
    
    setGeneratedVariations(mockVariations);
    setIsGenerating(false);
  }, [sourceImage, activeMode, selectedJewelryTypes, selectedStones, selectedMaterials, sketchStyle]);

  // Toggle variation selection
  const toggleVariationSelection = useCallback((id: string) => {
    setGeneratedVariations(prev =>
      prev.map(v => v.id === id ? { ...v, selected: !v.selected } : v)
    );
  }, []);

  // Clear source
  const clearSource = useCallback(() => {
    setSourceImage(null);
    setGeneratedVariations([]);
    setSelectedJewelryTypes([]);
    setSelectedStones([]);
    setSelectedMaterials([]);
  }, []);

  // Get selected count
  const selectedCount = generatedVariations.filter(v => v.selected).length;

  return (
    <div 
      className="fixed inset-0 flex flex-col"
      style={{
        left: leftOpen ? '256px' : '0',
        transition: 'left 500ms ease-in-out',
      }}
    >
      {/* Top Bar */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-black/40 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-white/60" />
          <h1 className="text-sm font-medium text-white/80">Design Office</h1>
        </div>

        {/* Mode Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {modes.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveMode(id)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-all ${
                activeMode === id
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <span className="rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
              {selectedCount} selected
            </span>
          )}
          <button 
            className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10"
            disabled={selectedCount === 0}
          >
            <Download className="h-3 w-3" />
            Export
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Canvas Area - Source + Generated Results */}
        <div className="flex flex-1 overflow-hidden">
          {/* Source Image Section */}
          <div className="flex w-64 flex-shrink-0 flex-col border-r border-white/10 p-4">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
              Reference Product
            </h3>
            {sourceImage ? (
              <div className="group relative overflow-hidden rounded-xl border border-white/10">
                <img 
                  src={sourceImage} 
                  alt="Source" 
                  className="aspect-square w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-white/20"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={clearSource}
                    className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-white/20 hover:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-white/5 transition-colors hover:border-white/30 hover:bg-white/10"
              >
                {isUploading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-white/40" />
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-white/30" />
                    <span className="mt-2 text-sm text-white/40">Upload Image</span>
                    <span className="mt-1 text-xs text-white/30">or sketch</span>
                  </>
                )}
              </button>
            )}

            {/* Generate Button */}
            {sourceImage && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || (
                  activeMode === 'set-pieces' && selectedJewelryTypes.length === 0
                ) || (
                  activeMode === 'variations' && selectedStones.length === 0 && selectedMaterials.length === 0
                )}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 py-2.5 text-sm font-medium text-white hover:from-purple-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate
                  </>
                )}
              </button>
            )}
          </div>

          {/* Generated Results Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {generatedVariations.length > 0 ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-sm font-medium text-white/80">
                    Generated {activeMode === 'set-pieces' ? 'Set Pieces' : 
                              activeMode === 'variations' ? 'Variations' :
                              activeMode === 'sketch' ? 'Photos' : 'Collection'} 
                    <span className="ml-2 text-white/40">({generatedVariations.length})</span>
                  </h2>
                  <button
                    onClick={() => setGeneratedVariations([])}
                    className="text-xs text-white/40 hover:text-white/60"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {generatedVariations.map((variation) => (
                    <div
                      key={variation.id}
                      onClick={() => toggleVariationSelection(variation.id)}
                      className={`group cursor-pointer overflow-hidden rounded-xl border transition-all ${
                        variation.selected
                          ? 'border-purple-500/50 bg-purple-500/10 ring-2 ring-purple-500/30'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <img 
                          src={variation.imageUrl} 
                          alt={variation.label}
                          className="h-full w-full object-cover"
                        />
                        {variation.selected && (
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                          <button className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-white/20">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-white/20">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="rounded-lg bg-white/10 p-2 text-white/70 hover:bg-white/20">
                            <RefreshCw className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2">
                          <span className={`rounded px-1.5 py-0.5 text-[10px] ${
                            variation.type === 'set-piece' ? 'bg-blue-500/20 text-blue-300' :
                            variation.type === 'stone-variant' ? 'bg-pink-500/20 text-pink-300' :
                            variation.type === 'material-variant' ? 'bg-amber-500/20 text-amber-300' :
                            'bg-green-500/20 text-green-300'
                          }`}>
                            {variation.type === 'set-piece' ? 'Set' :
                             variation.type === 'stone-variant' ? 'Stone' :
                             variation.type === 'material-variant' ? 'Material' : 'Photo'}
                          </span>
                          <span className="text-sm font-medium text-white/80">{variation.label}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-full flex-col items-center justify-center">
                <div className="mb-4 rounded-full bg-white/5 p-6">
                  <Wand2 className="h-12 w-12 text-white/20" />
                </div>
                <h2 className="text-lg font-medium text-white/60">No Generations Yet</h2>
                <p className="mt-2 max-w-md text-center text-sm text-white/40">
                  {!sourceImage 
                    ? 'Upload a reference product image to get started'
                    : activeMode === 'set-pieces'
                      ? 'Select jewelry types from the right panel and click Generate'
                      : activeMode === 'variations'
                        ? 'Select stones or materials from the right panel and click Generate'
                        : activeMode === 'sketch'
                          ? 'Choose an output style and click Generate to convert your sketch'
                          : 'Configure your collection options and click Generate'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Settings */}
        <div 
          className={`relative flex flex-col border-l border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
            isPanelOpen ? 'w-80' : 'w-0'
          }`}
        >
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute -left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white/60 hover:text-white"
          >
            {isPanelOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>

          {isPanelOpen && (
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              {/* Mode-specific Settings */}
              {/* Set Pieces Mode */}
              {activeMode === 'set-pieces' && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                    Generate Set Pieces
                  </h3>
                  <p className="mb-3 text-xs text-white/40">
                    Select jewelry types to generate matching pieces
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {JEWELRY_TYPES.map(({ type, label, description }) => (
                      <button
                        key={type}
                        onClick={() => toggleJewelryType(type)}
                        className={`rounded-lg border p-3 text-left transition-all ${
                          selectedJewelryTypes.includes(type)
                            ? 'border-purple-500/50 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-sm font-medium text-white/80">{label}</span>
                        <p className="mt-0.5 text-[10px] text-white/40">{description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Variations Mode */}
              {activeMode === 'variations' && (
                <>
                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                      Stone Variants
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {STONE_OPTIONS.map((stone) => (
                        <button
                          key={stone.id}
                          onClick={() => toggleStone(stone.id)}
                          className={`flex flex-col items-center rounded-lg border p-2 transition-all ${
                            selectedStones.includes(stone.id)
                              ? 'border-purple-500/50 bg-purple-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                          title={stone.name}
                        >
                          <div 
                            className="mb-1 flex h-6 w-6 items-center justify-center rounded-full"
                            style={{ backgroundColor: stone.color + '30', color: stone.color }}
                          >
                            {stone.icon}
                          </div>
                          <span className="text-[9px] text-white/60 truncate w-full text-center">{stone.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                      Material Variants
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {MATERIAL_OPTIONS.map((material) => (
                        <button
                          key={material.id}
                          onClick={() => toggleMaterial(material.id)}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
                            selectedMaterials.includes(material.id)
                              ? 'border-purple-500/50 bg-purple-500/10'
                              : 'border-white/10 bg-white/5 hover:border-white/20'
                          }`}
                        >
                          <div 
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: material.color }}
                          />
                          <span className="text-xs text-white/70">{material.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Sketch Mode */}
              {activeMode === 'sketch' && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                    Output Style
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: 'realistic', label: 'Realistic Photo', description: 'High-fidelity product shot' },
                      { id: 'studio', label: 'Studio Shot', description: 'Professional white background' },
                      { id: 'lifestyle', label: 'Lifestyle', description: 'On model or in context' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        onClick={() => setSketchStyle(style.id as typeof sketchStyle)}
                        className={`w-full rounded-lg border p-3 text-left transition-all ${
                          sketchStyle === style.id
                            ? 'border-purple-500/50 bg-purple-500/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                      >
                        <span className="text-sm font-medium text-white/80">{style.label}</span>
                        <p className="mt-0.5 text-xs text-white/40">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Collection Mode */}
              {activeMode === 'collection' && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                    Build Collection
                  </h3>
                  <p className="mb-3 text-xs text-white/40">
                    Generate a complete jewelry collection from your reference piece
                  </p>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                      <span className="text-sm text-white/70">Include all set pieces</span>
                      <input type="checkbox" className="accent-purple-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                      <span className="text-sm text-white/70">Stone variations</span>
                      <input type="checkbox" className="accent-purple-500" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                      <span className="text-sm text-white/70">Material variations</span>
                      <input type="checkbox" className="accent-purple-500" />
                    </label>
                  </div>
                </div>
              )}

              {/* Quick Guide */}
              <div className="mt-auto">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Quick Guide
                </h3>
                <div className="space-y-2">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3 w-3 text-blue-400" />
                      <span className="text-xs text-white/60">Set Pieces - Generate matching jewelry</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                    <div className="flex items-center gap-2">
                      <Grid3X3 className="h-3 w-3 text-pink-400" />
                      <span className="text-xs text-white/60">Variations - Stone & material changes</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                    <div className="flex items-center gap-2">
                      <Pencil className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-white/60">Sketch to Real - Convert drawings</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}

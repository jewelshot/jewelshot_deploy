/**
 * BrandLabContent - Brand Identity Management
 * 
 * Features:
 * - Brand Colors palette management with color extraction
 * - Style library with reference images
 * - Logo upload and variants
 * - Color theory-based palette generation
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Upload,
  Plus,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  Type,
  Layers,
  Download,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  Edit3,
  Save,
  FlaskConical,
  Wand2,
  Loader2,
  Eye,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { ColorPicker } from '@/components/molecules/ColorPicker';
import {
  extractColorsFromImages,
  generateComplementary,
  generateAnalogous,
  generateTriadic,
  generateSplitComplementary,
  getColorName,
  type ExtractedColor,
  type ColorPalette,
} from '@/lib/color-extractor';

// Types
interface BrandColor {
  id: string;
  name: string;
  hex: string;
  usage: string;
}

interface LogoVariant {
  id: string;
  name: string;
  url: string;
  type: 'primary' | 'secondary' | 'icon' | 'wordmark';
}

interface FontStyle {
  id: string;
  name: string;
  family: string;
  weight: string;
  usage: string;
}

interface StylePreset {
  id: string;
  name: string;
  description: string;
  images: string[]; // Reference image URLs
  createdAt: Date;
  tags: string[];
  colorPalette?: ExtractedColor[]; // Extracted colors from images
}

type ActiveTab = 'styles' | 'colors' | 'logos' | 'typography' | 'assets';

export default function BrandLabContent() {
  // Layout state
  const { leftOpen } = useSidebarStore();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('styles');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  
  // Style Library state
  const [stylePresets, setStylePresets] = useState<StylePreset[]>([]);
  const [isCreatingStyle, setIsCreatingStyle] = useState(false);
  const [newStyleName, setNewStyleName] = useState('');
  const [newStyleDescription, setNewStyleDescription] = useState('');
  const [newStyleImages, setNewStyleImages] = useState<string[]>([]);
  const [newStyleTags, setNewStyleTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset | null>(null);
  const [isStyleDetailOpen, setIsStyleDetailOpen] = useState(false);
  const [isEditingStyle, setIsEditingStyle] = useState(false);
  const [editStyleName, setEditStyleName] = useState('');
  const [editStyleDescription, setEditStyleDescription] = useState('');
  const styleImageInputRef = useRef<HTMLInputElement>(null);
  const editImageInputRef = useRef<HTMLInputElement>(null);
  
  // Color extraction state
  const [isExtractingColors, setIsExtractingColors] = useState(false);
  const [extractedColors, setExtractedColors] = useState<ExtractedColor[]>([]);
  const [colorPalettes, setColorPalettes] = useState<ColorPalette[]>([]);
  const [selectedPaletteType, setSelectedPaletteType] = useState<'extracted' | 'complementary' | 'analogous' | 'triadic' | 'split-complementary'>('extracted');
  
  // Brand Colors state
  const [brandColors, setBrandColors] = useState<BrandColor[]>([
    { id: '1', name: 'Primary Gold', hex: '#D4AF37', usage: 'Main brand color, CTAs' },
    { id: '2', name: 'Dark Background', hex: '#0A0A0A', usage: 'Backgrounds, cards' },
    { id: '3', name: 'Light Text', hex: '#FFFFFF', usage: 'Primary text, headings' },
    { id: '4', name: 'Muted Text', hex: '#9CA3AF', usage: 'Secondary text, labels' },
    { id: '5', name: 'Accent Purple', hex: '#8B5CF6', usage: 'Highlights, accents' },
  ]);
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#000000');
  const [newColorUsage, setNewColorUsage] = useState('');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  // Logo state
  const [logos, setLogos] = useState<LogoVariant[]>([]);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  // Typography state
  const [fonts, setFonts] = useState<FontStyle[]>([
    { id: '1', name: 'Heading', family: 'Inter', weight: '700', usage: 'Page titles, section headers' },
    { id: '2', name: 'Body', family: 'Inter', weight: '400', usage: 'Paragraphs, descriptions' },
    { id: '3', name: 'Accent', family: 'Space Grotesk', weight: '500', usage: 'Buttons, labels' },
  ]);

  // Color functions
  const addColor = useCallback(() => {
    if (!newColorName.trim()) return;
    
    const newColor: BrandColor = {
      id: `color-${Date.now()}`,
      name: newColorName,
      hex: newColorHex,
      usage: newColorUsage,
    };
    
    setBrandColors(prev => [...prev, newColor]);
    setNewColorName('');
    setNewColorHex('#000000');
    setNewColorUsage('');
  }, [newColorName, newColorHex, newColorUsage]);

  const removeColor = useCallback((id: string) => {
    setBrandColors(prev => prev.filter(c => c.id !== id));
  }, []);

  const copyColor = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  }, []);

  // Logo functions
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newLogo: LogoVariant = {
        id: `logo-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: event.target?.result as string,
        type: 'primary',
      };
      setLogos(prev => [...prev, newLogo]);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const removeLogo = useCallback((id: string) => {
    setLogos(prev => prev.filter(l => l.id !== id));
  }, []);

  // Style Library functions
  const handleStyleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewStyleImages(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  }, []);

  const removeStyleImage = useCallback((index: number) => {
    setNewStyleImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addTag = useCallback(() => {
    if (tagInput.trim() && !newStyleTags.includes(tagInput.trim())) {
      setNewStyleTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }, [tagInput, newStyleTags]);

  const removeTag = useCallback((tag: string) => {
    setNewStyleTags(prev => prev.filter(t => t !== tag));
  }, []);

  const saveStylePreset = useCallback(async () => {
    if (!newStyleName.trim() || newStyleImages.length === 0) return;

    setIsExtractingColors(true);

    try {
      // Extract colors from uploaded images
      const colors = await extractColorsFromImages(newStyleImages, 5);

      const newPreset: StylePreset = {
        id: `style-${Date.now()}`,
        name: newStyleName,
        description: newStyleDescription,
        images: newStyleImages,
        createdAt: new Date(),
        tags: newStyleTags,
        colorPalette: colors,
      };

      setStylePresets(prev => [...prev, newPreset]);
      
      // Also add extracted palette to color palettes
      if (colors.length > 0) {
        const newPalette: ColorPalette = {
          id: `palette-${Date.now()}`,
          name: `${newStyleName} Colors`,
          colors: colors,
          type: 'extracted',
          sourceStyleId: newPreset.id,
        };
        setColorPalettes(prev => [...prev, newPalette]);
      }
      
      // Reset form
      setNewStyleName('');
      setNewStyleDescription('');
      setNewStyleImages([]);
      setNewStyleTags([]);
      setIsCreatingStyle(false);
    } catch (error) {
      console.error('Failed to extract colors:', error);
    } finally {
      setIsExtractingColors(false);
    }
  }, [newStyleName, newStyleDescription, newStyleImages, newStyleTags]);

  // Open style detail modal
  const openStyleDetail = useCallback((style: StylePreset) => {
    setSelectedStyle(style);
    setEditStyleName(style.name);
    setEditStyleDescription(style.description);
    setIsStyleDetailOpen(true);
    setIsEditingStyle(false);
  }, []);

  // Add image to existing style
  const handleEditImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedStyle) return;
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = (event) => {
          newImages.push(event.target?.result as string);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    // Update style with new images
    const updatedImages = [...selectedStyle.images, ...newImages].slice(0, 10);
    
    // Re-extract colors
    setIsExtractingColors(true);
    try {
      const colors = await extractColorsFromImages(updatedImages, 5);
      
      setStylePresets(prev => prev.map(s => 
        s.id === selectedStyle.id 
          ? { ...s, images: updatedImages, colorPalette: colors }
          : s
      ));
      
      setSelectedStyle(prev => prev ? { ...prev, images: updatedImages, colorPalette: colors } : null);
      
      // Update corresponding palette
      setColorPalettes(prev => prev.map(p =>
        p.sourceStyleId === selectedStyle.id
          ? { ...p, colors }
          : p
      ));
    } catch (error) {
      console.error('Failed to re-extract colors:', error);
    } finally {
      setIsExtractingColors(false);
    }

    e.target.value = '';
  }, [selectedStyle]);

  // Remove image from style
  const removeImageFromStyle = useCallback(async (index: number) => {
    if (!selectedStyle) return;
    
    const updatedImages = selectedStyle.images.filter((_, i) => i !== index);
    
    if (updatedImages.length < 1) return; // Keep at least 1 image
    
    // Re-extract colors
    setIsExtractingColors(true);
    try {
      const colors = await extractColorsFromImages(updatedImages, 5);
      
      setStylePresets(prev => prev.map(s => 
        s.id === selectedStyle.id 
          ? { ...s, images: updatedImages, colorPalette: colors }
          : s
      ));
      
      setSelectedStyle(prev => prev ? { ...prev, images: updatedImages, colorPalette: colors } : null);
      
      // Update corresponding palette
      setColorPalettes(prev => prev.map(p =>
        p.sourceStyleId === selectedStyle.id
          ? { ...p, colors }
          : p
      ));
    } catch (error) {
      console.error('Failed to re-extract colors:', error);
    } finally {
      setIsExtractingColors(false);
    }
  }, [selectedStyle]);

  // Save style edits
  const saveStyleEdits = useCallback(() => {
    if (!selectedStyle) return;
    
    setStylePresets(prev => prev.map(s => 
      s.id === selectedStyle.id 
        ? { ...s, name: editStyleName, description: editStyleDescription }
        : s
    ));
    
    // Update palette name too
    setColorPalettes(prev => prev.map(p =>
      p.sourceStyleId === selectedStyle.id
        ? { ...p, name: `${editStyleName} Colors` }
        : p
    ));
    
    setSelectedStyle(prev => prev ? { ...prev, name: editStyleName, description: editStyleDescription } : null);
    setIsEditingStyle(false);
  }, [selectedStyle, editStyleName, editStyleDescription]);

  // Generate color schemes from selected style
  const generateColorScheme = useCallback((type: 'complementary' | 'analogous' | 'triadic' | 'split-complementary') => {
    if (!selectedStyle?.colorPalette?.length) return;
    
    const baseColor = selectedStyle.colorPalette[0];
    let colors: ExtractedColor[];
    
    switch (type) {
      case 'complementary':
        colors = generateComplementary(baseColor);
        break;
      case 'analogous':
        colors = generateAnalogous(baseColor);
        break;
      case 'triadic':
        colors = generateTriadic(baseColor);
        break;
      case 'split-complementary':
        colors = generateSplitComplementary(baseColor);
        break;
    }
    
    const newPalette: ColorPalette = {
      id: `palette-${Date.now()}`,
      name: `${selectedStyle.name} - ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      colors,
      type,
      sourceStyleId: selectedStyle.id,
    };
    
    setColorPalettes(prev => [...prev, newPalette]);
  }, [selectedStyle]);

  const deleteStylePreset = useCallback((id: string) => {
    setStylePresets(prev => prev.filter(s => s.id !== id));
    if (selectedStyle?.id === id) setSelectedStyle(null);
  }, [selectedStyle]);

  // Tab icons
  const tabConfig = [
    { id: 'styles' as const, label: 'My Styles', icon: Wand2 },
    { id: 'colors' as const, label: 'Colors', icon: Palette },
    { id: 'logos' as const, label: 'Logos', icon: ImageIcon },
    { id: 'typography' as const, label: 'Typography', icon: Type },
    { id: 'assets' as const, label: 'Assets', icon: Layers },
  ];

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
          <FlaskConical className="h-5 w-5 text-white/60" />
          <h1 className="text-sm font-medium text-white/80">Brand Lab</h1>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          {tabConfig.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-all ${
                activeTab === id
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="w-32" /> {/* Spacer for balance */}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Styles Tab */}
          {activeTab === 'styles' && (
            <div className="mx-auto max-w-5xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-white/90">Style Library</h2>
                  <p className="mt-1 text-sm text-white/50">
                    Create custom styles from reference images to use in your generations
                  </p>
                </div>
                {!isCreatingStyle && (
                  <button
                    onClick={() => setIsCreatingStyle(true)}
                    className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600"
                  >
                    <Plus className="h-4 w-4" />
                    Create Style
                  </button>
                )}
              </div>

              {/* Create New Style Form */}
              {isCreatingStyle && (
                <div className="mb-8 rounded-xl border border-purple-500/30 bg-purple-500/5 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white/80">Create New Style</h3>
                    <button
                      onClick={() => {
                        setIsCreatingStyle(false);
                        setNewStyleName('');
                        setNewStyleDescription('');
                        setNewStyleImages([]);
                        setNewStyleTags([]);
                      }}
                      className="text-white/40 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Style Name */}
                  <div className="mb-4">
                    <label className="mb-1 block text-xs text-white/50">Style Name *</label>
                    <input
                      type="text"
                      value={newStyleName}
                      onChange={(e) => setNewStyleName(e.target.value)}
                      placeholder="e.g., Minimal Luxury, Dark Elegance..."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="mb-1 block text-xs text-white/50">Description</label>
                    <textarea
                      value={newStyleDescription}
                      onChange={(e) => setNewStyleDescription(e.target.value)}
                      placeholder="Describe this style's characteristics..."
                      className="h-20 w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/30"
                    />
                  </div>

                  {/* Reference Images */}
                  <div className="mb-4">
                    <label className="mb-2 block text-xs text-white/50">
                      Reference Images * (Upload 3-10 images that represent this style)
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {newStyleImages.map((img, index) => (
                        <div key={index} className="group relative aspect-square overflow-hidden rounded-lg">
                          <img src={img} alt="" className="h-full w-full object-cover" />
                          <button
                            onClick={() => removeStyleImage(index)}
                            className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white/60 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {newStyleImages.length < 10 && (
                        <button
                          onClick={() => styleImageInputRef.current?.click()}
                          className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10"
                        >
                          <Plus className="h-6 w-6 text-white/30" />
                        </button>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-white/30">
                      {newStyleImages.length}/10 images uploaded
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="mb-6">
                    <label className="mb-2 block text-xs text-white/50">Tags</label>
                    <div className="mb-2 flex flex-wrap gap-2">
                      {newStyleTags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-xs text-white/70"
                        >
                          {tag}
                          <button onClick={() => removeTag(tag)} className="text-white/40 hover:text-white">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        placeholder="Add tag..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white placeholder-white/30"
                      />
                      <button
                        onClick={addTag}
                        className="rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white/60 hover:bg-white/20"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setIsCreatingStyle(false)}
                      className="rounded-lg px-4 py-2 text-sm text-white/60 hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={saveStylePreset}
                      disabled={!newStyleName.trim() || newStyleImages.length < 3}
                      className="flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      Save Style
                    </button>
                  </div>
                </div>
              )}

              {/* Style Presets Grid */}
              {stylePresets.length === 0 && !isCreatingStyle ? (
                <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-16">
                  <Wand2 className="h-12 w-12 text-white/20" />
                  <h3 className="mt-4 text-lg font-medium text-white/60">Henüz Stil Yok</h3>
                  <p className="mt-2 text-sm text-white/40">
                    Referans görseller yükleyerek ilk stilinizi oluşturun
                  </p>
                  <button
                    onClick={() => setIsCreatingStyle(true)}
                    className="mt-4 flex items-center gap-2 rounded-lg bg-purple-500/20 px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/30"
                  >
                    <Plus className="h-4 w-4" />
                    İlk Stilinizi Oluşturun
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {stylePresets.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => openStyleDetail(style)}
                      className={`group cursor-pointer overflow-hidden rounded-xl border transition-all ${
                        selectedStyle?.id === style.id
                          ? 'border-purple-500/50 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      {/* Image Grid Preview */}
                      <div className="grid grid-cols-3 gap-0.5 p-0.5">
                        {style.images.slice(0, 3).map((img, i) => (
                          <div key={i} className="aspect-square overflow-hidden">
                            <img src={img} alt="" className="h-full w-full object-cover" />
                          </div>
                        ))}
                      </div>
                      
                      {/* Color Palette under style */}
                      {style.colorPalette && style.colorPalette.length > 0 && (
                        <div className="flex gap-0.5 px-0.5">
                          {style.colorPalette.slice(0, 5).map((color, i) => (
                            <div
                              key={i}
                              className="h-4 flex-1"
                              style={{ backgroundColor: color.hex }}
                              title={`${getColorName(color.hex)} - ${color.hex}`}
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="p-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-white/80">{style.name}</h3>
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openStyleDetail(style);
                              }}
                              className="rounded p-1 text-white/30 hover:bg-white/10 hover:text-white"
                              title="Detayları Gör"
                            >
                              <Eye className="h-3 w-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteStylePreset(style.id);
                              }}
                              className="rounded p-1 text-white/30 hover:bg-white/10 hover:text-red-400"
                              title="Sil"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        {style.description && (
                          <p className="mt-1 text-xs text-white/40 line-clamp-2">{style.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {style.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50">
                              {tag}
                            </span>
                          ))}
                          {style.tags.length > 3 && (
                            <span className="text-[10px] text-white/30">+{style.tags.length - 3}</span>
                          )}
                        </div>
                        <p className="mt-2 text-[10px] text-white/30">
                          {style.images.length} görsel • {style.colorPalette?.length || 0} renk
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Hidden file inputs */}
              <input
                ref={styleImageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleStyleImageUpload}
                className="hidden"
              />
              <input
                ref={editImageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleEditImageUpload}
                className="hidden"
              />

              {/* Style Detail Modal */}
              <AnimatePresence>
                {isStyleDetailOpen && selectedStyle && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsStyleDetailOpen(false)}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 20 }}
                      onClick={(e) => e.stopPropagation()}
                      className="mx-4 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-white/10 bg-[#1a1a1a]/95 shadow-2xl backdrop-blur-xl"
                    >
                      {/* Modal Header */}
                      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#1a1a1a]/95 p-4 backdrop-blur-xl">
                        <div className="flex-1">
                          {isEditingStyle ? (
                            <input
                              type="text"
                              value={editStyleName}
                              onChange={(e) => setEditStyleName(e.target.value)}
                              className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-1.5 text-lg font-medium text-white focus:border-purple-500/50 focus:outline-none"
                            />
                          ) : (
                            <h2 className="text-lg font-medium text-white">{selectedStyle.name}</h2>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isEditingStyle ? (
                            <>
                              <button
                                onClick={() => setIsEditingStyle(false)}
                                className="rounded-lg px-3 py-1.5 text-sm text-white/60 hover:bg-white/10"
                              >
                                İptal
                              </button>
                              <button
                                onClick={saveStyleEdits}
                                className="flex items-center gap-1 rounded-lg bg-purple-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-600"
                              >
                                <Save className="h-3.5 w-3.5" />
                                Kaydet
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => setIsEditingStyle(true)}
                              className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-sm text-white/70 hover:bg-white/20"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Düzenle
                            </button>
                          )}
                          <button
                            onClick={() => setIsStyleDetailOpen(false)}
                            className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Description */}
                        {isEditingStyle ? (
                          <textarea
                            value={editStyleDescription}
                            onChange={(e) => setEditStyleDescription(e.target.value)}
                            placeholder="Stil açıklaması..."
                            className="mb-6 h-20 w-full resize-none rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none"
                          />
                        ) : (
                          selectedStyle.description && (
                            <p className="mb-6 text-sm text-white/60">{selectedStyle.description}</p>
                          )
                        )}

                        {/* Images Section */}
                        <div className="mb-6">
                          <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-white/80">Referans Görseller</h3>
                            <button
                              onClick={() => editImageInputRef.current?.click()}
                              disabled={selectedStyle.images.length >= 10}
                              className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/20 disabled:opacity-50"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Görsel Ekle
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                            {selectedStyle.images.map((img, i) => (
                              <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-white/10">
                                <img src={img} alt="" className="h-full w-full object-cover" />
                                <button
                                  onClick={() => removeImageFromStyle(i)}
                                  disabled={selectedStyle.images.length <= 1}
                                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white/60 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100 disabled:hidden"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="mt-2 text-xs text-white/30">{selectedStyle.images.length}/10 görsel</p>
                        </div>

                        {/* Extracted Color Palette */}
                        <div className="mb-6">
                          <h3 className="mb-3 text-sm font-medium text-white/80">Çıkarılan Renkler</h3>
                          {isExtractingColors ? (
                            <div className="flex items-center gap-2 py-4">
                              <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                              <span className="text-sm text-white/50">Renkler çıkarılıyor...</span>
                            </div>
                          ) : selectedStyle.colorPalette && selectedStyle.colorPalette.length > 0 ? (
                            <div className="grid grid-cols-5 gap-3">
                              {selectedStyle.colorPalette.map((color, i) => (
                                <div key={i} className="overflow-hidden rounded-lg border border-white/10">
                                  <div className="h-16" style={{ backgroundColor: color.hex }} />
                                  <div className="bg-white/5 p-2">
                                    <p className="text-xs font-medium text-white/80">{getColorName(color.hex)}</p>
                                    <p className="font-mono text-[10px] text-white/40">{color.hex}</p>
                                    <p className="text-[10px] text-white/30">{color.percentage.toFixed(1)}%</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="py-4 text-sm text-white/40">Renk bulunamadı</p>
                          )}
                        </div>

                        {/* Color Scheme Generator */}
                        <div className="mb-6">
                          <h3 className="mb-3 text-sm font-medium text-white/80">Renk Şeması Oluştur</h3>
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => generateColorScheme('complementary')}
                              disabled={!selectedStyle.colorPalette?.length}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 disabled:opacity-50"
                            >
                              Tamamlayıcı
                            </button>
                            <button
                              onClick={() => generateColorScheme('analogous')}
                              disabled={!selectedStyle.colorPalette?.length}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 disabled:opacity-50"
                            >
                              Analog
                            </button>
                            <button
                              onClick={() => generateColorScheme('triadic')}
                              disabled={!selectedStyle.colorPalette?.length}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 disabled:opacity-50"
                            >
                              Triadik
                            </button>
                            <button
                              onClick={() => generateColorScheme('split-complementary')}
                              disabled={!selectedStyle.colorPalette?.length}
                              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 disabled:opacity-50"
                            >
                              Bölünmüş Tamamlayıcı
                            </button>
                          </div>
                        </div>

                        {/* Tags */}
                        <div>
                          <h3 className="mb-3 text-sm font-medium text-white/80">Etiketler</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedStyle.tags.map((tag) => (
                              <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">
                                {tag}
                              </span>
                            ))}
                            {selectedStyle.tags.length === 0 && (
                              <span className="text-xs text-white/40">Etiket yok</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* How it works */}
              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-sm font-medium text-white/80">How Style Library Works</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                      <Upload className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">1. Upload References</p>
                      <p className="text-xs text-white/40">Add 3-10 images that represent your desired style</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                      <Wand2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">2. AI Learns</p>
                      <p className="text-xs text-white/40">Our AI analyzes the visual patterns and aesthetics</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/70">3. Generate</p>
                      <p className="text-xs text-white/40">Use your style in Studio for consistent results</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <div className="mx-auto max-w-5xl">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-white/90">Marka Renkleri</h2>
                <p className="mt-1 text-sm text-white/50">
                  Stillerinizden çıkarılan ve manuel eklenen renk paletleri
                </p>
              </div>

              {/* Palettes from Styles */}
              {colorPalettes.length > 0 && (
                <div className="mb-8">
                  <h3 className="mb-4 text-sm font-medium text-white/70">Stil Paletleri</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    {colorPalettes.map((palette) => (
                      <div key={palette.id} className="overflow-hidden rounded-xl border border-white/10 bg-white/5">
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                          <div>
                            <h4 className="text-sm font-medium text-white/80">{palette.name}</h4>
                            <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white/50">
                              {palette.type}
                            </span>
                          </div>
                          <button
                            onClick={() => setColorPalettes(prev => prev.filter(p => p.id !== palette.id))}
                            className="rounded p-1 text-white/30 hover:bg-white/10 hover:text-red-400"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="flex">
                          {palette.colors.map((color, i) => (
                            <div
                              key={i}
                              className="group relative h-20 flex-1 cursor-pointer transition-all hover:flex-[1.5]"
                              style={{ backgroundColor: color.hex }}
                              onClick={() => copyColor(color.hex)}
                              title={`${getColorName(color.hex)} - ${color.hex}`}
                            >
                              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                                <p className="text-center font-mono text-[10px] text-white">{color.hex}</p>
                              </div>
                              {copiedColor === color.hex && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                  <Check className="h-5 w-5 text-green-400" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1 p-2">
                          {palette.colors.map((color, i) => (
                            <div key={i} className="flex-1 text-center">
                              <p className="text-[9px] text-white/50">{getColorName(color.hex)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual Colors */}
              <div className="mb-6">
                <h3 className="mb-4 text-sm font-medium text-white/70">Manuel Renkler</h3>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                  {brandColors.map((color) => (
                    <div
                      key={color.id}
                      className="group overflow-hidden rounded-xl border border-white/10 bg-white/5"
                    >
                      <div
                        className="h-20 w-full"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div className="p-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-medium text-white/80">{color.name}</span>
                          <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <ColorPicker
                              color={color.hex}
                              onChange={(hex) => {
                                setBrandColors(prev => prev.map(c => 
                                  c.id === color.id ? { ...c, hex } : c
                                ));
                              }}
                              size="sm"
                            />
                            <button
                              onClick={() => copyColor(color.hex)}
                              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                              title="Kopyala"
                            >
                              {copiedColor === color.hex ? (
                                <Check className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                            <button
                              onClick={() => removeColor(color.id)}
                              className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-red-400"
                              title="Kaldır"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 font-mono text-xs text-white/50">{color.hex}</p>
                        {color.usage && <p className="mt-1 text-xs text-white/40">{color.usage}</p>}
                      </div>
                    </div>
                  ))}

                  {/* Add New Color Card */}
                  <div className="flex flex-col overflow-hidden rounded-xl border border-dashed border-white/20 bg-white/5">
                    <div
                      className="relative h-20 w-full cursor-pointer"
                      style={{ backgroundColor: newColorHex }}
                    >
                      <div className="absolute right-2 top-2">
                        <ColorPicker
                          color={newColorHex}
                          onChange={setNewColorHex}
                          size="sm"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 p-3">
                      <input
                        type="text"
                        placeholder="Renk adı"
                        value={newColorName}
                        onChange={(e) => setNewColorName(e.target.value)}
                        className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white placeholder-white/30"
                      />
                      <input
                        type="text"
                        placeholder="Kullanım (opsiyonel)"
                        value={newColorUsage}
                        onChange={(e) => setNewColorUsage(e.target.value)}
                        className="rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white placeholder-white/30"
                      />
                      <button
                        onClick={addColor}
                        disabled={!newColorName.trim()}
                        className="flex items-center justify-center gap-1 rounded bg-purple-500/20 py-1.5 text-xs text-purple-300 hover:bg-purple-500/30 disabled:opacity-50"
                      >
                        <Plus className="h-3 w-3" />
                        Renk Ekle
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Empty state for palettes */}
              {colorPalettes.length === 0 && brandColors.length <= 5 && (
                <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-purple-400" />
                    <div>
                      <h3 className="text-sm font-medium text-white/80">Renk Paleti Oluşturun</h3>
                      <p className="text-xs text-white/40">
                        Styles sekmesinden yeni bir stil oluşturun. Yüklediğiniz görsellerden renkler otomatik çıkarılır.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logos Tab */}
          {activeTab === 'logos' && (
            <div className="mx-auto max-w-4xl">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-white/90">Logo Variants</h2>
                <p className="mt-1 text-sm text-white/50">
                  Upload and manage different versions of your logo
                </p>
              </div>

              {/* Logo Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {logos.map((logo) => (
                  <div
                    key={logo.id}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5"
                  >
                    <div className="flex h-32 items-center justify-center bg-[#1a1a1a] p-4">
                      <img src={logo.url} alt={logo.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="p-3">
                      <span className="text-sm font-medium text-white/80">{logo.name}</span>
                      <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-xs text-white/50">
                        {logo.type}
                      </span>
                    </div>
                    <button
                      onClick={() => removeLogo(logo.id)}
                      className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white/40 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {/* Upload New Logo */}
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="flex h-48 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/5 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  <Upload className="h-8 w-8 text-white/30" />
                  <span className="text-sm text-white/40">Upload Logo</span>
                  <span className="text-xs text-white/30">PNG, SVG, or JPG</span>
                </div>
              </div>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />

              {/* Logo Usage Guidelines */}
              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-sm font-medium text-white/80">Logo Usage Guidelines</h3>
                <div className="grid gap-4 text-xs text-white/50 md:grid-cols-2">
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3 w-3 text-green-400" />
                    <span>Use on dark backgrounds for best visibility</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="mt-0.5 h-3 w-3 text-green-400" />
                    <span>Maintain minimum clear space around logo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="mt-0.5 h-3 w-3 text-red-400" />
                    <span>Don&apos;t stretch or distort the logo</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <X className="mt-0.5 h-3 w-3 text-red-400" />
                    <span>Don&apos;t change logo colors</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <div className="mx-auto max-w-4xl">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-white/90">Typography</h2>
                <p className="mt-1 text-sm text-white/50">
                  Define your brand&apos;s font styles and usage
                </p>
              </div>

              {/* Font Styles */}
              <div className="flex flex-col gap-4">
                {fonts.map((font) => (
                  <div
                    key={font.id}
                    className="rounded-xl border border-white/10 bg-white/5 p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-white/40">{font.name}</span>
                        <p
                          className="mt-1 text-2xl text-white/90"
                          style={{ fontFamily: font.family, fontWeight: font.weight }}
                        >
                          {font.family} {font.weight}
                        </p>
                      </div>
                      <span className="text-xs text-white/40">{font.usage}</span>
                    </div>
                    <p
                      className="mt-4 text-white/60"
                      style={{ fontFamily: font.family, fontWeight: font.weight }}
                    >
                      The quick brown fox jumps over the lazy dog. 0123456789
                    </p>
                  </div>
                ))}
              </div>

              {/* Font Pairing Suggestions */}
              <div className="mt-8 rounded-xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  <div>
                    <h3 className="text-sm font-medium text-white/80">Font Pairing AI</h3>
                    <p className="text-xs text-white/40">Coming Soon - Get AI-powered font pairing suggestions</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Assets Tab */}
          {activeTab === 'assets' && (
            <div className="mx-auto max-w-4xl">
              <div className="mb-6">
                <h2 className="text-lg font-medium text-white/90">Asset Library</h2>
                <p className="mt-1 text-sm text-white/50">
                  Store and organize your brand assets
                </p>
              </div>

              {/* Coming Soon */}
              <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-16">
                <Layers className="h-12 w-12 text-white/20" />
                <h3 className="mt-4 text-lg font-medium text-white/60">Asset Library Coming Soon</h3>
                <p className="mt-2 text-sm text-white/40">
                  Upload and organize images, icons, patterns, and more
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Style Preview */}
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
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="mb-4 text-sm font-medium text-white/80">Style Preview</h3>
              
              {/* Color Preview */}
              <div className="mb-6">
                <p className="mb-2 text-xs text-white/50">Color Palette</p>
                <div className="flex gap-1">
                  {brandColors.slice(0, 5).map((color) => (
                    <div
                      key={color.id}
                      className="h-8 flex-1 rounded"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sample Card */}
              <div className="mb-6">
                <p className="mb-2 text-xs text-white/50">Sample Card</p>
                <div
                  className="rounded-xl p-4"
                  style={{ backgroundColor: brandColors[1]?.hex || '#0A0A0A' }}
                >
                  <h4
                    className="text-lg font-bold"
                    style={{ color: brandColors[2]?.hex || '#FFFFFF' }}
                  >
                    Product Title
                  </h4>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: brandColors[3]?.hex || '#9CA3AF' }}
                  >
                    Beautiful jewelry piece crafted with care
                  </p>
                  <button
                    className="mt-3 rounded-lg px-4 py-2 text-sm font-medium text-black"
                    style={{ backgroundColor: brandColors[0]?.hex || '#D4AF37' }}
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Export */}
              <div>
                <p className="mb-2 text-xs text-white/50">Export</p>
                <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-sm text-white/60 hover:bg-white/10">
                  <Download className="h-4 w-4" />
                  Export Style Guide
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


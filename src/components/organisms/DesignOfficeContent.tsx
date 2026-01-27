/**
 * DesignOfficeContent - Comprehensive Jewelry Design System
 * 
 * Features:
 * - Create from scratch with full parameter control
 * - Upload reference and generate variations
 * - Create matching sets (parure)
 * - All jewelry parameters: stones, metals, styles, profiles
 * - Shuffle and random generation
 */

'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Sparkles,
  Plus,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Loader2,
  Download,
  RefreshCw,
  Trash2,
  Eye,
  Shuffle,
  Dice5,
  Settings2,
  Palette,
  Gem,
  Circle,
  Square,
  Heart,
  Star,
  Wand2,
  Layers,
  Check,
  Copy,
  Save,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import {
  type DesignConfig,
  type DesignMode,
  type JewelryType,
  type StoneConfig,
  type MetalConfig,
  type StyleConfig,
  type RingConfig,
  type ChainConfig,
  type EarringConfig,
  type DetailConfig,
  type TargetConfig,
  type GeneratedDesign,
  type ParameterOption,
} from '@/lib/design-office/types';
import * as params from '@/lib/design-office/jewelry-parameters';
import { buildPrompt, generateRandomConfig, shuffleParameter } from '@/lib/design-office/prompt-builder';

// ============================================
// PARAMETER SECTION COMPONENT
// ============================================
interface ParamSectionProps {
  title: string;
  titleTr: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}

function ParamSection({ title, titleTr, isOpen, onToggle, children, badge }: ParamSectionProps) {
  return (
    <div className="border-b border-white/10">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white/80">{titleTr}</span>
          {badge && (
            <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] text-purple-300">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// OPTION GRID COMPONENT
// ============================================
interface OptionGridProps {
  options: ParameterOption[];
  selected?: string;
  onSelect: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  showIcon?: boolean;
  allowDeselect?: boolean;
}

function OptionGrid({ options, selected, onSelect, columns = 3, showIcon = false, allowDeselect = true }: OptionGridProps) {
  return (
    <div className={`grid gap-2 grid-cols-${columns}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => {
            if (allowDeselect && selected === opt.value) {
              onSelect('');
            } else {
              onSelect(opt.value);
            }
          }}
          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs transition-all ${
            selected === opt.value
              ? 'border-purple-500/50 bg-purple-500/20 text-white'
              : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/10'
          }`}
        >
          {showIcon && opt.icon && <span className="text-sm">{opt.icon}</span>}
          <span className="truncate">{opt.labelTr || opt.label}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function DesignOfficeContent() {
  const { leftOpen } = useSidebarStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ========== STATE ==========
  // Mode & Base
  const [mode, setMode] = useState<DesignMode>('create');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [sourceImageName, setSourceImageName] = useState<string>('');
  
  // Jewelry Type Modal (after upload)
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [uploadedImageTemp, setUploadedImageTemp] = useState<string | null>(null);
  
  // Design Config
  const [config, setConfig] = useState<Partial<DesignConfig>>({
    mode: 'create',
  });
  
  // UI State
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['type', 'stone', 'metal']));
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<GeneratedDesign[]>([]);
  const [selectedDesign, setSelectedDesign] = useState<GeneratedDesign | null>(null);
  const [variationCount, setVariationCount] = useState(4);
  
  // ========== HANDLERS ==========
  const toggleSection = (section: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };
  
  const updateConfig = useCallback(<K extends keyof DesignConfig>(key: K, value: DesignConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);
  
  const updateStoneConfig = useCallback(<K extends keyof StoneConfig>(key: K, value: StoneConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      stone: { ...prev.stone, [key]: value } as StoneConfig,
    }));
  }, []);
  
  const updateMetalConfig = useCallback(<K extends keyof MetalConfig>(key: K, value: MetalConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      metal: { ...prev.metal, [key]: value } as MetalConfig,
    }));
  }, []);
  
  const updateStyleConfig = useCallback(<K extends keyof StyleConfig>(key: K, value: StyleConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      style: { ...prev.style, [key]: value } as StyleConfig,
    }));
  }, []);
  
  const updateRingConfig = useCallback(<K extends keyof RingConfig>(key: K, value: RingConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      ring: { ...prev.ring, [key]: value } as RingConfig,
    }));
  }, []);
  
  const updateChainConfig = useCallback(<K extends keyof ChainConfig>(key: K, value: ChainConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      chain: { ...prev.chain, [key]: value } as ChainConfig,
    }));
  }, []);
  
  const updateEarringConfig = useCallback(<K extends keyof EarringConfig>(key: K, value: EarringConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      earring: { ...prev.earring, [key]: value } as EarringConfig,
    }));
  }, []);
  
  const updateDetailConfig = useCallback(<K extends keyof DetailConfig>(key: K, value: DetailConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      detail: { ...prev.detail, [key]: value } as DetailConfig,
    }));
  }, []);
  
  const updateTargetConfig = useCallback(<K extends keyof TargetConfig>(key: K, value: TargetConfig[K]) => {
    setConfig(prev => ({
      ...prev,
      target: { ...prev.target, [key]: value } as TargetConfig,
    }));
  }, []);
  
  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target?.result as string;
      setUploadedImageTemp(imageUrl);
      setSourceImageName(file.name);
      setShowTypeModal(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);
  
  // Confirm jewelry type after upload
  const handleConfirmType = useCallback((jewelryType: JewelryType, hasStones: boolean, stoneType?: string) => {
    setSourceImage(uploadedImageTemp);
    setConfig(prev => ({
      ...prev,
      mode: 'variation',
      jewelryType,
      stone: {
        hasStones,
        stoneType: stoneType as any,
      },
    }));
    setMode('variation');
    setShowTypeModal(false);
    setUploadedImageTemp(null);
  }, [uploadedImageTemp]);
  
  // Shuffle all parameters
  const handleShuffle = useCallback(() => {
    const randomConfig = generateRandomConfig(config.jewelryType);
    setConfig(prev => ({
      ...prev,
      ...randomConfig,
      mode: prev.mode,
      jewelryType: prev.jewelryType || randomConfig.jewelryType,
    }));
  }, [config.jewelryType]);
  
  // Generate designs
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const prompt = buildPrompt(config);
      console.log('Generated Prompt:', prompt);
      
      // Simulate API call - replace with actual AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock generated designs
      const mockDesigns: GeneratedDesign[] = Array.from({ length: variationCount }, (_, i) => ({
        id: `design-${Date.now()}-${i}`,
        imageUrl: `https://picsum.photos/seed/${Date.now() + i}/400/400`,
        prompt,
        config: config as DesignConfig,
        createdAt: new Date(),
      }));
      
      setGeneratedDesigns(prev => [...mockDesigns, ...prev]);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [config, variationCount]);
  
  // Clear source image
  const handleClearSource = useCallback(() => {
    setSourceImage(null);
    setSourceImageName('');
    setMode('create');
    setConfig(prev => ({ ...prev, mode: 'create' }));
  }, []);
  
  // Get current prompt preview
  const promptPreview = useMemo(() => {
    return buildPrompt(config);
  }, [config]);
  
  // Get subtype options based on jewelry type
  const subtypeOptions = useMemo(() => {
    if (!config.jewelryType) return [];
    return params.getSubtypeOptions(config.jewelryType);
  }, [config.jewelryType]);
  
  // Get specific motif options based on theme
  const specificMotifOptions = useMemo(() => {
    if (!config.style?.thematicMotif) return [];
    return params.getSpecificMotifs(config.style.thematicMotif);
  }, [config.style?.thematicMotif]);
  
  return (
    <div 
      className="fixed inset-0 flex"
      style={{
        left: leftOpen ? '256px' : '0',
        transition: 'left 500ms ease-in-out',
      }}
    >
      {/* ========== LEFT PANEL - PARAMETERS ========== */}
      <div className="flex w-80 flex-col border-r border-white/10 bg-black/40 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-purple-400" />
            <h1 className="text-sm font-medium text-white/90">Design Office</h1>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleShuffle}
              className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
              title="Rastgele Parametreler"
            >
              <Shuffle className="h-4 w-4" />
            </button>
            <button
              onClick={() => setConfig({ mode: 'create' })}
              className="rounded-lg p-2 text-white/40 hover:bg-white/10 hover:text-white"
              title="Temizle"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Mode Selector */}
        <div className="border-b border-white/10 p-4">
          <div className="mb-3 text-xs text-white/50">Mod</div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('create')}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                mode === 'create'
                  ? 'border-purple-500/50 bg-purple-500/20 text-white'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
              }`}
            >
              Sıfırdan Oluştur
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                mode === 'variation' || mode === 'set'
                  ? 'border-purple-500/50 bg-purple-500/20 text-white'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
              }`}
            >
              Görsel Yükle
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
        
        {/* Source Image Preview */}
        {sourceImage && (
          <div className="border-b border-white/10 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-white/50">Kaynak Görsel</span>
              <button
                onClick={handleClearSource}
                className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
            <div className="relative aspect-square overflow-hidden rounded-lg border border-white/10">
              <img src={sourceImage} alt="Source" className="h-full w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                <p className="truncate text-[10px] text-white/60">{sourceImageName}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Parameter Sections - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* Jewelry Type */}
          <ParamSection
            title="Jewelry Type"
            titleTr="Takı Türü"
            isOpen={openSections.has('type')}
            onToggle={() => toggleSection('type')}
            badge={config.jewelryType ? params.JEWELRY_TYPES.find(t => t.value === config.jewelryType)?.labelTr : undefined}
          >
            <OptionGrid
              options={params.JEWELRY_TYPES}
              selected={config.jewelryType}
              onSelect={(v) => updateConfig('jewelryType', v as JewelryType)}
              columns={3}
              showIcon
            />
            
            {/* Subtype */}
            {subtypeOptions.length > 0 && (
              <div className="mt-3">
                <div className="mb-2 text-[10px] text-white/40">Alt Tür</div>
                <OptionGrid
                  options={subtypeOptions}
                  selected={config.subType}
                  onSelect={(v) => updateConfig('subType', v)}
                  columns={2}
                />
              </div>
            )}
          </ParamSection>
          
          {/* Stone Parameters */}
          <ParamSection
            title="Stones"
            titleTr="Taş Ayarları"
            isOpen={openSections.has('stone')}
            onToggle={() => toggleSection('stone')}
            badge={config.stone?.hasStones ? (config.stone.stoneType ? params.STONE_TYPES.find(s => s.value === config.stone?.stoneType)?.labelTr : 'Taşlı') : 'Taşsız'}
          >
            {/* Has Stones Toggle */}
            <div className="mb-4 flex gap-2">
              <button
                onClick={() => updateStoneConfig('hasStones', true)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                  config.stone?.hasStones
                    ? 'border-green-500/50 bg-green-500/20 text-green-300'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                Taşlı
              </button>
              <button
                onClick={() => updateStoneConfig('hasStones', false)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium ${
                  config.stone?.hasStones === false
                    ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                Taşsız
              </button>
            </div>
            
            {config.stone?.hasStones !== false && (
              <>
                {/* Stone Type */}
                <div className="mb-3">
                  <div className="mb-2 text-[10px] text-white/40">Taş Türü</div>
                  <OptionGrid
                    options={params.STONE_TYPES}
                    selected={config.stone?.stoneType}
                    onSelect={(v) => updateStoneConfig('stoneType', v as any)}
                    columns={3}
                    showIcon
                  />
                </div>
                
                {/* Diamond Cut */}
                {(config.stone?.stoneType === 'diamond' || config.stone?.stoneType === 'zircon') && (
                  <div className="mb-3">
                    <div className="mb-2 text-[10px] text-white/40">Kesim</div>
                    <OptionGrid
                      options={params.DIAMOND_CUTS}
                      selected={config.stone?.cut}
                      onSelect={(v) => updateStoneConfig('cut', v as any)}
                      columns={3}
                    />
                  </div>
                )}
                
                {/* Setting Type */}
                <div className="mb-3">
                  <div className="mb-2 text-[10px] text-white/40">Mıhlama Tipi</div>
                  <OptionGrid
                    options={params.SETTING_TYPES}
                    selected={config.stone?.setting}
                    onSelect={(v) => updateStoneConfig('setting', v as any)}
                    columns={2}
                  />
                </div>
                
                {/* Arrangement */}
                <div className="mb-3">
                  <div className="mb-2 text-[10px] text-white/40">Taş Düzeni</div>
                  <OptionGrid
                    options={params.STONE_ARRANGEMENTS}
                    selected={config.stone?.arrangement}
                    onSelect={(v) => updateStoneConfig('arrangement', v as any)}
                    columns={2}
                  />
                </div>
                
                {/* Stone Count & Size */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="mb-2 text-[10px] text-white/40">Taş Sayısı</div>
                    <OptionGrid
                      options={params.STONE_COUNTS}
                      selected={config.stone?.stoneCount as string}
                      onSelect={(v) => updateStoneConfig('stoneCount', v as any)}
                      columns={1}
                    />
                  </div>
                  <div>
                    <div className="mb-2 text-[10px] text-white/40">Taş Boyutu</div>
                    <OptionGrid
                      options={params.STONE_SIZES}
                      selected={config.stone?.stoneSize}
                      onSelect={(v) => updateStoneConfig('stoneSize', v as any)}
                      columns={1}
                    />
                  </div>
                </div>
              </>
            )}
          </ParamSection>
          
          {/* Metal Parameters */}
          <ParamSection
            title="Metal"
            titleTr="Metal Ayarları"
            isOpen={openSections.has('metal')}
            onToggle={() => toggleSection('metal')}
            badge={config.metal?.primaryMetal ? params.METAL_TYPES.find(m => m.value === config.metal?.primaryMetal)?.labelTr : undefined}
          >
            {/* Primary Metal */}
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Ana Metal</div>
              <OptionGrid
                options={params.METAL_TYPES}
                selected={config.metal?.primaryMetal}
                onSelect={(v) => updateMetalConfig('primaryMetal', v as any)}
                columns={2}
                showIcon
              />
            </div>
            
            {/* Purity */}
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Ayar</div>
              <OptionGrid
                options={params.METAL_PURITIES}
                selected={config.metal?.primaryPurity}
                onSelect={(v) => updateMetalConfig('primaryPurity', v as any)}
                columns={3}
              />
            </div>
            
            {/* Finish */}
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Yüzey İşlemi</div>
              <OptionGrid
                options={params.METAL_FINISHES}
                selected={config.metal?.primaryFinish}
                onSelect={(v) => updateMetalConfig('primaryFinish', v as any)}
                columns={2}
              />
            </div>
            
            {/* Two-Tone Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => updateMetalConfig('twoTone', !config.metal?.twoTone)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs ${
                  config.metal?.twoTone
                    ? 'border-purple-500/50 bg-purple-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                İki Renk
              </button>
              <button
                onClick={() => updateMetalConfig('triColor', !config.metal?.triColor)}
                className={`flex-1 rounded-lg border px-3 py-2 text-xs ${
                  config.metal?.triColor
                    ? 'border-purple-500/50 bg-purple-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                Üç Renk
              </button>
            </div>
          </ParamSection>
          
          {/* Ring Specific */}
          {config.jewelryType === 'ring' && (
            <ParamSection
              title="Ring Details"
              titleTr="Yüzük Detayları"
              isOpen={openSections.has('ring')}
              onToggle={() => toggleSection('ring')}
            >
              {/* Profile */}
              <div className="mb-3">
                <div className="mb-2 text-[10px] text-white/40">Kol Profili</div>
                <OptionGrid
                  options={params.RING_PROFILES}
                  selected={config.ring?.profile}
                  onSelect={(v) => updateRingConfig('profile', v as any)}
                  columns={2}
                />
              </div>
              
              {/* Width */}
              <div className="mb-3">
                <div className="mb-2 text-[10px] text-white/40">Kol Genişliği</div>
                <OptionGrid
                  options={params.RING_WIDTHS}
                  selected={config.ring?.width}
                  onSelect={(v) => updateRingConfig('width', v as any)}
                  columns={2}
                />
              </div>
              
              {/* Shank Stones */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateRingConfig('shankStones', !config.ring?.shankStones)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs ${
                    config.ring?.shankStones
                      ? 'border-purple-500/50 bg-purple-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/60'
                  }`}
                >
                  Kol Taşlı
                </button>
                <button
                  onClick={() => updateRingConfig('comfortFit', !config.ring?.comfortFit)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs ${
                    config.ring?.comfortFit
                      ? 'border-purple-500/50 bg-purple-500/20 text-white'
                      : 'border-white/10 bg-white/5 text-white/60'
                  }`}
                >
                  Konfor İçi
                </button>
              </div>
            </ParamSection>
          )}
          
          {/* Chain/Necklace Specific */}
          {(config.jewelryType === 'necklace' || config.jewelryType === 'bracelet') && (
            <ParamSection
              title="Chain Details"
              titleTr="Zincir Detayları"
              isOpen={openSections.has('chain')}
              onToggle={() => toggleSection('chain')}
            >
              <div className="mb-3">
                <div className="mb-2 text-[10px] text-white/40">Zincir Tipi</div>
                <OptionGrid
                  options={params.CHAIN_TYPES}
                  selected={config.chain?.chainType}
                  onSelect={(v) => updateChainConfig('chainType', v as any)}
                  columns={2}
                />
              </div>
              
              {config.jewelryType === 'necklace' && (
                <div className="mb-3">
                  <div className="mb-2 text-[10px] text-white/40">Uzunluk</div>
                  <OptionGrid
                    options={params.NECKLACE_LENGTHS}
                    selected={config.chain?.length}
                    onSelect={(v) => updateChainConfig('length', v as any)}
                    columns={2}
                  />
                </div>
              )}
              
              <div className="mb-3">
                <div className="mb-2 text-[10px] text-white/40">Kilit Tipi</div>
                <OptionGrid
                  options={params.CLASP_TYPES}
                  selected={config.chain?.clasp}
                  onSelect={(v) => updateChainConfig('clasp', v as any)}
                  columns={2}
                />
              </div>
            </ParamSection>
          )}
          
          {/* Earring Specific */}
          {config.jewelryType === 'earring' && (
            <ParamSection
              title="Earring Details"
              titleTr="Küpe Detayları"
              isOpen={openSections.has('earring')}
              onToggle={() => toggleSection('earring')}
            >
              <div className="mb-3">
                <div className="mb-2 text-[10px] text-white/40">Arka Tip</div>
                <OptionGrid
                  options={params.EARRING_BACKS}
                  selected={config.earring?.backType}
                  onSelect={(v) => updateEarringConfig('backType', v as any)}
                  columns={2}
                />
              </div>
            </ParamSection>
          )}
          
          {/* Style */}
          <ParamSection
            title="Style"
            titleTr="Tasarım Stili"
            isOpen={openSections.has('style')}
            onToggle={() => toggleSection('style')}
          >
            {/* Design Style */}
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Stil</div>
              <OptionGrid
                options={params.DESIGN_STYLES}
                selected={config.style?.designStyle}
                onSelect={(v) => updateStyleConfig('designStyle', v as any)}
                columns={2}
              />
            </div>
            
            {/* Cultural Style */}
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Kültürel Stil</div>
              <OptionGrid
                options={params.CULTURAL_STYLES}
                selected={config.style?.culturalStyle}
                onSelect={(v) => updateStyleConfig('culturalStyle', v as any)}
                columns={2}
              />
            </div>
            
            {/* Motif */}
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Motif Teması</div>
              <OptionGrid
                options={params.THEMATIC_MOTIFS}
                selected={config.style?.thematicMotif}
                onSelect={(v) => updateStyleConfig('thematicMotif', v as any)}
                columns={2}
                showIcon
              />
            </div>
            
            {/* Specific Motif */}
            {specificMotifOptions.length > 0 && (
              <div className="mb-3">
                <div className="mb-2 text-[10px] text-white/40">Spesifik Motif</div>
                <OptionGrid
                  options={specificMotifOptions}
                  selected={config.style?.specificMotif}
                  onSelect={(v) => updateStyleConfig('specificMotif', v as any)}
                  columns={2}
                />
              </div>
            )}
            
            {/* Realism */}
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Gerçekçilik</div>
              <OptionGrid
                options={params.MOTIF_REALISM}
                selected={config.style?.motifRealism}
                onSelect={(v) => updateStyleConfig('motifRealism', v as any)}
                columns={2}
              />
            </div>
          </ParamSection>
          
          {/* Details */}
          <ParamSection
            title="Details"
            titleTr="Detaylar"
            isOpen={openSections.has('detail')}
            onToggle={() => toggleSection('detail')}
          >
            {/* Edge Detail */}
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Kenar Detayı</div>
              <OptionGrid
                options={params.EDGE_DETAILS}
                selected={config.detail?.edgeDetail}
                onSelect={(v) => updateDetailConfig('edgeDetail', v as any)}
                columns={2}
              />
            </div>
            
            {/* Toggles */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateDetailConfig('filigree', !config.detail?.filigree)}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  config.detail?.filigree
                    ? 'border-purple-500/50 bg-purple-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                Telkari
              </button>
              <button
                onClick={() => updateDetailConfig('openwork', !config.detail?.openwork)}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  config.detail?.openwork
                    ? 'border-purple-500/50 bg-purple-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                Ajur
              </button>
              <button
                onClick={() => updateDetailConfig('engraving', !config.detail?.engraving)}
                className={`rounded-lg border px-3 py-2 text-xs ${
                  config.detail?.engraving
                    ? 'border-purple-500/50 bg-purple-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/60'
                }`}
              >
                Kazıma
              </button>
            </div>
          </ParamSection>
          
          {/* Target */}
          <ParamSection
            title="Target"
            titleTr="Hedef Kitle"
            isOpen={openSections.has('target')}
            onToggle={() => toggleSection('target')}
          >
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Kullanım</div>
              <OptionGrid
                options={params.OCCASIONS}
                selected={config.target?.occasion}
                onSelect={(v) => updateTargetConfig('occasion', v as any)}
                columns={2}
              />
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Cinsiyet</div>
              <OptionGrid
                options={params.GENDERS}
                selected={config.target?.gender}
                onSelect={(v) => updateTargetConfig('gender', v as any)}
                columns={3}
              />
            </div>
            
            <div className="mb-3">
              <div className="mb-2 text-[10px] text-white/40">Fiyat Segmenti</div>
              <OptionGrid
                options={params.PRICE_POINTS}
                selected={config.target?.pricePoint}
                onSelect={(v) => updateTargetConfig('pricePoint', v as any)}
                columns={2}
              />
            </div>
          </ParamSection>
          
          {/* Variation/Set Types (when in variation mode) */}
          {mode === 'variation' && (
            <ParamSection
              title="Variation"
              titleTr="Varyasyon Tipi"
              isOpen={openSections.has('variation')}
              onToggle={() => toggleSection('variation')}
            >
              <OptionGrid
                options={params.VARIATION_TYPES}
                selected={config.variationType}
                onSelect={(v) => updateConfig('variationType', v as any)}
                columns={1}
              />
            </ParamSection>
          )}
          
          {/* Set Types */}
          {mode === 'set' && (
            <ParamSection
              title="Set Type"
              titleTr="Set Türü"
              isOpen={openSections.has('set')}
              onToggle={() => toggleSection('set')}
            >
              <OptionGrid
                options={params.SET_TYPES}
                selected={config.setType}
                onSelect={(v) => updateConfig('setType', v as any)}
                columns={1}
              />
            </ParamSection>
          )}
        </div>
        
        {/* Generate Button */}
        <div className="border-t border-white/10 p-4">
          {/* Variation Count */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-white/50">Varyasyon Sayısı</span>
            <div className="flex items-center gap-2">
              {[1, 2, 4, 8].map(n => (
                <button
                  key={n}
                  onClick={() => setVariationCount(n)}
                  className={`h-7 w-7 rounded text-xs font-medium ${
                    variationCount === n
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !config.jewelryType}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-3 text-sm font-medium text-white shadow-lg shadow-purple-500/25 transition-all hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Üretiliyor...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Tasarım Üret ({variationCount})
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* ========== MAIN AREA - RESULTS ========== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Prompt Preview */}
        <div className="border-b border-white/10 bg-black/20 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/30">Prompt:</span>
            <p className="flex-1 truncate text-xs text-white/50">{promptPreview}</p>
            <button
              onClick={() => navigator.clipboard.writeText(promptPreview)}
              className="rounded p-1 text-white/30 hover:bg-white/10 hover:text-white"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>
        
        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {generatedDesigns.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center">
              <Wand2 className="h-16 w-16 text-white/10" />
              <h3 className="mt-4 text-lg font-medium text-white/50">Tasarım Üretin</h3>
              <p className="mt-2 text-sm text-white/30">
                Sol panelden parametreleri seçin ve tasarım üretin
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {generatedDesigns.map((design) => (
                <div
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className={`group cursor-pointer overflow-hidden rounded-xl border transition-all ${
                    selectedDesign?.id === design.id
                      ? 'border-purple-500/50 ring-2 ring-purple-500/30'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="relative aspect-square">
                    <img
                      src={design.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="absolute bottom-2 left-2 right-2 flex gap-1">
                        <button className="flex-1 rounded bg-white/20 py-1 text-[10px] text-white backdrop-blur-sm hover:bg-white/30">
                          <Download className="mx-auto h-3 w-3" />
                        </button>
                        <button className="flex-1 rounded bg-white/20 py-1 text-[10px] text-white backdrop-blur-sm hover:bg-white/30">
                          <Heart className="mx-auto h-3 w-3" />
                        </button>
                        <button className="flex-1 rounded bg-white/20 py-1 text-[10px] text-white backdrop-blur-sm hover:bg-white/30">
                          <RefreshCw className="mx-auto h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* ========== JEWELRY TYPE MODAL ========== */}
      <AnimatePresence>
        {showTypeModal && uploadedImageTemp && (
          <JewelryTypeModal
            imageUrl={uploadedImageTemp}
            onConfirm={handleConfirmType}
            onCancel={() => {
              setShowTypeModal(false);
              setUploadedImageTemp(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// JEWELRY TYPE SELECTION MODAL
// ============================================
interface JewelryTypeModalProps {
  imageUrl: string;
  onConfirm: (type: JewelryType, hasStones: boolean, stoneType?: string) => void;
  onCancel: () => void;
}

function JewelryTypeModal({ imageUrl, onConfirm, onCancel }: JewelryTypeModalProps) {
  const [step, setStep] = useState<'type' | 'stones' | 'stoneType'>('type');
  const [selectedType, setSelectedType] = useState<JewelryType | null>(null);
  const [hasStones, setHasStones] = useState<boolean | null>(null);
  const [stoneType, setStoneType] = useState<string>('');
  
  const handleNext = () => {
    if (step === 'type' && selectedType) {
      setStep('stones');
    } else if (step === 'stones' && hasStones !== null) {
      if (hasStones) {
        setStep('stoneType');
      } else {
        onConfirm(selectedType!, false);
      }
    } else if (step === 'stoneType') {
      onConfirm(selectedType!, true, stoneType || 'diamond');
    }
  };
  
  const handleBack = () => {
    if (step === 'stones') {
      setStep('type');
    } else if (step === 'stoneType') {
      setStep('stones');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]/95 shadow-2xl backdrop-blur-xl"
      >
        {/* Header with Image */}
        <div className="relative h-32 overflow-hidden">
          <img src={imageUrl} alt="" className="h-full w-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-lg font-medium text-white">Ürün Bilgisi</h2>
            <p className="text-sm text-white/60">
              {step === 'type' && 'Yüklediğiniz ürünün türünü seçin'}
              {step === 'stones' && 'Ürün taşlı mı?'}
              {step === 'stoneType' && 'Taş türünü seçin'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Step 1: Jewelry Type */}
          {step === 'type' && (
            <div className="grid grid-cols-3 gap-3">
              {params.JEWELRY_TYPES.map((type) => (
                <button
                  key={type.value}
                  onClick={() => setSelectedType(type.value as JewelryType)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    selectedType === type.value
                      ? 'border-purple-500/50 bg-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm text-white/80">{type.labelTr}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Step 2: Has Stones */}
          {step === 'stones' && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setHasStones(true)}
                className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
                  hasStones === true
                    ? 'border-green-500/50 bg-green-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <Gem className="h-8 w-8 text-green-400" />
                <span className="text-sm font-medium text-white">Taşlı</span>
                <span className="text-xs text-white/40">Pırlanta, Zirkon vb.</span>
              </button>
              <button
                onClick={() => setHasStones(false)}
                className={`flex flex-col items-center gap-3 rounded-xl border p-6 transition-all ${
                  hasStones === false
                    ? 'border-amber-500/50 bg-amber-500/20'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <Circle className="h-8 w-8 text-amber-400" />
                <span className="text-sm font-medium text-white">Taşsız</span>
                <span className="text-xs text-white/40">Sadece metal</span>
              </button>
            </div>
          )}
          
          {/* Step 3: Stone Type */}
          {step === 'stoneType' && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'diamond', label: 'Pırlanta', icon: '💎' },
                { value: 'zircon', label: 'Zirkon', icon: '✨' },
                { value: 'ruby', label: 'Yakut', icon: '❤️' },
                { value: 'sapphire', label: 'Safir', icon: '💙' },
                { value: 'emerald', label: 'Zümrüt', icon: '💚' },
                { value: 'other', label: 'Diğer', icon: '💠' },
              ].map((stone) => (
                <button
                  key={stone.value}
                  onClick={() => setStoneType(stone.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                    stoneType === stone.value
                      ? 'border-purple-500/50 bg-purple-500/20'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-2xl">{stone.icon}</span>
                  <span className="text-sm text-white/80">{stone.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex gap-3 border-t border-white/10 p-4">
          {step !== 'type' && (
            <button
              onClick={handleBack}
              className="flex-1 rounded-lg border border-white/20 bg-white/5 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10"
            >
              Geri
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={
              (step === 'type' && !selectedType) ||
              (step === 'stones' && hasStones === null)
            }
            className="flex-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 py-2.5 text-sm font-medium text-white hover:from-purple-500 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === 'stoneType' ? 'Tamamla' : 'Devam'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * HDRPanel - HDR Environment Map controls for 3D viewer
 * 
 * Features:
 * - Built-in HDR presets
 * - Custom HDR upload
 * - Environment rotation
 * - Intensity controls
 * - Background visibility toggle
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, RotateCw, Eye, EyeOff, Loader2 } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface HDRPreset {
  id: string;
  name: string;
  nameTr: string;
  file: string; // Path to HDR file
  preview: string; // CSS gradient for preview
  description: string;
  descriptionTr: string;
  category: 'studio' | 'outdoor' | 'indoor' | 'abstract';
}

export interface HDRConfig {
  enabled: boolean;
  preset: string | null; // Preset ID or null for custom
  customHDR: string | null; // Data URL or path for custom HDR
  intensity: number;
  rotation: { x: number; y: number; z: number };
  showBackground: boolean;
  blur: number;
}

export const DEFAULT_HDR_CONFIG: HDRConfig = {
  enabled: true,
  preset: 'studio-soft',
  customHDR: null,
  intensity: 1.0,
  rotation: { x: 0, y: 0, z: 0 },
  showBackground: false,
  blur: 0,
};

// ============================================
// BUILT-IN HDR PRESETS
// ============================================

export const HDR_PRESETS: HDRPreset[] = [
  // Studio Environments
  {
    id: 'studio-soft',
    name: 'Soft Studio',
    nameTr: 'Yumuşak Stüdyo',
    file: '/environments/studio_soft.hdr',
    preview: 'linear-gradient(135deg, #f5f5f5 0%, #d0d0d0 50%, #e8e8e8 100%)',
    description: 'Soft, even lighting for jewelry',
    descriptionTr: 'Mücevher için yumuşak, düzgün aydınlatma',
    category: 'studio',
  },
  {
    id: 'studio-contrast',
    name: 'High Contrast',
    nameTr: 'Yüksek Kontrast',
    file: '/environments/studio_contrast.hdr',
    preview: 'linear-gradient(135deg, #ffffff 0%, #2a2a2a 50%, #ffffff 100%)',
    description: 'High contrast for dramatic reflections',
    descriptionTr: 'Dramatik yansımalar için yüksek kontrast',
    category: 'studio',
  },
  {
    id: 'studio-warm',
    name: 'Warm Studio',
    nameTr: 'Sıcak Stüdyo',
    file: '/environments/studio_warm.hdr',
    preview: 'linear-gradient(135deg, #fff8e8 0%, #d4a574 50%, #ffe8cc 100%)',
    description: 'Warm tones for gold jewelry',
    descriptionTr: 'Altın mücevher için sıcak tonlar',
    category: 'studio',
  },
  {
    id: 'studio-cool',
    name: 'Cool Studio',
    nameTr: 'Soğuk Stüdyo',
    file: '/environments/studio_cool.hdr',
    preview: 'linear-gradient(135deg, #e0f0ff 0%, #8ab4f8 50%, #c0d8ff 100%)',
    description: 'Cool tones for silver/platinum',
    descriptionTr: 'Gümüş/platin için soğuk tonlar',
    category: 'studio',
  },
  // Indoor Environments
  {
    id: 'showroom',
    name: 'Showroom',
    nameTr: 'Showroom',
    file: '/environments/showroom.hdr',
    preview: 'linear-gradient(135deg, #2a2a2a 0%, #4a4a4a 50%, #1a1a1a 100%)',
    description: 'Luxury showroom lighting',
    descriptionTr: 'Lüks showroom aydınlatması',
    category: 'indoor',
  },
  {
    id: 'gallery',
    name: 'Art Gallery',
    nameTr: 'Sanat Galerisi',
    file: '/environments/gallery.hdr',
    preview: 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 50%, #d0d0d0 100%)',
    description: 'Clean gallery lighting',
    descriptionTr: 'Temiz galeri aydınlatması',
    category: 'indoor',
  },
  // Outdoor Environments
  {
    id: 'sunset',
    name: 'Golden Hour',
    nameTr: 'Altın Saat',
    file: '/environments/sunset.hdr',
    preview: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 50%, #ff9966 100%)',
    description: 'Warm sunset lighting',
    descriptionTr: 'Sıcak gün batımı aydınlatması',
    category: 'outdoor',
  },
  {
    id: 'overcast',
    name: 'Overcast Sky',
    nameTr: 'Bulutlu Gökyüzü',
    file: '/environments/overcast.hdr',
    preview: 'linear-gradient(135deg, #b0b0b0 0%, #d0d0d0 50%, #a0a0a0 100%)',
    description: 'Soft diffused daylight',
    descriptionTr: 'Yumuşak dağınık gün ışığı',
    category: 'outdoor',
  },
  // Abstract
  {
    id: 'gradient-bw',
    name: 'B&W Gradient',
    nameTr: 'S&B Gradient',
    file: '/environments/gradient_bw.hdr',
    preview: 'linear-gradient(to bottom, #ffffff 0%, #000000 100%)',
    description: 'Simple black to white gradient',
    descriptionTr: 'Basit siyah-beyaz geçiş',
    category: 'abstract',
  },
  {
    id: 'neon',
    name: 'Neon Lights',
    nameTr: 'Neon Işıklar',
    file: '/environments/neon.hdr',
    preview: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #ff00ff 100%)',
    description: 'Colorful neon reflections',
    descriptionTr: 'Renkli neon yansımalar',
    category: 'abstract',
  },
];

// ============================================
// LIGHTFORMER STUDIO PRESETS (No external HDR needed)
// ============================================

export interface LightformerPreset {
  id: string;
  name: string;
  nameTr: string;
  preview: string;
  lights: Array<{
    color: string;
    intensity: number;
    position: [number, number, number];
    scale: [number, number, number];
    rotation?: [number, number, number];
  }>;
}

export const LIGHTFORMER_PRESETS: LightformerPreset[] = [
  {
    id: 'white-studio',
    name: 'White Studio',
    nameTr: 'Beyaz Stüdyo',
    preview: '#ffffff',
    lights: [
      { color: '#ffffff', intensity: 2, position: [0, 8, 0], scale: [20, 20, 1], rotation: [Math.PI / 2, 0, 0] },
      { color: '#ffffff', intensity: 1.5, position: [0, 2, -6], scale: [8, 4, 1] },
      { color: '#ffffff', intensity: 1.5, position: [5.2, 2, 3], scale: [8, 4, 1], rotation: [0, 2 * Math.PI / 3, 0] },
      { color: '#ffffff', intensity: 1.5, position: [-5.2, 2, 3], scale: [8, 4, 1], rotation: [0, -2 * Math.PI / 3, 0] },
      { color: '#f0f0f0', intensity: 0.8, position: [0, -4, 0], scale: [15, 15, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'soft-box',
    name: 'Soft Box',
    nameTr: 'Yumuşak Kutu',
    preview: '#f8f8f8',
    lights: [
      { color: '#ffffff', intensity: 2.5, position: [0, 10, 0], scale: [25, 25, 1], rotation: [Math.PI / 2, 0, 0] },
      { color: '#fafafa', intensity: 1.2, position: [0, 3, -8], scale: [16, 8, 1] },
      { color: '#fafafa', intensity: 1.2, position: [8, 3, 0], scale: [16, 8, 1], rotation: [0, -Math.PI / 2, 0] },
      { color: '#fafafa', intensity: 1.2, position: [-8, 3, 0], scale: [16, 8, 1], rotation: [0, Math.PI / 2, 0] },
      { color: '#f0f0f0', intensity: 0.6, position: [0, -3, 0], scale: [20, 20, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    nameTr: 'Dramatik',
    preview: 'linear-gradient(135deg, #000 0%, #333 100%)',
    lights: [
      { color: '#ffffff', intensity: 4, position: [4, 6, -4], scale: [5, 5, 1], rotation: [0.3, Math.PI / 4, 0] },
      { color: '#4488ff', intensity: 2, position: [-5, 3, 4], scale: [4, 3, 1], rotation: [0, -2 * Math.PI / 3, 0] },
      { color: '#ff8844', intensity: 1.5, position: [5, 1, 4], scale: [3, 2, 1], rotation: [0, 2 * Math.PI / 3, 0] },
    ],
  },
  {
    id: 'product-360',
    name: 'Product 360',
    nameTr: 'Ürün 360',
    preview: '#ffffff',
    lights: [
      { color: '#ffffff', intensity: 3, position: [0, 10, 0], scale: [20, 20, 1], rotation: [Math.PI / 2, 0, 0] },
      { color: '#ffffff', intensity: 1.8, position: [0, 3, -7], scale: [6, 4, 1] },
      { color: '#ffffff', intensity: 1.8, position: [7, 3, 0], scale: [6, 4, 1], rotation: [0, Math.PI / 2, 0] },
      { color: '#ffffff', intensity: 1.8, position: [0, 3, 7], scale: [6, 4, 1], rotation: [0, Math.PI, 0] },
      { color: '#ffffff', intensity: 1.8, position: [-7, 3, 0], scale: [6, 4, 1], rotation: [0, -Math.PI / 2, 0] },
      { color: '#ffffff', intensity: 1, position: [0, -3, 0], scale: [18, 18, 1], rotation: [-Math.PI / 2, 0, 0] },
    ],
  },
];

// ============================================
// HDR PANEL COMPONENT
// ============================================

interface HDRPanelProps {
  config: HDRConfig;
  onChange: (config: Partial<HDRConfig>) => void;
  onLightformerSelect?: (preset: LightformerPreset) => void;
}

export function HDRPanel({ config, onChange, onLightformerSelect }: HDRPanelProps) {
  const [activeTab, setActiveTab] = useState<'lightformer' | 'hdr'>('lightformer');
  const [uploadingHDR, setUploadingHDR] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle HDR file upload
  const handleHDRUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.hdr') && !file.name.endsWith('.exr')) {
      alert('Lütfen .hdr veya .exr dosyası yükleyin');
      return;
    }

    setUploadingHDR(true);

    try {
      // For now, we'll store the file path or create a blob URL
      const url = URL.createObjectURL(file);
      onChange({ customHDR: url, preset: null });
    } catch (error) {
      console.error('HDR upload error:', error);
      alert('HDR yükleme hatası');
    } finally {
      setUploadingHDR(false);
    }
  }, [onChange]);

  // Group HDR presets by category
  const groupedPresets = HDR_PRESETS.reduce((acc, preset) => {
    if (!acc[preset.category]) {
      acc[preset.category] = [];
    }
    acc[preset.category].push(preset);
    return acc;
  }, {} as Record<string, HDRPreset[]>);

  const categoryNames: Record<string, string> = {
    studio: 'Stüdyo',
    outdoor: 'Dış Mekan',
    indoor: 'İç Mekan',
    abstract: 'Soyut',
  };

  return (
    <div className="space-y-4">
      {/* Enable Toggle */}
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-xs text-white/70">Ortam Işığı</span>
        <button
          onClick={() => onChange({ enabled: !config.enabled })}
          className={`relative h-5 w-9 rounded-full transition-colors ${
            config.enabled ? 'bg-purple-500' : 'bg-white/20'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              config.enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </label>

      {config.enabled && (
        <>
          {/* Type Selector */}
          <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
            <button
              onClick={() => setActiveTab('lightformer')}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                activeTab === 'lightformer'
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              Studio
            </button>
            <button
              onClick={() => setActiveTab('hdr')}
              className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                activeTab === 'hdr'
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              HDR
            </button>
          </div>

          {/* Lightformer Presets */}
          {activeTab === 'lightformer' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {LIGHTFORMER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onLightformerSelect?.(preset)}
                    className="flex flex-col items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-purple-500/50 hover:bg-purple-500/10"
                  >
                    <div
                      className="h-8 w-8 rounded-full ring-1 ring-white/20"
                      style={{ background: preset.preview }}
                    />
                    <span className="text-[10px] text-white/70">{preset.nameTr}</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-white/40 text-center">
                Dahili stüdyo aydınlatması - harici dosya gerekmez
              </p>
            </div>
          )}

          {/* HDR Presets */}
          {activeTab === 'hdr' && (
            <div className="space-y-3">
              {/* Category Filter */}
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`rounded-md px-2 py-1 text-[10px] transition-all ${
                    selectedCategory === null
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  Tümü
                </button>
                {Object.keys(categoryNames).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-md px-2 py-1 text-[10px] transition-all ${
                      selectedCategory === cat
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {categoryNames[cat]}
                  </button>
                ))}
              </div>

              {/* Preset Grid */}
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {HDR_PRESETS.filter(
                  (p) => !selectedCategory || p.category === selectedCategory
                ).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onChange({ preset: preset.id, customHDR: null })}
                    className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
                      config.preset === preset.id
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    <div
                      className="h-10 w-full rounded-md ring-1 ring-white/10"
                      style={{ background: preset.preview }}
                    />
                    <span className="text-[10px] text-white/70">{preset.nameTr}</span>
                  </button>
                ))}
              </div>

              {/* Custom HDR Upload */}
              <div className="rounded-lg border border-dashed border-white/20 bg-white/5 p-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".hdr,.exr"
                  onChange={handleHDRUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingHDR}
                  className="flex w-full items-center justify-center gap-2 text-xs text-white/60 hover:text-white/80"
                >
                  {uploadingHDR ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {config.customHDR ? 'Özel HDR Yüklü' : 'Özel HDR Yükle'}
                </button>
                {config.customHDR && (
                  <button
                    onClick={() => onChange({ customHDR: null })}
                    className="mt-2 w-full text-[10px] text-red-400 hover:text-red-300"
                  >
                    Özel HDR'ı Kaldır
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Intensity */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Yoğunluk</span>
              <span className="text-[10px] font-mono text-white/60">
                {config.intensity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={3}
              step={0.1}
              value={config.intensity}
              onChange={(e) => onChange({ intensity: parseFloat(e.target.value) })}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Ortam Rotasyonu</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[9px] text-white/30">X</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={(config.rotation.x * 180) / Math.PI}
                  onChange={(e) =>
                    onChange({
                      rotation: {
                        ...config.rotation,
                        x: (parseFloat(e.target.value) * Math.PI) / 180,
                      },
                    })
                  }
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div>
                <label className="text-[9px] text-white/30">Y</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={(config.rotation.y * 180) / Math.PI}
                  onChange={(e) =>
                    onChange({
                      rotation: {
                        ...config.rotation,
                        y: (parseFloat(e.target.value) * Math.PI) / 180,
                      },
                    })
                  }
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                />
              </div>
              <div>
                <label className="text-[9px] text-white/30">Z</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={(config.rotation.z * 180) / Math.PI}
                  onChange={(e) =>
                    onChange({
                      rotation: {
                        ...config.rotation,
                        z: (parseFloat(e.target.value) * Math.PI) / 180,
                      },
                    })
                  }
                  className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Background Visibility */}
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-[10px] text-white/50">HDR'ı Arka Plan Olarak Göster</span>
            <button
              onClick={() => onChange({ showBackground: !config.showBackground })}
              className={`relative h-4 w-7 rounded-full transition-colors ${
                config.showBackground ? 'bg-purple-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  config.showBackground ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          {/* Blur (for background) */}
          {config.showBackground && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Arka Plan Bulanıklığı</span>
                <span className="text-[10px] font-mono text-white/60">{config.blur}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={config.blur}
                onChange={(e) => onChange({ blur: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default HDRPanel;

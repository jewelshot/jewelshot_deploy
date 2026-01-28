/**
 * ExportPanel - Screenshot and export controls
 * 
 * Atomic Architecture: Molecule component
 * Controls: Resolution, format, quality, multi-angle export
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ThrottledRangeInput } from '@/components/atoms/ThrottledRangeInput';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Download,
  Image,
  Video,
  Grid3X3,
  Settings2,
  ChevronDown,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import {
  type ScreenshotConfig,
  type VideoConfig,
  type MultiAngleConfig,
  type ExportFormat,
  type ExportResolution,
  RESOLUTION_PRESETS,
  DEFAULT_SCREENSHOT_CONFIG,
  DEFAULT_VIDEO_CONFIG,
  DEFAULT_MULTI_ANGLE_CONFIG,
  PIXEL_RATIO_PRESETS,
  estimateFileSize,
  getEffectiveResolution,
} from '@/lib/3d/export-utils';
import { CAMERA_VIEW_PRESETS } from '@/lib/3d/camera-presets';

// ============================================
// TYPES
// ============================================

interface ExportPanelProps {
  onScreenshot: (config: ScreenshotConfig) => Promise<void>;
  onVideo?: (config: VideoConfig) => Promise<void>;
  onMultiAngle?: (config: MultiAngleConfig) => Promise<void>;
  isExporting?: boolean;
  compact?: boolean;
}

// ============================================
// TAB BUTTON
// ============================================

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
        isActive
          ? 'bg-purple-500/20 text-purple-300'
          : 'text-white/50 hover:bg-white/10 hover:text-white/80'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ============================================
// RESOLUTION SELECTOR
// ============================================

interface ResolutionSelectorProps {
  value: ExportResolution;
  onChange: (resolution: ExportResolution) => void;
}

function ResolutionSelector({ value, onChange }: ResolutionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Group resolutions by aspect ratio
  const groupedResolutions = useMemo(() => {
    const groups: Record<string, ExportResolution[]> = {};
    RESOLUTION_PRESETS.forEach((res) => {
      const key = res.aspectRatio;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(res);
    });
    return groups;
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      >
        <div className="flex flex-col items-start">
          <span className="text-xs text-white/80">{value.name}</span>
          <span className="text-[10px] text-white/40">
            {value.width} × {value.height}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-0 right-0 top-full z-20 mt-1 max-h-60 overflow-y-auto rounded-lg border border-white/10 bg-[#0a0a0a] p-1 shadow-xl"
          >
            {Object.entries(groupedResolutions).map(([aspectRatio, resolutions]) => (
              <div key={aspectRatio}>
                <div className="px-2 py-1 text-[10px] font-medium text-white/40">
                  {aspectRatio}
                </div>
                {resolutions.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => {
                      onChange(res);
                      setIsOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left transition-colors ${
                      value.id === res.id
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs">{res.name}</span>
                    <span className="text-[10px] text-white/40">
                      {res.width}×{res.height}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// FORMAT SELECTOR
// ============================================

interface FormatSelectorProps {
  value: ExportFormat;
  onChange: (format: ExportFormat) => void;
}

function FormatSelector({ value, onChange }: FormatSelectorProps) {
  const formats: { id: ExportFormat; name: string; desc: string }[] = [
    { id: 'png', name: 'PNG', desc: 'En iyi kalite, şeffaflık' },
    { id: 'jpeg', name: 'JPEG', desc: 'Küçük dosya boyutu' },
    { id: 'webp', name: 'WebP', desc: 'Modern, verimli' },
  ];

  return (
    <div className="grid grid-cols-3 gap-1">
      {formats.map((fmt) => (
        <button
          key={fmt.id}
          onClick={() => onChange(fmt.id)}
          className={`flex flex-col items-center rounded-lg border p-2 transition-colors ${
            value === fmt.id
              ? 'border-purple-500/50 bg-purple-500/10'
              : 'border-white/10 bg-white/5 hover:border-white/20'
          }`}
        >
          <span className="text-xs font-medium text-white/80">{fmt.name}</span>
          <span className="text-[9px] text-white/40">{fmt.desc}</span>
        </button>
      ))}
    </div>
  );
}

// ============================================
// SCREENSHOT TAB
// ============================================

interface ScreenshotTabProps {
  config: ScreenshotConfig;
  onChange: (config: ScreenshotConfig) => void;
  onExport: () => void;
  isExporting: boolean;
}

function ScreenshotTab({ config, onChange, onExport, isExporting }: ScreenshotTabProps) {
  const effectiveRes = useMemo(() => getEffectiveResolution(config), [config]);
  
  const estimatedSize = useMemo(() => {
    const res = config.useCustomResolution 
      ? { ...config.resolution, width: config.customWidth, height: config.customHeight }
      : config.resolution;
    return estimateFileSize(res, config.format, config.quality, config.pixelRatio);
  }, [config]);

  return (
    <div className="space-y-4">
      {/* Resolution Mode Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/50">Çözünürlük Modu</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onChange({ ...config, useCustomResolution: false })}
            className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
              !config.useCustomResolution
                ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
            }`}
          >
            Hazır Boyutlar
          </button>
          <button
            onClick={() => onChange({ ...config, useCustomResolution: true })}
            className={`rounded-lg border px-3 py-2 text-xs transition-colors ${
              config.useCustomResolution
                ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
            }`}
          >
            Özel Boyut
          </button>
        </div>
      </div>

      {/* Preset Resolution */}
      {!config.useCustomResolution && (
        <div className="space-y-2">
          <span className="text-[10px] text-white/50">Çözünürlük</span>
          <ResolutionSelector
            value={config.resolution}
            onChange={(resolution) => onChange({ ...config, resolution })}
          />
        </div>
      )}

      {/* Custom Resolution */}
      {config.useCustomResolution && (
        <div className="space-y-2">
          <span className="text-[10px] text-white/50">Özel Piksel Boyutu</span>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[9px] text-white/40">Genişlik (px)</label>
              <input
                type="number"
                value={config.customWidth}
                onChange={(e) => onChange({ ...config, customWidth: Math.max(1, parseInt(e.target.value) || 1) })}
                min={1}
                max={8192}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] text-white/40">Yükseklik (px)</label>
              <input
                type="number"
                value={config.customHeight}
                onChange={(e) => onChange({ ...config, customHeight: Math.max(1, parseInt(e.target.value) || 1) })}
                min={1}
                max={8192}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pixel Ratio / Density */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/50">Piksel Yoğunluğu</span>
          <span className="text-[10px] text-white/40">
            Sonuç: {effectiveRes.width} × {effectiveRes.height}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {PIXEL_RATIO_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onChange({ ...config, pixelRatio: preset.value })}
              className={`flex flex-col items-center rounded-lg border py-2 transition-colors ${
                config.pixelRatio === preset.value
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <span className="text-xs font-medium text-white/80">{preset.label}</span>
              <span className="text-[8px] text-white/40">{preset.description}</span>
            </button>
          ))}
        </div>
        <p className="text-[9px] text-white/30">
          Yüksek yoğunluk = daha keskin görüntü, daha büyük dosya
        </p>
      </div>

      {/* Format */}
      <div className="space-y-2">
        <span className="text-[10px] text-white/50">Format</span>
        <FormatSelector
          value={config.format}
          onChange={(format) => onChange({ ...config, format })}
        />
      </div>

      {/* Quality (for JPEG/WebP) */}
      {config.format !== 'png' && (
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-white/50">Kalite</span>
            <span className="text-[10px] text-white/60">{Math.round(config.quality * 100)}%</span>
          </div>
          <ThrottledRangeInput
            
            min={0.1}
            max={1}
            step={0.05}
            value={config.quality}
            onChange={(v) => onChange({ ...config, quality: v })}
            
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
        {config.format === 'png' && (
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-xs text-white/70">Şeffaf Arkaplan</span>
            <button
              onClick={() => onChange({ ...config, transparentBackground: !config.transparentBackground })}
              className={`relative h-4 w-7 rounded-full transition-colors ${
                config.transparentBackground ? 'bg-purple-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  config.transparentBackground ? 'left-[14px]' : 'left-0.5'
                }`}
              />
            </button>
          </label>
        )}

        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Çıktı Boyutu</span>
          <span className="font-mono text-white/70">{effectiveRes.width} × {effectiveRes.height} px</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-white/50">Tahmini Dosya</span>
          <span className="text-white/70">{estimatedSize}</span>
        </div>
      </div>

      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={isExporting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Kaydediliyor...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Görüntüyü İndir
          </>
        )}
      </button>
    </div>
  );
}

// ============================================
// VIDEO TAB
// ============================================

interface VideoTabProps {
  config: VideoConfig;
  onChange: (config: VideoConfig) => void;
  onExport: () => void;
  isExporting: boolean;
}

function VideoTab({ config, onChange, onExport, isExporting }: VideoTabProps) {
  return (
    <div className="space-y-4">
      {/* Resolution */}
      <div className="space-y-2">
        <span className="text-[10px] text-white/50">Çözünürlük</span>
        <ResolutionSelector
          value={config.resolution}
          onChange={(resolution) => onChange({ ...config, resolution })}
        />
      </div>

      {/* Format */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange({ ...config, format: 'webm' })}
          className={`rounded-lg border p-2 text-xs ${
            config.format === 'webm'
              ? 'border-purple-500/50 bg-purple-500/10'
              : 'border-white/10 bg-white/5'
          }`}
        >
          WebM Video
        </button>
        <button
          onClick={() => onChange({ ...config, format: 'gif' })}
          className={`rounded-lg border p-2 text-xs ${
            config.format === 'gif'
              ? 'border-purple-500/50 bg-purple-500/10'
              : 'border-white/10 bg-white/5'
          }`}
        >
          GIF Animasyon
        </button>
      </div>

      {/* Duration & FPS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[10px] text-white/50">Süre (sn)</span>
          <input
            type="number"
            value={config.duration}
            onChange={(e) => onChange({ ...config, duration: parseInt(e.target.value) || 1 })}
            min={1}
            max={30}
            step={1}
            className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white"
          />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-white/50">FPS</span>
          <select
            value={config.fps}
            onChange={(e) => onChange({ ...config, fps: parseInt(e.target.value) })}
            className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white"
          >
            <option value={15}>15</option>
            <option value={24}>24</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
          </select>
        </div>
      </div>

      {/* Rotation Type */}
      <div className="space-y-2">
        <span className="text-[10px] text-white/50">Döndürme Tipi</span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onChange({ ...config, rotationType: 'turntable' })}
            className={`rounded-lg border p-2 text-xs ${
              config.rotationType === 'turntable'
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            Döner Tabla
          </button>
          <button
            onClick={() => onChange({ ...config, rotationType: 'orbit' })}
            className={`rounded-lg border p-2 text-xs ${
              config.rotationType === 'orbit'
                ? 'border-purple-500/50 bg-purple-500/10'
                : 'border-white/10 bg-white/5'
            }`}
          >
            Yörünge
          </button>
        </div>
      </div>

      {/* Rotation Amount */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/50">Döndürme Miktarı</span>
          <span className="text-[10px] text-white/60">{config.rotationDegrees}°</span>
        </div>
        <ThrottledRangeInput
          
          min={90}
          max={720}
          step={45}
          value={config.rotationDegrees}
          onChange={(v) => onChange({ ...config, rotationDegrees: v })}
          
        />
      </div>

      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={isExporting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Kaydediliyor...
          </>
        ) : (
          <>
            <Video className="h-4 w-4" />
            Video İndir
          </>
        )}
      </button>
    </div>
  );
}

// ============================================
// MULTI-ANGLE TAB
// ============================================

interface MultiAngleTabProps {
  config: MultiAngleConfig;
  onChange: (config: MultiAngleConfig) => void;
  onExport: () => void;
  isExporting: boolean;
}

function MultiAngleTab({ config, onChange, onExport, isExporting }: MultiAngleTabProps) {
  const toggleAngle = useCallback((angleId: string) => {
    const newAngles = config.angles.includes(angleId)
      ? config.angles.filter(a => a !== angleId)
      : [...config.angles, angleId];
    onChange({ ...config, angles: newAngles });
  }, [config, onChange]);

  return (
    <div className="space-y-4">
      {/* Angle Selection */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-white/50">Açılar</span>
          <span className="text-[10px] text-white/40">{config.angles.length} seçili</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {CAMERA_VIEW_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => toggleAngle(preset.id)}
              className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
                config.angles.includes(preset.id)
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              }`}
            >
              <span className="text-sm">{preset.icon}</span>
              <span className="text-[8px] text-white/60">{preset.nameTr}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div className="space-y-2">
        <span className="text-[10px] text-white/50">Çözünürlük</span>
        <ResolutionSelector
          value={config.resolution}
          onChange={(resolution) => onChange({ ...config, resolution })}
        />
      </div>

      {/* Format */}
      <div className="space-y-2">
        <span className="text-[10px] text-white/50">Format</span>
        <FormatSelector
          value={config.format}
          onChange={(format) => onChange({ ...config, format })}
        />
      </div>

      {/* Info */}
      <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/60">
        {config.angles.length} görüntü oluşturulacak ve ZIP olarak indirilecek.
      </div>

      {/* Export Button */}
      <button
        onClick={onExport}
        disabled={isExporting || config.angles.length === 0}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-500 disabled:opacity-50"
      >
        {isExporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Kaydediliyor...
          </>
        ) : (
          <>
            <Grid3X3 className="h-4 w-4" />
            Tümünü İndir (ZIP)
          </>
        )}
      </button>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ExportPanel({
  onScreenshot,
  onVideo,
  onMultiAngle,
  isExporting = false,
  compact = false,
}: ExportPanelProps) {
  const [activeTab, setActiveTab] = useState<'screenshot' | 'video' | 'multi'>('screenshot');
  const [screenshotConfig, setScreenshotConfig] = useState(DEFAULT_SCREENSHOT_CONFIG);
  const [videoConfig, setVideoConfig] = useState(DEFAULT_VIDEO_CONFIG);
  const [multiAngleConfig, setMultiAngleConfig] = useState(DEFAULT_MULTI_ANGLE_CONFIG);

  const handleScreenshotExport = useCallback(async () => {
    await onScreenshot(screenshotConfig);
  }, [screenshotConfig, onScreenshot]);

  const handleVideoExport = useCallback(async () => {
    if (onVideo) {
      await onVideo(videoConfig);
    }
  }, [videoConfig, onVideo]);

  const handleMultiAngleExport = useCallback(async () => {
    if (onMultiAngle) {
      await onMultiAngle(multiAngleConfig);
    }
  }, [multiAngleConfig, onMultiAngle]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
        <TabButton
          icon={<Camera className="h-3.5 w-3.5" />}
          label="Görüntü"
          isActive={activeTab === 'screenshot'}
          onClick={() => setActiveTab('screenshot')}
        />
        {onVideo && (
          <TabButton
            icon={<Video className="h-3.5 w-3.5" />}
            label="Video"
            isActive={activeTab === 'video'}
            onClick={() => setActiveTab('video')}
          />
        )}
        {onMultiAngle && (
          <TabButton
            icon={<Grid3X3 className="h-3.5 w-3.5" />}
            label="Çoklu Açı"
            isActive={activeTab === 'multi'}
            onClick={() => setActiveTab('multi')}
          />
        )}
      </div>

      {/* Tab Content */}
      {activeTab === 'screenshot' && (
        <ScreenshotTab
          config={screenshotConfig}
          onChange={setScreenshotConfig}
          onExport={handleScreenshotExport}
          isExporting={isExporting}
        />
      )}

      {activeTab === 'video' && onVideo && (
        <VideoTab
          config={videoConfig}
          onChange={setVideoConfig}
          onExport={handleVideoExport}
          isExporting={isExporting}
        />
      )}

      {activeTab === 'multi' && onMultiAngle && (
        <MultiAngleTab
          config={multiAngleConfig}
          onChange={setMultiAngleConfig}
          onExport={handleMultiAngleExport}
          isExporting={isExporting}
        />
      )}
    </div>
  );
}

export default ExportPanel;

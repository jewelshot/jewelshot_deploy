/**
 * VideoExportPanel - Video and animation export controls
 * 
 * Features:
 * - Video recording (WebM/MP4)
 * - GIF export
 * - Turntable animation
 * - Custom duration and quality
 * - Frame rate control
 */

'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, 
  Camera, 
  Play, 
  Pause, 
  Square, 
  Download, 
  Settings, 
  RotateCw,
  Loader2,
  Image as ImageIcon,
  Film,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type VideoFormat = 'webm' | 'mp4' | 'gif';
export type VideoQuality = 'low' | 'medium' | 'high' | 'ultra';
export type AnimationType = 'turntable' | 'custom' | 'static';

export interface VideoExportConfig {
  format: VideoFormat;
  quality: VideoQuality;
  fps: number;
  duration: number; // seconds
  width: number;
  height: number;
  animationType: AnimationType;
  turntableSpeed: number; // rotations per duration
  turntableDirection: 'cw' | 'ccw';
  turntableAxis: 'y' | 'x' | 'z';
  includeAudio: boolean;
  transparentBackground: boolean;
}

export const DEFAULT_VIDEO_CONFIG: VideoExportConfig = {
  format: 'webm',
  quality: 'high',
  fps: 30,
  duration: 5,
  width: 1920,
  height: 1080,
  animationType: 'turntable',
  turntableSpeed: 1,
  turntableDirection: 'cw',
  turntableAxis: 'y',
  includeAudio: false,
  transparentBackground: false,
};

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  progress: number; // 0-100
  currentFrame: number;
  totalFrames: number;
  elapsedTime: number;
  estimatedTimeRemaining: number;
}

// ============================================
// QUALITY PRESETS
// ============================================

const QUALITY_PRESETS: Record<VideoQuality, { width: number; height: number; bitrate: number }> = {
  low: { width: 640, height: 480, bitrate: 1000000 },
  medium: { width: 1280, height: 720, bitrate: 2500000 },
  high: { width: 1920, height: 1080, bitrate: 5000000 },
  ultra: { width: 3840, height: 2160, bitrate: 10000000 },
};

const FPS_OPTIONS = [15, 24, 30, 60];
const DURATION_OPTIONS = [3, 5, 10, 15, 30];

// ============================================
// VIDEO EXPORT PANEL COMPONENT
// ============================================

interface VideoExportPanelProps {
  config: VideoExportConfig;
  onChange: (config: Partial<VideoExportConfig>) => void;
  recordingState: RecordingState;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onTakeScreenshot: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement>;
}

export function VideoExportPanel({
  config,
  onChange,
  recordingState,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onTakeScreenshot,
}: VideoExportPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'gif' | 'screenshot'>('video');

  // Apply quality preset
  const applyQuality = (quality: VideoQuality) => {
    const preset = QUALITY_PRESETS[quality];
    onChange({
      quality,
      width: preset.width,
      height: preset.height,
    });
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate total frames
  const totalFrames = config.fps * config.duration;

  // Estimate file size (rough)
  const estimateFileSize = (): string => {
    const preset = QUALITY_PRESETS[config.quality];
    const bytes = (preset.bitrate * config.duration) / 8;
    if (bytes < 1024 * 1024) {
      return `~${(bytes / 1024).toFixed(1)} KB`;
    }
    return `~${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Tab Selector */}
      <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
        <button
          onClick={() => setActiveTab('video')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
            activeTab === 'video'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          <Video className="h-3 w-3" />
          Video
        </button>
        <button
          onClick={() => setActiveTab('gif')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
            activeTab === 'gif'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          <Film className="h-3 w-3" />
          GIF
        </button>
        <button
          onClick={() => setActiveTab('screenshot')}
          className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-[10px] font-medium transition-all ${
            activeTab === 'screenshot'
              ? 'bg-white/15 text-white'
              : 'text-white/50 hover:text-white/70'
          }`}
        >
          <ImageIcon className="h-3 w-3" />
          Görsel
        </button>
      </div>

      {/* Recording Progress */}
      {recordingState.isRecording && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="text-xs font-medium text-red-400">Kaydediliyor</span>
            </div>
            <span className="text-[10px] text-white/60">
              {formatTime(recordingState.elapsedTime)} / {formatTime(config.duration)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${recordingState.progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Frame Counter */}
          <div className="flex items-center justify-between text-[10px] text-white/50">
            <span>Frame: {recordingState.currentFrame} / {recordingState.totalFrames}</span>
            <span>Kalan: ~{formatTime(recordingState.estimatedTimeRemaining)}</span>
          </div>

          {/* Recording Controls */}
          <div className="flex gap-2">
            <button
              onClick={onPauseRecording}
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-white/10 py-2 text-[10px] text-white/70 hover:bg-white/15"
            >
              {recordingState.isPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              {recordingState.isPaused ? 'Devam' : 'Duraklat'}
            </button>
            <button
              onClick={onStopRecording}
              className="flex flex-1 items-center justify-center gap-1 rounded-md bg-red-500/20 py-2 text-[10px] text-red-400 hover:bg-red-500/30"
            >
              <Square className="h-3 w-3" />
              Durdur
            </button>
          </div>
        </motion.div>
      )}

      {/* Video Tab */}
      {activeTab === 'video' && !recordingState.isRecording && (
        <div className="space-y-4">
          {/* Format Selection */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Format</span>
            <div className="grid grid-cols-2 gap-1">
              {(['webm', 'mp4'] as VideoFormat[]).map((format) => (
                <button
                  key={format}
                  onClick={() => onChange({ format })}
                  className={`rounded-md py-2 text-[10px] font-medium transition-all ${
                    config.format === format
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Quality */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Kalite</span>
            <div className="grid grid-cols-4 gap-1">
              {(['low', 'medium', 'high', 'ultra'] as VideoQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => applyQuality(q)}
                  className={`flex flex-col items-center rounded-md py-1.5 text-[9px] transition-all ${
                    config.quality === q
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium">{q.charAt(0).toUpperCase() + q.slice(1)}</span>
                  <span className="text-white/30">{QUALITY_PRESETS[q].height}p</span>
                </button>
              ))}
            </div>
          </div>

          {/* Animation Type */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Animasyon</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => onChange({ animationType: 'turntable' })}
                className={`flex flex-col items-center gap-1 rounded-md py-2 transition-all ${
                  config.animationType === 'turntable'
                    ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                <RotateCw className="h-4 w-4" />
                <span className="text-[9px]">Turntable</span>
              </button>
              <button
                onClick={() => onChange({ animationType: 'static' })}
                className={`flex flex-col items-center gap-1 rounded-md py-2 transition-all ${
                  config.animationType === 'static'
                    ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                <Camera className="h-4 w-4" />
                <span className="text-[9px]">Statik</span>
              </button>
              <button
                onClick={() => onChange({ animationType: 'custom' })}
                className={`flex flex-col items-center gap-1 rounded-md py-2 transition-all ${
                  config.animationType === 'custom'
                    ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
                disabled
                title="Yakında"
              >
                <Settings className="h-4 w-4" />
                <span className="text-[9px]">Özel</span>
              </button>
            </div>
          </div>

          {/* Turntable Settings */}
          {config.animationType === 'turntable' && (
            <div className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-3">
              <div className="flex items-center gap-2">
                <RotateCw className="h-3.5 w-3.5 text-purple-400" />
                <span className="text-xs text-white/70">Turntable Ayarları</span>
              </div>

              {/* Direction */}
              <div className="flex gap-1">
                <button
                  onClick={() => onChange({ turntableDirection: 'cw' })}
                  className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                    config.turntableDirection === 'cw'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  Saat Yönü →
                </button>
                <button
                  onClick={() => onChange({ turntableDirection: 'ccw' })}
                  className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                    config.turntableDirection === 'ccw'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  ← Tersine
                </button>
              </div>

              {/* Axis */}
              <div className="flex gap-1">
                {(['y', 'x', 'z'] as const).map((axis) => (
                  <button
                    key={axis}
                    onClick={() => onChange({ turntableAxis: axis })}
                    className={`flex-1 rounded-md py-1.5 text-[10px] font-mono transition-all ${
                      config.turntableAxis === axis
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {axis.toUpperCase()} Ekseni
                  </button>
                ))}
              </div>

              {/* Speed */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/50">Dönüş Sayısı</span>
                  <span className="text-[10px] font-mono text-white/60">
                    {config.turntableSpeed}x
                  </span>
                </div>
                <input
                  type="range"
                  min={0.5}
                  max={3}
                  step={0.5}
                  value={config.turntableSpeed}
                  onChange={(e) => onChange({ turntableSpeed: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          )}

          {/* Duration & FPS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-white/50">Süre (sn)</span>
              <div className="flex gap-1">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => onChange({ duration: d })}
                    className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                      config.duration === d
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-white/50">FPS</span>
              <div className="flex gap-1">
                {FPS_OPTIONS.map((f) => (
                  <button
                    key={f}
                    onClick={() => onChange({ fps: f })}
                    className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                      config.fps === f
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="rounded-lg border border-white/10 bg-white/5 p-2 flex justify-between text-[10px] text-white/50">
            <span>Çözünürlük: {config.width}×{config.height}</span>
            <span>Kare: {totalFrames}</span>
            <span>Boyut: {estimateFileSize()}</span>
          </div>

          {/* Record Button */}
          <button
            onClick={onStartRecording}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-purple-500 py-3 text-sm font-medium text-white transition-all hover:from-red-600 hover:to-purple-600"
          >
            <Video className="h-4 w-4" />
            Kaydı Başlat
          </button>
        </div>
      )}

      {/* GIF Tab */}
      {activeTab === 'gif' && !recordingState.isRecording && (
        <div className="space-y-4">
          {/* GIF Size */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Boyut</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: 'Küçük', w: 320, h: 240 },
                { label: 'Orta', w: 480, h: 360 },
                { label: 'Büyük', w: 640, h: 480 },
              ].map((size) => (
                <button
                  key={size.label}
                  onClick={() => onChange({ width: size.w, height: size.h, format: 'gif' })}
                  className={`flex flex-col items-center rounded-md py-2 text-[9px] transition-all ${
                    config.width === size.w && config.format === 'gif'
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium">{size.label}</span>
                  <span className="text-white/30">{size.w}×{size.h}</span>
                </button>
              ))}
            </div>
          </div>

          {/* GIF FPS (lower for GIF) */}
          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Kare Hızı</span>
            <div className="flex gap-1">
              {[10, 15, 20, 24].map((f) => (
                <button
                  key={f}
                  onClick={() => onChange({ fps: f })}
                  className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                    config.fps === f
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {f} fps
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Süre (sn)</span>
            <div className="flex gap-1">
              {[2, 3, 5, 8].map((d) => (
                <button
                  key={d}
                  onClick={() => onChange({ duration: d })}
                  className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                    config.duration === d
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {d}s
                </button>
              ))}
            </div>
          </div>

          {/* GIF Record Button */}
          <button
            onClick={() => {
              onChange({ format: 'gif' });
              onStartRecording();
            }}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-teal-500 py-3 text-sm font-medium text-white transition-all hover:from-green-600 hover:to-teal-600"
          >
            <Film className="h-4 w-4" />
            GIF Oluştur
          </button>
        </div>
      )}

      {/* Screenshot Tab */}
      {activeTab === 'screenshot' && (
        <div className="space-y-4">
          {/* Resolution */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Çözünürlük</span>
            <div className="grid grid-cols-2 gap-1">
              {[
                { label: 'HD', w: 1280, h: 720 },
                { label: 'Full HD', w: 1920, h: 1080 },
                { label: '2K', w: 2560, h: 1440 },
                { label: '4K', w: 3840, h: 2160 },
              ].map((res) => (
                <button
                  key={res.label}
                  onClick={() => onChange({ width: res.w, height: res.h })}
                  className={`flex flex-col items-center rounded-md py-2 text-[9px] transition-all ${
                    config.width === res.w
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  <span className="font-medium">{res.label}</span>
                  <span className="text-white/30">{res.w}×{res.h}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Format</span>
            <div className="grid grid-cols-3 gap-1">
              {['png', 'jpg', 'webp'].map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => {}}
                  className={`rounded-md py-1.5 text-[10px] transition-all ${
                    fmt === 'png'
                      ? 'bg-purple-500/20 text-purple-300 ring-1 ring-purple-500/50'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Transparent Background */}
          <label className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 p-2">
            <span className="text-[10px] text-white/60">Şeffaf Arka Plan (PNG)</span>
            <button
              onClick={() => onChange({ transparentBackground: !config.transparentBackground })}
              className={`relative h-4 w-7 rounded-full transition-colors ${
                config.transparentBackground ? 'bg-purple-500' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  config.transparentBackground ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </label>

          {/* Screenshot Button */}
          <button
            onClick={onTakeScreenshot}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 py-3 text-sm font-medium text-white transition-all hover:from-blue-600 hover:to-cyan-600"
          >
            <Camera className="h-4 w-4" />
            Ekran Görüntüsü Al
          </button>
        </div>
      )}
    </div>
  );
}

export default VideoExportPanel;

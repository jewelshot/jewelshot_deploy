/**
 * CameraControlsPanel - Camera settings and view presets
 * 
 * Atomic Architecture: Molecule component
 * Controls: View presets, FOV, focal length, controls settings
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Video,
  Focus,
  Move,
  RotateCcw,
  ChevronDown,
  Crosshair,
  ZoomIn,
  ZoomOut,
  Eye,
} from 'lucide-react';
import {
  CAMERA_VIEW_PRESETS,
  FOCAL_LENGTH_PRESETS,
  DEFAULT_CAMERA_SETTINGS,
  focalLengthToFOV,
  fovToFocalLength,
  type CameraViewPreset,
  type CameraSettings,
  type FocalLengthPreset,
} from '@/lib/3d/camera-presets';

// ============================================
// TYPES
// ============================================

interface CameraControlsPanelProps {
  settings: CameraSettings;
  currentPresetId: string | null;
  onChange: (settings: CameraSettings) => void;
  onPresetSelect: (preset: CameraViewPreset) => void;
  onFitToView: () => void;
  onResetCamera: () => void;
  compact?: boolean;
}

// ============================================
// VIEW PRESET BUTTON
// ============================================

interface PresetButtonProps {
  preset: CameraViewPreset;
  isSelected: boolean;
  onClick: () => void;
}

function PresetButton({ preset, isSelected, onClick }: PresetButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg border p-2 transition-all ${
        isSelected
          ? 'border-purple-500/50 bg-purple-500/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
      title={preset.descriptionTr}
    >
      <span className="text-lg">{preset.icon}</span>
      <span className="text-[9px] text-white/60">{preset.nameTr}</span>
    </button>
  );
}

// ============================================
// SLIDER
// ============================================

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  icon?: React.ReactNode;
}

function Slider({ label, value, onChange, min, max, step = 1, unit = '', icon }: SliderProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon && <span className="text-white/40">{icon}</span>}
          <span className="text-[10px] text-white/50">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-white/60">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-purple-500"
      />
    </div>
  );
}

// ============================================
// TOGGLE
// ============================================

interface ToggleProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

function Toggle({ label, value, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between">
      <span className="text-[10px] text-white/60">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative h-4 w-7 rounded-full transition-colors ${
          value ? 'bg-purple-500' : 'bg-white/20'
        }`}
      >
        <span
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
            value ? 'left-[14px]' : 'left-0.5'
          }`}
        />
      </button>
    </label>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function CameraControlsPanel({
  settings,
  currentPresetId,
  onChange,
  onPresetSelect,
  onFitToView,
  onResetCamera,
  compact = false,
}: CameraControlsPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Calculate current focal length from FOV
  const currentFocalLength = useMemo(() => {
    return Math.round(fovToFocalLength(settings.fov));
  }, [settings.fov]);

  // Update FOV
  const handleFOVChange = useCallback((fov: number) => {
    onChange({ ...settings, fov });
  }, [settings, onChange]);

  // Update from focal length
  const handleFocalLengthChange = useCallback((focalLength: number) => {
    onChange({ ...settings, fov: focalLengthToFOV(focalLength) });
  }, [settings, onChange]);

  // Update zoom
  const handleZoomChange = useCallback((zoom: number) => {
    onChange({ ...settings, zoom });
  }, [settings, onChange]);

  // Update control settings
  const updateControl = useCallback(<K extends keyof CameraSettings>(
    key: K,
    value: CameraSettings[K]
  ) => {
    onChange({ ...settings, [key]: value });
  }, [settings, onChange]);

  // Reset to defaults
  const handleReset = useCallback(() => {
    onChange(DEFAULT_CAMERA_SETTINGS);
    onResetCamera();
  }, [onChange, onResetCamera]);

  return (
    <div className="space-y-4">
      {/* View Presets Grid */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-purple-400" />
          <span className="text-xs font-medium text-white/70">Görünüm Ön Ayarları</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {CAMERA_VIEW_PRESETS.map((preset) => (
            <PresetButton
              key={preset.id}
              preset={preset}
              isSelected={currentPresetId === preset.id}
              onClick={() => onPresetSelect(preset)}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={onFitToView}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-xs text-white/60 transition-colors hover:bg-white/10"
        >
          <Focus className="h-3 w-3" />
          Sığdır
        </button>
        <button
          onClick={handleReset}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 py-2 text-xs text-white/60 transition-colors hover:bg-white/10"
        >
          <RotateCcw className="h-3 w-3" />
          Sıfırla
        </button>
      </div>

      {/* FOV / Focal Length */}
      <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
        <div className="flex items-center gap-2">
          <Eye className="h-4 w-4 text-white/60" />
          <span className="text-xs font-medium text-white/70">Lens Ayarları</span>
        </div>

        {/* Focal Length Presets */}
        <div className="flex flex-wrap gap-1">
          {FOCAL_LENGTH_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleFocalLengthChange(preset.focalLength)}
              className={`rounded px-2 py-1 text-[9px] transition-colors ${
                Math.abs(currentFocalLength - preset.focalLength) < 5
                  ? 'bg-purple-500/30 text-purple-300'
                  : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
              title={preset.description}
            >
              {preset.focalLength}mm
            </button>
          ))}
        </div>

        <Slider
          label="Odak Uzaklığı"
          value={currentFocalLength}
          onChange={handleFocalLengthChange}
          min={10}
          max={200}
          step={1}
          unit="mm"
        />

        <Slider
          label="Görüş Alanı (FOV)"
          value={settings.fov}
          onChange={handleFOVChange}
          min={10}
          max={120}
          step={1}
          unit="°"
        />

        <Slider
          label="Yakınlaştırma"
          value={settings.zoom}
          onChange={handleZoomChange}
          min={0.1}
          max={5}
          step={0.1}
          unit="x"
          icon={<ZoomIn className="h-3 w-3" />}
        />
      </div>

      {/* Advanced Controls Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2"
      >
        <span className="text-xs text-white/70">Gelişmiş Kontroller</span>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </button>

      {/* Advanced Controls */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-lg border border-white/10 bg-white/5 p-3">
              {/* Damping */}
              <Toggle
                label="Yumuşak Hareket"
                value={settings.enableDamping}
                onChange={(v) => updateControl('enableDamping', v)}
              />
              {settings.enableDamping && (
                <Slider
                  label="Sönümleme"
                  value={settings.dampingFactor}
                  onChange={(v) => updateControl('dampingFactor', v)}
                  min={0.01}
                  max={0.2}
                  step={0.01}
                />
              )}

              {/* Pan */}
              <Toggle
                label="Kaydırma"
                value={settings.enablePan}
                onChange={(v) => updateControl('enablePan', v)}
              />
              {settings.enablePan && (
                <Slider
                  label="Kaydırma Hızı"
                  value={settings.panSpeed}
                  onChange={(v) => updateControl('panSpeed', v)}
                  min={0.1}
                  max={2}
                  step={0.1}
                />
              )}

              {/* Zoom */}
              <Toggle
                label="Yakınlaştırma"
                value={settings.enableZoom}
                onChange={(v) => updateControl('enableZoom', v)}
              />
              {settings.enableZoom && (
                <Slider
                  label="Yakınlaştırma Hızı"
                  value={settings.zoomSpeed}
                  onChange={(v) => updateControl('zoomSpeed', v)}
                  min={0.1}
                  max={2}
                  step={0.1}
                />
              )}

              {/* Rotate */}
              <Toggle
                label="Döndürme"
                value={settings.enableRotate}
                onChange={(v) => updateControl('enableRotate', v)}
              />
              {settings.enableRotate && (
                <Slider
                  label="Döndürme Hızı"
                  value={settings.rotateSpeed}
                  onChange={(v) => updateControl('rotateSpeed', v)}
                  min={0.1}
                  max={2}
                  step={0.1}
                />
              )}

              {/* Distance Limits */}
              <div className="space-y-2">
                <span className="text-[10px] text-white/50">Mesafe Sınırları</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] text-white/40">Min</span>
                    <input
                      type="number"
                      value={settings.minDistance}
                      onChange={(e) => updateControl('minDistance', parseFloat(e.target.value))}
                      className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white"
                      step={0.1}
                      min={0.1}
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-white/40">Max</span>
                    <input
                      type="number"
                      value={settings.maxDistance}
                      onChange={(e) => updateControl('maxDistance', parseFloat(e.target.value))}
                      className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white"
                      step={1}
                      min={1}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CameraControlsPanel;

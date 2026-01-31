/**
 * MeasurementPanel - Measurement and dimension tools for 3D viewer
 * 
 * Features:
 * - Automatic dimension detection from bounding box
 * - Ring size calculator
 * - Ruler tool for manual measurement
 * - Diameter measurement
 * - Weight estimation
 * - Export measurements
 */

'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ruler, 
  Circle, 
  Scale, 
  Download, 
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface Dimensions3D {
  width: number;  // X axis (mm)
  height: number; // Y axis (mm)
  depth: number;  // Z axis (mm)
}

export interface MeasurementConfig {
  enabled: boolean;
  showDimensions: boolean;
  showRuler: boolean;
  showBoundingBox: boolean;
  unit: 'mm' | 'cm' | 'inch';
  scale: number; // User-defined scale factor
  // Ring size
  ringMeasurement: {
    enabled: boolean;
    innerDiameter: number; // mm
    region: 'US' | 'UK' | 'EU' | 'TR';
  };
  // Weight estimation
  weightEstimation: {
    enabled: boolean;
    material: 'gold_14k' | 'gold_18k' | 'gold_24k' | 'silver_925' | 'platinum' | 'custom';
    customDensity: number; // g/cm³
    volume: number; // cm³
  };
  // Dimension labels
  labelVisibility: {
    width: boolean;
    height: boolean;
    depth: boolean;
    diameter: boolean;
  };
}

export const DEFAULT_MEASUREMENT_CONFIG: MeasurementConfig = {
  enabled: false,
  showDimensions: true,
  showRuler: false,
  showBoundingBox: false,
  unit: 'mm',
  scale: 1,
  ringMeasurement: {
    enabled: false,
    innerDiameter: 17,
    region: 'US',
  },
  weightEstimation: {
    enabled: false,
    material: 'gold_18k',
    customDensity: 15.5,
    volume: 0,
  },
  labelVisibility: {
    width: true,
    height: true,
    depth: true,
    diameter: false,
  },
};

// ============================================
// CONSTANTS
// ============================================

// Material densities (g/cm³)
const MATERIAL_DENSITIES: Record<string, { name: string; density: number }> = {
  gold_14k: { name: '14K Altın', density: 13.1 },
  gold_18k: { name: '18K Altın', density: 15.5 },
  gold_24k: { name: '24K Altın', density: 19.3 },
  silver_925: { name: '925 Gümüş', density: 10.4 },
  platinum: { name: 'Platin', density: 21.4 },
  custom: { name: 'Özel', density: 0 },
};

// Ring size conversion tables
const RING_SIZE_TABLE = {
  US: [
    { size: '3', diameter: 14.1 },
    { size: '3.5', diameter: 14.5 },
    { size: '4', diameter: 14.9 },
    { size: '4.5', diameter: 15.3 },
    { size: '5', diameter: 15.7 },
    { size: '5.5', diameter: 16.1 },
    { size: '6', diameter: 16.5 },
    { size: '6.5', diameter: 16.9 },
    { size: '7', diameter: 17.3 },
    { size: '7.5', diameter: 17.7 },
    { size: '8', diameter: 18.1 },
    { size: '8.5', diameter: 18.5 },
    { size: '9', diameter: 18.9 },
    { size: '9.5', diameter: 19.4 },
    { size: '10', diameter: 19.8 },
    { size: '10.5', diameter: 20.2 },
    { size: '11', diameter: 20.6 },
    { size: '11.5', diameter: 21.0 },
    { size: '12', diameter: 21.4 },
  ],
  EU: [
    { size: '44', diameter: 14.1 },
    { size: '45.5', diameter: 14.5 },
    { size: '47', diameter: 14.9 },
    { size: '48', diameter: 15.3 },
    { size: '49.5', diameter: 15.7 },
    { size: '51', diameter: 16.1 },
    { size: '52', diameter: 16.5 },
    { size: '53', diameter: 16.9 },
    { size: '54', diameter: 17.3 },
    { size: '55.5', diameter: 17.7 },
    { size: '57', diameter: 18.1 },
    { size: '58', diameter: 18.5 },
    { size: '59', diameter: 18.9 },
    { size: '61', diameter: 19.4 },
    { size: '62', diameter: 19.8 },
    { size: '63.5', diameter: 20.2 },
    { size: '65', diameter: 20.6 },
    { size: '66', diameter: 21.0 },
    { size: '67.5', diameter: 21.4 },
  ],
  UK: [
    { size: 'F', diameter: 14.1 },
    { size: 'G', diameter: 14.5 },
    { size: 'H', diameter: 14.9 },
    { size: 'I', diameter: 15.3 },
    { size: 'J', diameter: 15.7 },
    { size: 'K', diameter: 16.1 },
    { size: 'L', diameter: 16.5 },
    { size: 'M', diameter: 16.9 },
    { size: 'N', diameter: 17.3 },
    { size: 'O', diameter: 17.7 },
    { size: 'P', diameter: 18.1 },
    { size: 'Q', diameter: 18.5 },
    { size: 'R', diameter: 18.9 },
    { size: 'S', diameter: 19.4 },
    { size: 'T', diameter: 19.8 },
    { size: 'U', diameter: 20.2 },
    { size: 'V', diameter: 20.6 },
    { size: 'W', diameter: 21.0 },
    { size: 'X', diameter: 21.4 },
  ],
  TR: [
    { size: '4', diameter: 14.1 },
    { size: '5', diameter: 14.5 },
    { size: '6', diameter: 14.9 },
    { size: '7', diameter: 15.3 },
    { size: '8', diameter: 15.7 },
    { size: '9', diameter: 16.1 },
    { size: '10', diameter: 16.5 },
    { size: '11', diameter: 16.9 },
    { size: '12', diameter: 17.3 },
    { size: '13', diameter: 17.7 },
    { size: '14', diameter: 18.1 },
    { size: '15', diameter: 18.5 },
    { size: '16', diameter: 18.9 },
    { size: '17', diameter: 19.4 },
    { size: '18', diameter: 19.8 },
    { size: '19', diameter: 20.2 },
    { size: '20', diameter: 20.6 },
    { size: '21', diameter: 21.0 },
    { size: '22', diameter: 21.4 },
  ],
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function convertUnit(value: number, fromUnit: 'mm', toUnit: 'mm' | 'cm' | 'inch'): number {
  if (toUnit === 'mm') return value;
  if (toUnit === 'cm') return value / 10;
  if (toUnit === 'inch') return value / 25.4;
  return value;
}

function formatDimension(value: number, unit: 'mm' | 'cm' | 'inch'): string {
  const converted = convertUnit(value, 'mm', unit);
  if (unit === 'mm') return `${converted.toFixed(1)} mm`;
  if (unit === 'cm') return `${converted.toFixed(2)} cm`;
  if (unit === 'inch') return `${converted.toFixed(2)}"`;
  return `${converted.toFixed(1)}`;
}

function findRingSize(diameter: number, region: 'US' | 'UK' | 'EU' | 'TR'): string {
  const table = RING_SIZE_TABLE[region];
  // Find closest match
  let closest = table[0];
  let minDiff = Math.abs(diameter - table[0].diameter);
  
  for (const entry of table) {
    const diff = Math.abs(diameter - entry.diameter);
    if (diff < minDiff) {
      minDiff = diff;
      closest = entry;
    }
  }
  
  return closest.size;
}

// ============================================
// COLLAPSIBLE SECTION
// ============================================

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function Section({ title, icon, expanded, onToggle, children }: SectionProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-3"
      >
        <div className="flex items-center gap-2">
          <span className="text-white/70">{icon}</span>
          <span className="text-xs font-medium text-white/80">{title}</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-white/40" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/40" />
        )}
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/5"
          >
            <div className="space-y-3 p-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MEASUREMENT PANEL COMPONENT
// ============================================

interface MeasurementPanelProps {
  config: MeasurementConfig;
  onChange: (config: Partial<MeasurementConfig>) => void;
  dimensions?: Dimensions3D | null;
  onRecalculate?: () => void;
}

export function MeasurementPanel({
  config,
  onChange,
  dimensions,
  onRecalculate,
}: MeasurementPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    dimensions: true,
    ring: false,
    weight: false,
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Calculate ring size based on inner diameter
  const ringSize = useMemo(() => {
    if (!config.ringMeasurement.enabled) return null;
    return findRingSize(config.ringMeasurement.innerDiameter, config.ringMeasurement.region);
  }, [config.ringMeasurement]);

  // Calculate estimated weight
  const estimatedWeight = useMemo(() => {
    if (!config.weightEstimation.enabled || !config.weightEstimation.volume) return null;
    
    const material = MATERIAL_DENSITIES[config.weightEstimation.material];
    const density = config.weightEstimation.material === 'custom' 
      ? config.weightEstimation.customDensity 
      : material.density;
    
    return config.weightEstimation.volume * density;
  }, [config.weightEstimation]);

  // Export measurements as JSON
  const exportMeasurements = () => {
    const data = {
      dimensions: dimensions ? {
        width: formatDimension(dimensions.width * config.scale, config.unit),
        height: formatDimension(dimensions.height * config.scale, config.unit),
        depth: formatDimension(dimensions.depth * config.scale, config.unit),
      } : null,
      ringSize: ringSize ? {
        diameter: `${config.ringMeasurement.innerDiameter} mm`,
        size: ringSize,
        region: config.ringMeasurement.region,
      } : null,
      weight: estimatedWeight ? {
        value: `${estimatedWeight.toFixed(2)} g`,
        material: MATERIAL_DENSITIES[config.weightEstimation.material].name,
      } : null,
      unit: config.unit,
      scale: config.scale,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'measurements.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Master Toggle */}
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-xs text-white/70">Ölçüm Araçları</span>
        <button
          onClick={() => onChange({ enabled: !config.enabled })}
          className={`relative h-3.5 w-7 rounded-full transition-colors ${
            config.enabled ? 'bg-white/40' : 'bg-white/15'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow-sm transition-transform ${
              config.enabled ? 'translate-x-3.5' : 'translate-x-0'
            }`}
          />
        </button>
      </label>

      {config.enabled && (
        <>
          {/* Unit & Scale */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-white/50">Birim</span>
              <div className="flex gap-1">
                {(['mm', 'cm', 'inch'] as const).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => onChange({ unit })}
                    className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                      config.unit === unit
                        ? 'bg-white/12 text-white/90'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-white/50">Ölçek</span>
              <input
                type="number"
                value={config.scale}
                onChange={(e) => onChange({ scale: parseFloat(e.target.value) || 1 })}
                min={0.1}
                max={100}
                step={0.1}
                className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          {/* Dimensions Section */}
          <Section
            title="Boyutlar"
            icon={<Ruler className="h-3.5 w-3.5" />}
            expanded={expandedSections.dimensions}
            onToggle={() => toggleSection('dimensions')}
          >
            {dimensions ? (
              <div className="space-y-2">
                {/* Dimension Values */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg bg-white/5 p-2 text-center">
                    <span className="text-[9px] text-white/40">Genişlik (X)</span>
                    <p className="text-sm font-mono text-white">
                      {formatDimension(dimensions.width * config.scale, config.unit)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 text-center">
                    <span className="text-[9px] text-white/40">Yükseklik (Y)</span>
                    <p className="text-sm font-mono text-white">
                      {formatDimension(dimensions.height * config.scale, config.unit)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 text-center">
                    <span className="text-[9px] text-white/40">Derinlik (Z)</span>
                    <p className="text-sm font-mono text-white">
                      {formatDimension(dimensions.depth * config.scale, config.unit)}
                    </p>
                  </div>
                </div>

                {/* Label Visibility */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(['width', 'height', 'depth'] as const).map((dim) => (
                    <label key={dim} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.labelVisibility[dim]}
                        onChange={(e) => onChange({
                          labelVisibility: { ...config.labelVisibility, [dim]: e.target.checked }
                        })}
                        className="viewer-slider"
                      />
                      <span className="text-[10px] text-white/50">
                        {dim === 'width' ? 'X' : dim === 'height' ? 'Y' : 'Z'}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Recalculate Button */}
                {onRecalculate && (
                  <button
                    onClick={onRecalculate}
                    className="flex w-full items-center justify-center gap-1 rounded-md bg-white/5 py-1.5 text-[10px] text-white/60 hover:bg-white/10"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Yeniden Hesapla
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md bg-white/5 p-3 text-[10px] text-white/50">
                <Info className="h-4 w-4" />
                Model yüklendiğinde boyutlar görünecek
              </div>
            )}
          </Section>

          {/* Ring Size Section */}
          <Section
            title="Yüzük Ölçüsü"
            icon={<Circle className="h-3.5 w-3.5" />}
            expanded={expandedSections.ring}
            onToggle={() => toggleSection('ring')}
          >
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-[10px] text-white/50">Yüzük Ölçüsü Hesapla</span>
              <button
                onClick={() => onChange({
                  ringMeasurement: { ...config.ringMeasurement, enabled: !config.ringMeasurement.enabled }
                })}
                className={`relative h-4 w-7 rounded-full transition-colors ${
                  config.ringMeasurement.enabled ? 'bg-white/40' : 'bg-white/15'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                    config.ringMeasurement.enabled ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>

            {config.ringMeasurement.enabled && (
              <div className="space-y-3 pt-2">
                {/* Inner Diameter Input */}
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40">İç Çap (mm)</span>
                  <input
                    type="number"
                    value={config.ringMeasurement.innerDiameter}
                    onChange={(e) => onChange({
                      ringMeasurement: { 
                        ...config.ringMeasurement, 
                        innerDiameter: parseFloat(e.target.value) || 0 
                      }
                    })}
                    min={10}
                    max={30}
                    step={0.1}
                    className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-mono text-white"
                  />
                </div>

                {/* Region Selection */}
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40">Bölge</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(['US', 'UK', 'EU', 'TR'] as const).map((region) => (
                      <button
                        key={region}
                        onClick={() => onChange({
                          ringMeasurement: { ...config.ringMeasurement, region }
                        })}
                        className={`rounded-md py-1.5 text-[10px] transition-all ${
                          config.ringMeasurement.region === region
                            ? 'bg-white/12 text-white/90'
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result */}
                {ringSize && (
                  <div className="rounded-lg bg-white/10 border border-white/20 p-3 text-center">
                    <span className="text-[10px] text-white/90">Yüzük Ölçüsü</span>
                    <p className="text-2xl font-bold text-white">{ringSize}</p>
                    <span className="text-[10px] text-white/50">
                      {config.ringMeasurement.region} standartı
                    </span>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* Weight Estimation Section */}
          <Section
            title="Ağırlık Tahmini"
            icon={<Scale className="h-3.5 w-3.5" />}
            expanded={expandedSections.weight}
            onToggle={() => toggleSection('weight')}
          >
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-[10px] text-white/50">Ağırlık Hesapla</span>
              <button
                onClick={() => onChange({
                  weightEstimation: { ...config.weightEstimation, enabled: !config.weightEstimation.enabled }
                })}
                className={`relative h-4 w-7 rounded-full transition-colors ${
                  config.weightEstimation.enabled ? 'bg-white/40' : 'bg-white/15'
                }`}
              >
                <span
                  className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                    config.weightEstimation.enabled ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </label>

            {config.weightEstimation.enabled && (
              <div className="space-y-3 pt-2">
                {/* Material Selection */}
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40">Malzeme</span>
                  <div className="grid grid-cols-3 gap-1">
                    {Object.entries(MATERIAL_DENSITIES).map(([id, { name }]) => (
                      <button
                        key={id}
                        onClick={() => onChange({
                          weightEstimation: { 
                            ...config.weightEstimation, 
                            material: id as MeasurementConfig['weightEstimation']['material']
                          }
                        })}
                        className={`rounded-md py-1.5 text-[8px] transition-all ${
                          config.weightEstimation.material === id
                            ? 'bg-white/12 text-white/90'
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Density (if custom material) */}
                {config.weightEstimation.material === 'custom' && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-white/40">Yoğunluk (g/cm³)</span>
                    <input
                      type="number"
                      value={config.weightEstimation.customDensity}
                      onChange={(e) => onChange({
                        weightEstimation: { 
                          ...config.weightEstimation, 
                          customDensity: parseFloat(e.target.value) || 0 
                        }
                      })}
                      min={0.1}
                      max={25}
                      step={0.1}
                      className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-mono text-white"
                    />
                  </div>
                )}

                {/* Volume Input */}
                <div className="space-y-1">
                  <span className="text-[10px] text-white/40">Hacim (cm³)</span>
                  <input
                    type="number"
                    value={config.weightEstimation.volume}
                    onChange={(e) => onChange({
                      weightEstimation: { 
                        ...config.weightEstimation, 
                        volume: parseFloat(e.target.value) || 0 
                      }
                    })}
                    min={0}
                    step={0.01}
                    className="w-full rounded-md border border-white/10 bg-white/5 px-2 py-1.5 text-xs font-mono text-white"
                  />
                </div>

                {/* Result */}
                {estimatedWeight !== null && estimatedWeight > 0 && (
                  <div className="rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-center">
                    <span className="text-[10px] text-green-300">Tahmini Ağırlık</span>
                    <p className="text-2xl font-bold text-white">{estimatedWeight.toFixed(2)} g</p>
                    <span className="text-[10px] text-white/50">
                      {MATERIAL_DENSITIES[config.weightEstimation.material].name}
                    </span>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* Display Options */}
          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-[10px] text-white/50">Görüntüleme</span>
            <div className="space-y-1">
              <label className="flex cursor-pointer items-center justify-between rounded-md bg-white/5 px-2 py-1.5">
                <span className="text-[10px] text-white/60">Boyut Etiketleri</span>
                <input
                  type="checkbox"
                  checked={config.showDimensions}
                  onChange={(e) => onChange({ showDimensions: e.target.checked })}
                  className="viewer-slider"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between rounded-md bg-white/5 px-2 py-1.5">
                <span className="text-[10px] text-white/60">Sınırlayıcı Kutu</span>
                <input
                  type="checkbox"
                  checked={config.showBoundingBox}
                  onChange={(e) => onChange({ showBoundingBox: e.target.checked })}
                  className="viewer-slider"
                />
              </label>
            </div>
          </div>

          {/* Export Button */}
          <button
            onClick={exportMeasurements}
            disabled={!dimensions}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-white/15 to-white/10 py-2.5 text-xs font-medium text-white transition-all hover:from-white/20 hover:to-white/15 disabled:opacity-50"
          >
            <Download className="h-3.5 w-3.5" />
            Ölçümleri Dışa Aktar
          </button>
        </>
      )}
    </div>
  );
}

export default MeasurementPanel;

/**
 * FileNamingFormat Component
 * Allows users to configure how output files will be named
 */

'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface FileNamingConfig {
  pattern: 'original_number' | 'number_original' | 'batch_number' | 'custom';
  prefix: string;
  suffix: string;
  separator: '_' | '-' | '.';
  startNumber: number;
}

interface FileNamingFormatProps {
  config: FileNamingConfig;
  onChange: (config: FileNamingConfig) => void;
  sampleFilename?: string;
  disabled?: boolean;
}

const PATTERNS = [
  { value: 'original_number', label: 'Original + Numara', example: 'ring_1, ring_2, ring_3' },
  { value: 'number_original', label: 'Numara + Original', example: '1_ring, 2_ring, 3_ring' },
  { value: 'batch_number', label: 'Batch + Numara', example: 'batch_1, batch_2, batch_3' },
  { value: 'custom', label: 'Özel Format', example: 'prefix_1_suffix' },
] as const;

const SEPARATORS = [
  { value: '_', label: 'Alt Çizgi (_)' },
  { value: '-', label: 'Tire (-)' },
  { value: '.', label: 'Nokta (.)' },
] as const;

export function FileNamingFormat({
  config,
  onChange,
  sampleFilename = 'image.jpg',
  disabled = false,
}: FileNamingFormatProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get base filename without extension
  const baseName = useMemo(() => {
    const lastDot = sampleFilename.lastIndexOf('.');
    return lastDot > 0 ? sampleFilename.substring(0, lastDot) : sampleFilename;
  }, [sampleFilename]);

  // Generate preview filenames
  const previewFilenames = useMemo(() => {
    const sep = config.separator;
    const start = config.startNumber;
    const results: string[] = [];

    for (let i = 0; i < 3; i++) {
      const num = start + i;
      let name = '';

      switch (config.pattern) {
        case 'original_number':
          name = `${baseName}${sep}${num}`;
          break;
        case 'number_original':
          name = `${num}${sep}${baseName}`;
          break;
        case 'batch_number':
          name = `batch${sep}${num}`;
          break;
        case 'custom':
          const prefix = config.prefix || baseName;
          const suffix = config.suffix ? `${sep}${config.suffix}` : '';
          name = `${prefix}${sep}${num}${suffix}`;
          break;
      }

      results.push(name + '.jpg');
    }

    return results;
  }, [config, baseName]);

  const handlePatternChange = (pattern: FileNamingConfig['pattern']) => {
    onChange({ ...config, pattern });
  };

  const handleSeparatorChange = (separator: FileNamingConfig['separator']) => {
    onChange({ ...config, separator });
  };

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02]">
      {/* Header - Collapsible */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-white/5"
        disabled={disabled}
      >
        <div>
          <div className="flex items-center gap-2 text-sm font-medium text-white">
            Dosya Adı Formatı
            <span className="text-white/30">(optional)</span>
          </div>
          <div className="mt-0.5 text-xs text-white/50">
            {previewFilenames[0]}, {previewFilenames[1]}, ...
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-white/50" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/50" />
        )}
      </button>

      {/* Expanded Options */}
      {isExpanded && (
        <div className="space-y-4 border-t border-white/10 p-3">
          {/* Pattern Selection */}
          <div>
            <label className="mb-2 block text-xs text-white/60">Format Deseni</label>
            <div className="grid grid-cols-2 gap-2">
              {PATTERNS.map((pattern) => (
                <button
                  key={pattern.value}
                  type="button"
                  onClick={() => handlePatternChange(pattern.value)}
                  disabled={disabled}
                  className={`rounded-lg border p-2 text-left transition-all ${
                    config.pattern === pattern.value
                      ? 'border-purple-500/50 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-medium text-white">{pattern.label}</div>
                  <div className="mt-0.5 text-[10px] text-white/40">{pattern.example}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Format Options */}
          {config.pattern === 'custom' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-white/60">Prefix</label>
                <input
                  type="text"
                  value={config.prefix}
                  onChange={(e) => onChange({ ...config, prefix: e.target.value })}
                  placeholder={baseName}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none"
                  disabled={disabled}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/60">Suffix</label>
                <input
                  type="text"
                  value={config.suffix}
                  onChange={(e) => onChange({ ...config, suffix: e.target.value })}
                  placeholder="(optional)"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-purple-500/50 focus:outline-none"
                  disabled={disabled}
                />
              </div>
            </div>
          )}

          {/* Separator */}
          <div>
            <label className="mb-2 block text-xs text-white/60">Ayırıcı</label>
            <div className="flex gap-2">
              {SEPARATORS.map((sep) => (
                <button
                  key={sep.value}
                  type="button"
                  onClick={() => handleSeparatorChange(sep.value)}
                  disabled={disabled}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs transition-all ${
                    config.separator === sep.value
                      ? 'border-purple-500/50 bg-purple-500/10 text-white'
                      : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                  }`}
                >
                  {sep.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Number */}
          <div>
            <label className="mb-2 block text-xs text-white/60">Başlangıç Numarası</label>
            <input
              type="number"
              min={0}
              max={9999}
              value={config.startNumber}
              onChange={(e) => onChange({ ...config, startNumber: parseInt(e.target.value) || 1 })}
              className="w-24 rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-500/50 focus:outline-none"
              disabled={disabled}
            />
          </div>

          {/* Preview */}
          <div className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="mb-2 text-xs text-white/50">Önizleme:</div>
            <div className="flex flex-wrap gap-2">
              {previewFilenames.map((name, i) => (
                <span key={i} className="rounded bg-white/10 px-2 py-1 font-mono text-xs text-green-400">
                  {name}
                </span>
              ))}
              <span className="text-xs text-white/30">...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Default config
export const defaultFileNamingConfig: FileNamingConfig = {
  pattern: 'original_number',
  prefix: '',
  suffix: '',
  separator: '_',
  startNumber: 1,
};

// Helper function to generate output filename
export function generateOutputFilename(
  originalFilename: string,
  index: number,
  config: FileNamingConfig
): string {
  const lastDot = originalFilename.lastIndexOf('.');
  const baseName = lastDot > 0 ? originalFilename.substring(0, lastDot) : originalFilename;
  const extension = lastDot > 0 ? originalFilename.substring(lastDot) : '.jpg';
  const sep = config.separator;
  const num = config.startNumber + index;

  let name = '';

  switch (config.pattern) {
    case 'original_number':
      name = `${baseName}${sep}${num}`;
      break;
    case 'number_original':
      name = `${num}${sep}${baseName}`;
      break;
    case 'batch_number':
      name = `batch${sep}${num}`;
      break;
    case 'custom':
      const prefix = config.prefix || baseName;
      const suffix = config.suffix ? `${sep}${config.suffix}` : '';
      name = `${prefix}${sep}${num}${suffix}`;
      break;
  }

  return name + extension;
}

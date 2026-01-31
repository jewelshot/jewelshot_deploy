/**
 * AnnotationPanel - Annotation and labeling tools for 3D viewer
 * 
 * Features:
 * - Text labels with customizable styling
 * - Callout lines connecting labels to points
 * - Dimension labels
 * - Export annotations with render
 * - Annotation presets
 */

'use client';

import React, { useState, useCallback } from 'react';
import { ThrottledRangeInput } from '@/components/atoms/ThrottledRangeInput';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tag,
  Type,
  ArrowUpRight,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Download,
  ChevronDown,
  ChevronUp,
  Move,
  Palette,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export type AnnotationType = 'label' | 'callout' | 'dimension' | 'note';
export type LabelPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type CalloutStyle = 'line' | 'arrow' | 'elbow' | 'curved';

export interface LabelStyle {
  fontSize: number;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontWeight: 'normal' | 'medium' | 'bold';
  color: string;
  backgroundColor: string;
  backgroundOpacity: number;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  padding: number;
}

export interface CalloutLineStyle {
  style: CalloutStyle;
  color: string;
  width: number;
  dashPattern: 'solid' | 'dashed' | 'dotted';
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  text: string;
  visible: boolean;
  // 3D world position (for attachment point)
  position: { x: number; y: number; z: number };
  // 2D screen offset for label
  labelOffset: { x: number; y: number };
  labelPosition: LabelPosition;
  // Styling
  labelStyle: LabelStyle;
  calloutStyle: CalloutLineStyle;
  // For dimensions
  endPosition?: { x: number; y: number; z: number };
  unit?: 'mm' | 'cm' | 'inch';
}

export interface AnnotationConfig {
  enabled: boolean;
  annotations: Annotation[];
  showAllLabels: boolean;
  showCalloutLines: boolean;
  globalLabelStyle: LabelStyle;
  globalCalloutStyle: CalloutLineStyle;
  // Export options
  exportWithRender: boolean;
  exportScale: number;
}

export const DEFAULT_LABEL_STYLE: LabelStyle = {
  fontSize: 12,
  fontFamily: 'sans',
  fontWeight: 'medium',
  color: '#ffffff',
  backgroundColor: '#1a1a1a',
  backgroundOpacity: 0.9,
  borderColor: '#333333',
  borderWidth: 1,
  borderRadius: 4,
  padding: 8,
};

export const DEFAULT_CALLOUT_STYLE: CalloutLineStyle = {
  style: 'arrow',
  color: '#ffffff',
  width: 1,
  dashPattern: 'solid',
};

export const DEFAULT_ANNOTATION_CONFIG: AnnotationConfig = {
  enabled: false,
  annotations: [],
  showAllLabels: true,
  showCalloutLines: true,
  globalLabelStyle: DEFAULT_LABEL_STYLE,
  globalCalloutStyle: DEFAULT_CALLOUT_STYLE,
  exportWithRender: true,
  exportScale: 2,
};

// ============================================
// PRESET STYLES
// ============================================

export const LABEL_STYLE_PRESETS: { id: string; name: string; style: Partial<LabelStyle> }[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    style: {
      fontSize: 11,
      fontFamily: 'sans',
      fontWeight: 'normal',
      color: '#ffffff',
      backgroundColor: 'transparent',
      backgroundOpacity: 0,
      borderWidth: 0,
    },
  },
  {
    id: 'dark',
    name: 'Koyu',
    style: {
      fontSize: 12,
      fontFamily: 'sans',
      fontWeight: 'medium',
      color: '#ffffff',
      backgroundColor: '#1a1a1a',
      backgroundOpacity: 0.95,
      borderColor: '#333333',
      borderWidth: 1,
    },
  },
  {
    id: 'light',
    name: 'Açık',
    style: {
      fontSize: 12,
      fontFamily: 'sans',
      fontWeight: 'medium',
      color: '#1a1a1a',
      backgroundColor: '#ffffff',
      backgroundOpacity: 0.95,
      borderColor: '#e0e0e0',
      borderWidth: 1,
    },
  },
  {
    id: 'technical',
    name: 'Teknik',
    style: {
      fontSize: 10,
      fontFamily: 'mono',
      fontWeight: 'normal',
      color: '#00ff88',
      backgroundColor: '#0a0a0a',
      backgroundOpacity: 0.9,
      borderColor: '#00ff88',
      borderWidth: 1,
    },
  },
  {
    id: 'elegant',
    name: 'Zarif',
    style: {
      fontSize: 13,
      fontFamily: 'serif',
      fontWeight: 'normal',
      color: '#d4af37',
      backgroundColor: '#1a1510',
      backgroundOpacity: 0.9,
      borderColor: '#d4af37',
      borderWidth: 1,
    },
  },
];

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
// ANNOTATION ITEM
// ============================================

interface AnnotationItemProps {
  annotation: Annotation;
  onUpdate: (updates: Partial<Annotation>) => void;
  onDelete: () => void;
  onEdit: () => void;
}

function AnnotationItem({ annotation, onUpdate, onDelete, onEdit }: AnnotationItemProps) {
  return (
    <div className="flex items-center gap-2 rounded-md bg-white/5 p-2">
      <button
        onClick={() => onUpdate({ visible: !annotation.visible })}
        className="text-white/40 hover:text-white/70"
      >
        {annotation.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <p className="text-xs text-white/70 truncate">{annotation.text || 'Adsız Etiket'}</p>
        <p className="text-[10px] text-white/40 capitalize">{annotation.type}</p>
      </div>
      
      <button
        onClick={onEdit}
        className="text-white/40 hover:text-white/70"
      >
        <Edit2 className="h-3.5 w-3.5" />
      </button>
      
      <button
        onClick={onDelete}
        className="text-white/40 hover:text-red-400"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ============================================
// ANNOTATION PANEL
// ============================================

interface AnnotationPanelProps {
  config: AnnotationConfig;
  onChange: (config: Partial<AnnotationConfig>) => void;
  onAddAnnotation?: (type: AnnotationType) => void;
  onPickPoint?: () => void; // Trigger 3D point picking mode
  selectedAnnotationId?: string | null;
  onSelectAnnotation?: (id: string | null) => void;
}

export function AnnotationPanel({
  config,
  onChange,
  onAddAnnotation,
  onPickPoint,
  selectedAnnotationId,
  onSelectAnnotation,
}: AnnotationPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    annotations: true,
    style: false,
    export: false,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Add new annotation
  const handleAddAnnotation = useCallback((type: AnnotationType) => {
    const newAnnotation: Annotation = {
      id: `annotation-${Date.now()}`,
      type,
      text: type === 'label' ? 'Yeni Etiket' : type === 'callout' ? 'Açıklama' : type === 'dimension' ? '' : 'Not',
      visible: true,
      position: { x: 0, y: 0, z: 0 },
      labelOffset: { x: 50, y: -50 },
      labelPosition: 'auto',
      labelStyle: { ...config.globalLabelStyle },
      calloutStyle: { ...config.globalCalloutStyle },
    };

    onChange({
      annotations: [...config.annotations, newAnnotation],
    });

    onAddAnnotation?.(type);
  }, [config.annotations, config.globalLabelStyle, config.globalCalloutStyle, onChange, onAddAnnotation]);

  // Update annotation
  const handleUpdateAnnotation = useCallback((id: string, updates: Partial<Annotation>) => {
    onChange({
      annotations: config.annotations.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    });
  }, [config.annotations, onChange]);

  // Delete annotation
  const handleDeleteAnnotation = useCallback((id: string) => {
    onChange({
      annotations: config.annotations.filter((a) => a.id !== id),
    });
  }, [config.annotations, onChange]);

  // Update global label style
  const updateGlobalLabelStyle = (updates: Partial<LabelStyle>) => {
    onChange({ globalLabelStyle: { ...config.globalLabelStyle, ...updates } });
  };

  // Apply style preset
  const applyStylePreset = (preset: typeof LABEL_STYLE_PRESETS[0]) => {
    updateGlobalLabelStyle(preset.style);
  };

  // Export annotations
  const handleExportAnnotations = () => {
    const data = {
      annotations: config.annotations,
      style: config.globalLabelStyle,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'annotations.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Master Toggle */}
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-xs text-white/70">Etiketler & Açıklamalar</span>
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
          {/* Quick Add Buttons */}
          <div className="grid grid-cols-4 gap-1">
            {([
              { type: 'label' as const, icon: <Type className="h-4 w-4" />, name: 'Etiket' },
              { type: 'callout' as const, icon: <ArrowUpRight className="h-4 w-4" />, name: 'Açıklama' },
              { type: 'dimension' as const, icon: <Move className="h-4 w-4" />, name: 'Boyut' },
              { type: 'note' as const, icon: <Tag className="h-4 w-4" />, name: 'Not' },
            ]).map((item) => (
              <button
                key={item.type}
                onClick={() => handleAddAnnotation(item.type)}
                className="flex flex-col items-center gap-1 rounded-lg border border-dashed border-white/20 bg-white/5 p-2 text-white/50 hover:border-white/30 hover:bg-white/5 hover:text-white/90"
              >
                {item.icon}
                <span className="text-[9px]">{item.name}</span>
              </button>
            ))}
          </div>

          {/* Annotations List Section */}
          <Section
            title={`Etiketler (${config.annotations.length})`}
            icon={<Tag className="h-3.5 w-3.5" />}
            expanded={expandedSections.annotations}
            onToggle={() => toggleSection('annotations')}
          >
            {/* Display Options */}
            <div className="flex gap-2 pb-2 border-b border-white/10">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showAllLabels}
                  onChange={(e) => onChange({ showAllLabels: e.target.checked })}
                  className="viewer-slider"
                />
                <span className="text-[10px] text-white/50">Tümünü Göster</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showCalloutLines}
                  onChange={(e) => onChange({ showCalloutLines: e.target.checked })}
                  className="viewer-slider"
                />
                <span className="text-[10px] text-white/50">Çizgileri Göster</span>
              </label>
            </div>

            {/* Annotations List */}
            {config.annotations.length > 0 ? (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {config.annotations.map((annotation) => (
                  <AnnotationItem
                    key={annotation.id}
                    annotation={annotation}
                    onUpdate={(updates) => handleUpdateAnnotation(annotation.id, updates)}
                    onDelete={() => handleDeleteAnnotation(annotation.id)}
                    onEdit={() => {
                      setEditingId(annotation.id);
                      onSelectAnnotation?.(annotation.id);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-[10px] text-white/40">
                Henüz etiket eklenmedi
              </div>
            )}

            {/* Pick Point Button */}
            {onPickPoint && (
              <button
                onClick={onPickPoint}
                className="flex w-full items-center justify-center gap-1 rounded-md bg-white/10 border border-white/20 py-2 text-[10px] text-white/90 hover:bg-white/12"
              >
                <Plus className="h-3.5 w-3.5" />
                3D Nokta Seç ve Etiket Ekle
              </button>
            )}
          </Section>

          {/* Style Section */}
          <Section
            title="Stil Ayarları"
            icon={<Palette className="h-3.5 w-3.5" />}
            expanded={expandedSections.style}
            onToggle={() => toggleSection('style')}
          >
            {/* Presets */}
            <div className="space-y-2">
              <span className="text-[10px] text-white/50">Stil Presetleri</span>
              <div className="grid grid-cols-5 gap-1">
                {LABEL_STYLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyStylePreset(preset)}
                    className="rounded-md bg-white/5 py-1.5 text-[8px] text-white/60 hover:bg-white/10"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Yazı Boyutu</span>
                <span className="text-[10px] font-mono text-white/60">
                  {config.globalLabelStyle.fontSize}px
                </span>
              </div>
              <ThrottledRangeInput
                
                min={8}
                max={24}
                step={1}
                value={config.globalLabelStyle.fontSize}
                onChange={(v) => updateGlobalLabelStyle({ fontSize: v })}
                
              />
            </div>

            {/* Font Family */}
            <div className="flex gap-1">
              {(['sans', 'serif', 'mono'] as const).map((family) => (
                <button
                  key={family}
                  onClick={() => updateGlobalLabelStyle({ fontFamily: family })}
                  className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                    config.globalLabelStyle.fontFamily === family
                      ? 'bg-white/12 text-white/90'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                  style={{ fontFamily: family === 'mono' ? 'monospace' : family === 'serif' ? 'serif' : 'sans-serif' }}
                >
                  {family === 'sans' ? 'Sans' : family === 'serif' ? 'Serif' : 'Mono'}
                </button>
              ))}
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[10px] text-white/40">Yazı Rengi</span>
                <input
                  type="color"
                  value={config.globalLabelStyle.color}
                  onChange={(e) => updateGlobalLabelStyle({ color: e.target.value })}
                  className="h-8 w-full cursor-pointer rounded border border-white/10 bg-transparent"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-white/40">Arka Plan</span>
                <input
                  type="color"
                  value={config.globalLabelStyle.backgroundColor}
                  onChange={(e) => updateGlobalLabelStyle({ backgroundColor: e.target.value })}
                  className="h-8 w-full cursor-pointer rounded border border-white/10 bg-transparent"
                />
              </div>
            </div>

            {/* Background Opacity */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-white/50">Arka Plan Opaklığı</span>
                <span className="text-[10px] font-mono text-white/60">
                  {Math.round(config.globalLabelStyle.backgroundOpacity * 100)}%
                </span>
              </div>
              <ThrottledRangeInput
                
                min={0}
                max={1}
                step={0.05}
                value={config.globalLabelStyle.backgroundOpacity}
                onChange={(v) => updateGlobalLabelStyle({ backgroundOpacity: v })}
                
              />
            </div>

            {/* Callout Style */}
            <div className="pt-2 border-t border-white/10 space-y-2">
              <span className="text-[10px] text-white/50">Çizgi Stili</span>
              <div className="grid grid-cols-4 gap-1">
                {(['line', 'arrow', 'elbow', 'curved'] as CalloutStyle[]).map((style) => (
                  <button
                    key={style}
                    onClick={() => onChange({
                      globalCalloutStyle: { ...config.globalCalloutStyle, style }
                    })}
                    className={`rounded-md py-1.5 text-[9px] transition-all ${
                      config.globalCalloutStyle.style === style
                        ? 'bg-white/12 text-white/90'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {style === 'line' ? 'Düz' : style === 'arrow' ? 'Ok' : style === 'elbow' ? 'Dirsek' : 'Eğri'}
                  </button>
                ))}
              </div>
            </div>
          </Section>

          {/* Export Section */}
          <Section
            title="Dışa Aktarma"
            icon={<Download className="h-3.5 w-3.5" />}
            expanded={expandedSections.export}
            onToggle={() => toggleSection('export')}
          >
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-[10px] text-white/50">Render ile Birlikte</span>
              <input
                type="checkbox"
                checked={config.exportWithRender}
                onChange={(e) => onChange({ exportWithRender: e.target.checked })}
                className="viewer-slider"
              />
            </label>

            <div className="space-y-1">
              <span className="text-[10px] text-white/50">Ölçek</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((scale) => (
                  <button
                    key={scale}
                    onClick={() => onChange({ exportScale: scale })}
                    className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                      config.exportScale === scale
                        ? 'bg-white/12 text-white/90'
                        : 'bg-white/5 text-white/50 hover:bg-white/10'
                    }`}
                  >
                    {scale}x
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExportAnnotations}
              disabled={config.annotations.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-white/15 to-white/10 py-2 text-xs font-medium text-white transition-all hover:from-white/20 hover:to-white/15 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              Etiketleri Dışa Aktar (JSON)
            </button>
          </Section>
        </>
      )}
    </div>
  );
}

export default AnnotationPanel;

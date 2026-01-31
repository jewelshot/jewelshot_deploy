/**
 * Layer Panel Component
 * 
 * Displays a list of model layers with:
 * - Visibility toggle
 * - Material assignment
 * - Layer type indicator (metal/stone)
 * - Weight display
 */

'use client';

import React from 'react';
import {
  Layers,
  Eye,
  EyeOff,
  ChevronRight,
  GripVertical,
  Gem,
  CircleDot,
  HelpCircle,
} from 'lucide-react';
import { useViewer3DStore, type ViewerLayer } from '@/store/viewer3dStore';
import { formatWeight, formatCarats } from '@/lib/3d/weight-calculator';
import { useLanguage } from '@/lib/i18n';

// ============================================
// LAYER LIST ITEM
// ============================================

interface LayerListItemProps {
  layer: ViewerLayer;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onOpenMaterialPicker: () => void;
}

function LayerListItem({
  layer,
  isSelected,
  onSelect,
  onToggleVisibility,
  onOpenMaterialPicker,
}: LayerListItemProps) {
  // Get category icon
  const getCategoryIcon = () => {
    switch (layer.category) {
      case 'metal':
      case 'setting':
        return <CircleDot className="h-3 w-3" />;
      case 'stone':
        return <Gem className="h-3 w-3" />;
      default:
        return <HelpCircle className="h-3 w-3" />;
    }
  };

  // Get category color
  const getCategoryColor = () => {
    switch (layer.category) {
      case 'metal':
        return 'text-yellow-400';
      case 'setting':
        return 'text-yellow-500';
      case 'stone':
        return 'text-cyan-400';
      default:
        return 'text-white/40';
    }
  };

  // Format weight for display
  const getWeightDisplay = () => {
    if (!layer.weight) return null;
    
    if (layer.category === 'stone') {
      return formatCarats(layer.weight.weightCarats || 0);
    }
    return formatWeight(layer.weight.weightGrams);
  };

  return (
    <div
      className={`group relative rounded-lg border transition-all ${
        isSelected
          ? 'border-white/30 bg-white/10'
          : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
      }`}
    >
      <div className="flex items-center gap-2 px-2 py-2">
        {/* Drag Handle */}
        <div className="cursor-grab opacity-0 group-hover:opacity-50 hover:opacity-100">
          <GripVertical className="h-3 w-3 text-white/40" />
        </div>

        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility();
          }}
          className={`flex h-6 w-6 items-center justify-center rounded transition-colors ${
            layer.visible
              ? 'text-white/70 hover:bg-white/10'
              : 'text-white/30 hover:bg-white/10'
          }`}
          title={layer.visible ? 'Hide layer' : 'Show layer'}
        >
          {layer.visible ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
        </button>

        {/* Color Swatch */}
        <div
          className="h-3 w-3 rounded-full border border-white/20"
          style={{ backgroundColor: layer.color }}
        />

        {/* Layer Name & Category */}
        <button
          onClick={onSelect}
          className="flex flex-1 flex-col items-start overflow-hidden"
        >
          <span className="w-full truncate text-left text-xs text-white/80">
            {layer.name}
          </span>
          <div className="flex items-center gap-1">
            <span className={`${getCategoryColor()}`}>{getCategoryIcon()}</span>
            <span className="text-[10px] text-white/40">
              {layer.objectCount} object{layer.objectCount !== 1 ? 's' : ''}
            </span>
          </div>
        </button>

        {/* Weight Display */}
        {layer.weight && (
          <span className="text-[10px] text-white/50">{getWeightDisplay()}</span>
        )}

        {/* Material Picker Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenMaterialPicker();
          }}
          className="flex h-6 w-6 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white/70"
          title="Change material"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      {/* Confidence Indicator */}
      {layer.detection.confidence < 0.7 && (
        <div className="absolute -right-1 -top-1">
          <div
            className="h-2 w-2 rounded-full bg-amber-500"
            title={`Low confidence: ${Math.round(layer.detection.confidence * 100)}%`}
          />
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN LAYER PANEL
// ============================================

interface LayerPanelProps {
  onLayerMaterialChange?: (layerId: string) => void;
}

export function LayerPanel({ onLayerMaterialChange }: LayerPanelProps) {
  const { t } = useLanguage();
  const layers = useViewer3DStore((state) => state.layers);
  const selectedLayerId = useViewer3DStore((state) => state.selectedLayerId);
  const selectLayer = useViewer3DStore((state) => state.selectLayer);
  const toggleLayerVisibility = useViewer3DStore((state) => state.toggleLayerVisibility);

  // Separate layers by category
  const metalLayers = layers.filter(
    (l) => l.category === 'metal' || l.category === 'setting'
  );
  const stoneLayers = layers.filter((l) => l.category === 'stone');
  const otherLayers = layers.filter((l) => l.category === 'unknown');

  if (layers.length === 0) {
    return (
      <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-white/70" />
          <h3 className="text-sm font-medium text-white/90">Layers</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Layers className="h-8 w-8 text-white/20 mb-2" />
          <p className="text-xs text-white/40">
            {t.viewer3d?.noLayers || 'No layers loaded'}
          </p>
          <p className="text-[10px] text-white/30 mt-1">
            {t.viewer3d?.uploadToSeeLayers || 'Upload a 3DM file to see layers'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-white/70" />
          <h3 className="text-sm font-medium text-white/90">Layers</h3>
        </div>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">
          {layers.length}
        </span>
      </div>

      {/* Metal Layers Section */}
      {metalLayers.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <CircleDot className="h-3 w-3 text-yellow-400" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-yellow-400/70">
              {t.viewer3d?.metalLayers || 'Metal'} ({metalLayers.length})
            </span>
          </div>
          <div className="space-y-1">
            {metalLayers.map((layer) => (
              <LayerListItem
                key={layer.id}
                layer={layer}
                isSelected={layer.id === selectedLayerId}
                onSelect={() => selectLayer(layer.id)}
                onToggleVisibility={() => toggleLayerVisibility(layer.id)}
                onOpenMaterialPicker={() => onLayerMaterialChange?.(layer.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Stone Layers Section */}
      {stoneLayers.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <Gem className="h-3 w-3 text-cyan-400" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-cyan-400/70">
              {t.viewer3d?.stoneLayers || 'Gemstones'} ({stoneLayers.length})
            </span>
          </div>
          <div className="space-y-1">
            {stoneLayers.map((layer) => (
              <LayerListItem
                key={layer.id}
                layer={layer}
                isSelected={layer.id === selectedLayerId}
                onSelect={() => selectLayer(layer.id)}
                onToggleVisibility={() => toggleLayerVisibility(layer.id)}
                onOpenMaterialPicker={() => onLayerMaterialChange?.(layer.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Layers Section */}
      {otherLayers.length > 0 && (
        <div>
          <div className="mb-2 flex items-center gap-2">
            <HelpCircle className="h-3 w-3 text-white/40" />
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
              {t.viewer3d?.otherLayers || 'Other'} ({otherLayers.length})
            </span>
          </div>
          <div className="space-y-1">
            {otherLayers.map((layer) => (
              <LayerListItem
                key={layer.id}
                layer={layer}
                isSelected={layer.id === selectedLayerId}
                onSelect={() => selectLayer(layer.id)}
                onToggleVisibility={() => toggleLayerVisibility(layer.id)}
                onOpenMaterialPicker={() => onLayerMaterialChange?.(layer.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2 border-t border-white/10 pt-3">
        <button
          onClick={() => layers.forEach((l) => toggleLayerVisibility(l.id))}
          className="flex-1 rounded-lg bg-white/5 py-1.5 text-[10px] text-white/50 hover:bg-white/10 hover:text-white/70"
        >
          Toggle All
        </button>
        <button
          onClick={() => selectLayer(null)}
          className="flex-1 rounded-lg bg-white/5 py-1.5 text-[10px] text-white/50 hover:bg-white/10 hover:text-white/70"
        >
          Deselect
        </button>
      </div>
    </div>
  );
}

export default LayerPanel;

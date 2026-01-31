/**
 * LayerGroupPanel - Grouped layer management panel
 * 
 * Atomic Architecture: Molecule component
 * Groups layers by category (Metal, Stone, Other)
 * With expandable accordions and batch visibility controls
 */

'use client';

import React, { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Gem,
  CircleDot,
  HelpCircle,
  Settings,
  Lock,
  Unlock,
  Palette,
} from 'lucide-react';
import { formatWeight, formatCarats } from '@/lib/3d/weight-calculator';

// ============================================
// TYPES
// ============================================

export type LayerCategory = 'metal' | 'stone' | 'setting' | 'other' | 'unknown';

export interface LayerItem {
  id: string;
  name: string;
  visible: boolean;
  locked?: boolean;
  color: string;
  category: LayerCategory;
  materialId: string | null;
  weightGrams?: number;
  weightCarats?: number;
}

interface LayerGroup {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  layers: LayerItem[];
  expanded: boolean;
  allVisible: boolean;
}

interface LayerGroupPanelProps {
  layers: LayerItem[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onToggleLayerVisibility: (id: string) => void;
  onToggleAllVisibility: (category: LayerCategory, visible: boolean) => void;
  onOpenMaterialPicker?: (layerId: string) => void;
  compact?: boolean;
}

// ============================================
// CATEGORY CONFIG
// ============================================

const CATEGORY_CONFIG: Record<LayerCategory, { name: string; nameTr: string; icon: React.ReactNode; color: string; order: number }> = {
  metal: {
    name: 'Metals',
    nameTr: 'Metaller',
    icon: <CircleDot className="h-4 w-4" />,
    color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    order: 1,
  },
  setting: {
    name: 'Settings',
    nameTr: 'Ayarlar',
    icon: <Settings className="h-4 w-4" />,
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/10',
    order: 2,
  },
  stone: {
    name: 'Stones',
    nameTr: 'Taşlar',
    icon: <Gem className="h-4 w-4" />,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    order: 3,
  },
  other: {
    name: 'Other',
    nameTr: 'Diğer',
    icon: <HelpCircle className="h-4 w-4" />,
    color: 'text-gray-400 border-gray-500/30 bg-gray-500/10',
    order: 4,
  },
  unknown: {
    name: 'Unknown',
    nameTr: 'Bilinmeyen',
    icon: <HelpCircle className="h-4 w-4" />,
    color: 'text-gray-400 border-gray-500/30 bg-gray-500/10',
    order: 5,
  },
};

// ============================================
// LAYER ITEM COMPONENT
// ============================================

interface LayerItemRowProps {
  layer: LayerItem;
  isSelected: boolean;
  onSelect: () => void;
  onToggleVisibility: () => void;
  onOpenMaterialPicker?: () => void;
  compact?: boolean;
}

const LayerItemRow = memo(function LayerItemRow({
  layer,
  isSelected,
  onSelect,
  onToggleVisibility,
  onOpenMaterialPicker,
  compact = false,
}: LayerItemRowProps) {
  const categoryConfig = CATEGORY_CONFIG[layer.category];
  
  // Format weight display
  const weightDisplay = useMemo(() => {
    if (layer.category === 'stone' && layer.weightCarats) {
      return formatCarats(layer.weightCarats);
    }
    if (layer.weightGrams) {
      return formatWeight(layer.weightGrams);
    }
    return null;
  }, [layer.category, layer.weightCarats, layer.weightGrams]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      onClick={onSelect}
      className={`group flex items-center gap-2 rounded-lg border px-2 py-1.5 transition-all cursor-pointer ${
        isSelected
          ? 'border-white/30 bg-white/10'
          : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
      }`}
    >
      {/* Visibility Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleVisibility();
        }}
        className={`rounded p-1 transition-colors ${
          layer.visible
            ? 'text-white/70 hover:bg-white/10 hover:text-white'
            : 'text-white/30 hover:bg-white/10 hover:text-white/60'
        }`}
      >
        {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
      </button>

      {/* Color Indicator */}
      <div
        className="h-3 w-3 rounded-full border border-white/20"
        style={{ backgroundColor: layer.color }}
      />

      {/* Layer Name */}
      <span className={`flex-1 truncate text-xs ${layer.visible ? 'text-white/80' : 'text-white/40'}`}>
        {layer.name}
      </span>

      {/* Weight */}
      {weightDisplay && !compact && (
        <span className="text-[10px] text-white/40">{weightDisplay}</span>
      )}

      {/* Material Picker Button */}
      {onOpenMaterialPicker && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenMaterialPicker();
          }}
          className="rounded p-1 text-white/30 opacity-0 transition-all hover:bg-white/10 hover:text-white group-hover:opacity-100"
          title="Malzeme Seç"
        >
          <Palette className="h-3 w-3" />
        </button>
      )}
    </motion.div>
  );
});

// ============================================
// GROUP HEADER COMPONENT
// ============================================

interface GroupHeaderProps {
  group: LayerGroup;
  onToggleExpand: () => void;
  onToggleAllVisibility: () => void;
}

const GroupHeader = memo(function GroupHeader({ group, onToggleExpand, onToggleAllVisibility }: GroupHeaderProps) {
  const categoryConfig = CATEGORY_CONFIG[group.id as LayerCategory] || CATEGORY_CONFIG.unknown;
  
  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer transition-all hover:bg-white/5 ${categoryConfig.color}`}
      onClick={onToggleExpand}
    >
      {/* Expand/Collapse Icon */}
      <motion.div animate={{ rotate: group.expanded ? 90 : 0 }}>
        <ChevronRight className="h-4 w-4" />
      </motion.div>

      {/* Category Icon */}
      {group.icon}

      {/* Group Name */}
      <span className="flex-1 text-sm font-medium">{group.name}</span>

      {/* Layer Count */}
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px]">
        {group.layers.length}
      </span>

      {/* Visibility Toggle */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleAllVisibility();
        }}
        className={`rounded p-1 transition-colors ${
          group.allVisible
            ? 'text-white/70 hover:bg-white/15'
            : 'text-white/30 hover:bg-white/15'
        }`}
        title={group.allVisible ? 'Tümünü Gizle' : 'Tümünü Göster'}
      >
        {group.allVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      </button>
    </div>
  );
});

// ============================================
// MAIN COMPONENT
// ============================================

export function LayerGroupPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onToggleLayerVisibility,
  onToggleAllVisibility,
  onOpenMaterialPicker,
  compact = false,
}: LayerGroupPanelProps) {
  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(['metal', 'stone'])
  );

  // Group layers by category
  const groups = useMemo((): LayerGroup[] => {
    const categoryMap = new Map<LayerCategory, LayerItem[]>();

    // Initialize categories
    (['metal', 'setting', 'stone', 'other', 'unknown'] as LayerCategory[]).forEach((cat) => {
      categoryMap.set(cat, []);
    });

    // Sort layers into categories
    layers.forEach((layer) => {
      const cat = layer.category || 'unknown';
      const list = categoryMap.get(cat) || [];
      list.push(layer);
      categoryMap.set(cat, list);
    });

    // Create groups array
    const result: LayerGroup[] = [];
    categoryMap.forEach((layerList, category) => {
      if (layerList.length > 0) {
        const config = CATEGORY_CONFIG[category];
        result.push({
          id: category,
          name: config.nameTr,
          icon: config.icon,
          color: config.color,
          layers: layerList,
          expanded: expandedGroups.has(category),
          allVisible: layerList.every((l) => l.visible),
        });
      }
    });

    // Sort by order
    return result.sort((a, b) => {
      const orderA = CATEGORY_CONFIG[a.id as LayerCategory]?.order || 99;
      const orderB = CATEGORY_CONFIG[b.id as LayerCategory]?.order || 99;
      return orderA - orderB;
    });
  }, [layers, expandedGroups]);

  // Toggle group expansion
  const toggleGroupExpand = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  // Toggle all visibility in a group
  const handleToggleGroupVisibility = useCallback(
    (group: LayerGroup) => {
      onToggleAllVisibility(group.id as LayerCategory, !group.allVisible);
    },
    [onToggleAllVisibility]
  );

  // Calculate totals
  const totals = useMemo(() => {
    let metalGrams = 0;
    let stoneCarats = 0;

    layers.forEach((layer) => {
      if (layer.category === 'metal' || layer.category === 'setting') {
        metalGrams += layer.weightGrams || 0;
      } else if (layer.category === 'stone') {
        stoneCarats += layer.weightCarats || 0;
      }
    });

    return { metalGrams, stoneCarats };
  }, [layers]);

  if (layers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Layers className="mb-2 h-8 w-8 text-white/20" />
        <p className="text-sm text-white/40">Katman bulunamadı</p>
        <p className="mt-1 text-xs text-white/30">Bir 3D model yükleyin</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-white/70" />
          <span className="text-sm font-medium text-white/80">Katmanlar</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/50">
            {layers.length}
          </span>
        </div>
      </div>

      {/* Weight Summary */}
      {(totals.metalGrams > 0 || totals.stoneCarats > 0) && (
        <div className="flex gap-2 text-[10px]">
          {totals.metalGrams > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-yellow-500/10 px-2 py-1 text-yellow-400">
              <CircleDot className="h-3 w-3" />
              {formatWeight(totals.metalGrams)}
            </span>
          )}
          {totals.stoneCarats > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-1 text-cyan-400">
              <Gem className="h-3 w-3" />
              {formatCarats(totals.stoneCarats)}
            </span>
          )}
        </div>
      )}

      {/* Groups */}
      <div className="space-y-2">
        {groups.map((group) => (
          <div key={group.id} className="space-y-1">
            {/* Group Header */}
            <GroupHeader
              group={group}
              onToggleExpand={() => toggleGroupExpand(group.id)}
              onToggleAllVisibility={() => handleToggleGroupVisibility(group)}
            />

            {/* Group Layers */}
            <AnimatePresence>
              {group.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pl-4"
                >
                  <div className="space-y-1 border-l border-white/10 pl-3 pt-1">
                    {group.layers.map((layer) => (
                      <LayerItemRow
                        key={layer.id}
                        layer={layer}
                        isSelected={selectedLayerId === layer.id}
                        onSelect={() => onSelectLayer(layer.id)}
                        onToggleVisibility={() => onToggleLayerVisibility(layer.id)}
                        onOpenMaterialPicker={
                          onOpenMaterialPicker
                            ? () => onOpenMaterialPicker(layer.id)
                            : undefined
                        }
                        compact={compact}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LayerGroupPanel;

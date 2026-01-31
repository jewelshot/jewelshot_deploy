/**
 * Material Picker Component
 * 
 * Modal/dropdown for selecting materials for a layer.
 * Supports metals and gemstones with visual previews.
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Gem,
  CircleDot,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  getMetalsByCategory,
  getGemstonesByCategory,
  type MaterialInfo,
} from '@/lib/3d/materials-database';
import { useLanguage } from '@/lib/i18n';

// ============================================
// TYPES
// ============================================

interface MaterialPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentMaterialId: string | null;
  layerCategory: 'metal' | 'stone' | 'setting' | 'unknown';
  onSelectMaterial: (materialId: string) => void;
}

// ============================================
// MATERIAL ITEM
// ============================================

interface MaterialItemProps {
  material: MaterialInfo;
  isSelected: boolean;
  onSelect: () => void;
}

function MaterialItem({ material, isSelected, onSelect }: MaterialItemProps) {
  return (
    <button
      onClick={onSelect}
      className={`group relative flex items-center gap-3 w-full rounded-lg border p-2 transition-all ${
        isSelected
          ? 'border-white/50 bg-white/12'
          : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
      }`}
    >
      {/* Color Preview */}
      <div
        className={`h-8 w-8 rounded-lg border ${
          material.type === 'stone'
            ? 'border-white/20'
            : 'border-white/10'
        }`}
        style={{
          background:
            material.type === 'stone'
              ? `radial-gradient(circle at 30% 30%, white 0%, ${material.color} 50%, ${material.color} 100%)`
              : `linear-gradient(135deg, ${material.color} 0%, ${adjustColor(material.color, -20)} 100%)`,
          boxShadow:
            material.type === 'stone'
              ? `0 0 10px ${material.color}40`
              : `inset 0 -2px 4px rgba(0,0,0,0.3)`,
        }}
      />

      {/* Material Info */}
      <div className="flex-1 text-left">
        <div className="flex items-center gap-1">
          <span className="text-xs font-medium text-white/90">
            {material.name}
          </span>
          {material.emoji && (
            <span className="text-xs">{material.emoji}</span>
          )}
        </div>
        <span className="text-[10px] text-white/40">
          ρ = {material.density} g/cm³
        </span>
      </div>

      {/* Selected Indicator */}
      {isSelected && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/40">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}

      {/* Stone Sparkle Effect */}
      {material.type === 'stone' && (
        <Sparkles className="absolute right-2 top-2 h-3 w-3 text-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}

// ============================================
// CATEGORY SECTION
// ============================================

interface CategorySectionProps {
  title: string;
  materials: MaterialInfo[];
  currentMaterialId: string | null;
  onSelectMaterial: (materialId: string) => void;
  defaultOpen?: boolean;
}

function CategorySection({
  title,
  materials,
  currentMaterialId,
  onSelectMaterial,
  defaultOpen = false,
}: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  if (materials.length === 0) return null;

  return (
    <div className="mb-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 hover:bg-white/5"
      >
        <span className="text-[10px] font-medium uppercase tracking-wider text-white/50">
          {title} ({materials.length})
        </span>
        <ChevronDown
          className={`h-3 w-3 text-white/40 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="mt-1 space-y-1">
          {materials.map((material) => (
            <MaterialItem
              key={material.id}
              material={material}
              isSelected={material.id === currentMaterialId}
              onSelect={() => onSelectMaterial(material.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function MaterialPicker({
  isOpen,
  onClose,
  currentMaterialId,
  layerCategory,
  onSelectMaterial,
}: MaterialPickerProps) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'metals' | 'stones'>(
    layerCategory === 'stone' ? 'stones' : 'metals'
  );

  // Get materials by category
  const metalsByCategory = useMemo(() => getMetalsByCategory(), []);
  const gemstonesByCategory = useMemo(() => getGemstonesByCategory(), []);

  // Filter materials by search
  const filterMaterials = (materials: MaterialInfo[]) => {
    if (!searchQuery) return materials;
    const query = searchQuery.toLowerCase();
    return materials.filter(
      (m) =>
        m.name.toLowerCase().includes(query) ||
        m.nameTR.toLowerCase().includes(query) ||
        m.id.includes(query)
    );
  };

  // Handle material selection
  const handleSelect = (materialId: string) => {
    onSelectMaterial(materialId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[80vh] flex flex-col rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 p-4">
          <div className="flex items-center gap-2">
            {layerCategory === 'stone' ? (
              <Gem className="h-5 w-5 text-cyan-400" />
            ) : (
              <CircleDot className="h-5 w-5 text-yellow-400" />
            )}
            <h2 className="text-sm font-medium text-white">
              {t.viewer3d?.selectMaterial || 'Select Material'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-white/10"
          >
            <X className="h-4 w-4 text-white/60" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-white/10 px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder={t.viewer3d?.searchMaterials || 'Search materials...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-white/5 py-2 pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:ring-1 focus:ring-white/25"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('metals')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'metals'
                ? 'border-b-2 border-yellow-400 text-yellow-400'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <CircleDot className="h-3 w-3" />
              <span>{t.viewer3d?.metals || 'Metals'}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('stones')}
            className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
              activeTab === 'stones'
                ? 'border-b-2 border-cyan-400 text-cyan-400'
                : 'text-white/50 hover:text-white/70'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Gem className="h-3 w-3" />
              <span>{t.viewer3d?.gemstones || 'Gemstones'}</span>
            </div>
          </button>
        </div>

        {/* Materials List */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'metals' && (
            <>
              {Object.entries(metalsByCategory).map(([category, materials]) => (
                <CategorySection
                  key={category}
                  title={category}
                  materials={filterMaterials(materials)}
                  currentMaterialId={currentMaterialId}
                  onSelectMaterial={handleSelect}
                  defaultOpen={category === 'Yellow Gold'}
                />
              ))}
            </>
          )}

          {activeTab === 'stones' && (
            <>
              {Object.entries(gemstonesByCategory).map(([category, materials]) => (
                <CategorySection
                  key={category}
                  title={category}
                  materials={filterMaterials(materials)}
                  currentMaterialId={currentMaterialId}
                  onSelectMaterial={handleSelect}
                  defaultOpen={category === 'Diamond'}
                />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-white/5 py-2 text-xs text-white/60 hover:bg-white/10"
          >
            {t.common?.cancel || 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default MaterialPicker;

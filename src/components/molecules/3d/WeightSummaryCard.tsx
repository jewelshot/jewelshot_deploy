/**
 * Weight Summary Card Component
 * 
 * Displays total weight calculations:
 * - Total metal weight (grams)
 * - Total stone weight (carats)
 * - Material breakdown
 * - Export options
 */

'use client';

import React, { useState } from 'react';
import {
  Scale,
  Gem,
  CircleDot,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { useViewer3DStore, type WeightSummary } from '@/store/viewer3dStore';
import { formatWeight, formatCarats } from '@/lib/3d/weight-calculator';
import { useLanguage } from '@/lib/i18n';

// ============================================
// WEIGHT ROW
// ============================================

interface WeightRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
}

function WeightRow({ label, value, icon, color = 'text-white/70' }: WeightRowProps) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2">
        {icon && <span className={color}>{icon}</span>}
        <span className="text-xs text-white/60">{label}</span>
      </div>
      <span className={`text-xs font-medium ${color}`}>{value}</span>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

interface WeightSummaryCardProps {
  className?: string;
  /** Optional: Single STL geometry weight in grams (when no layers available) */
  singleGeometryWeight?: number;
  /** Optional: Single STL geometry volume in mm³ */
  singleGeometryVolume?: number;
  /** Optional: Material name for single geometry */
  singleGeometryMaterial?: string;
}

export function WeightSummaryCard({ 
  className = '',
  singleGeometryWeight,
  singleGeometryVolume,
  singleGeometryMaterial = 'Custom Metal',
}: WeightSummaryCardProps) {
  const { t } = useLanguage();
  const weightSummary = useViewer3DStore((state) => state.weightSummary);
  const layers = useViewer3DStore((state) => state.layers);
  const fileName = useViewer3DStore((state) => state.fileName);
  const units = useViewer3DStore((state) => state.units);

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Check if we have single geometry data (STL files)
  const hasSingleGeometry = singleGeometryWeight !== undefined && singleGeometryWeight > 0;
  const hasLayerData = weightSummary && layers.length > 0;

  // No data state - only show if neither single geometry nor layers available
  if (!hasLayerData && !hasSingleGeometry) {
    return (
      <div className={`rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md ${className}`}>
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-medium text-white/90">
            {t.viewer3d?.weightSummary || 'Weight Summary'}
          </h3>
        </div>
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <Scale className="h-8 w-8 text-white/20 mb-2" />
          <p className="text-xs text-white/40">
            {t.viewer3d?.noWeightData || 'No weight data available'}
          </p>
          <p className="text-[10px] text-white/30 mt-1">
            {t.viewer3d?.assignMaterials || 'Assign materials to calculate weight'}
          </p>
        </div>
      </div>
    );
  }
  
  // Single geometry mode (STL files without layers)
  if (hasSingleGeometry && !hasLayerData) {
    return (
      <div className={`rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md ${className}`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Scale className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-medium text-white/90">
            {t.viewer3d?.weightSummary || 'Weight Summary'}
          </h3>
        </div>

        {/* Single Geometry Weight */}
        <div className="rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <CircleDot className="h-3 w-3 text-yellow-400" />
            <span className="text-[10px] uppercase tracking-wider text-yellow-400/70">
              {singleGeometryMaterial}
            </span>
          </div>
          <div className="text-lg font-semibold text-yellow-300">
            {formatWeight(singleGeometryWeight)}
          </div>
          <div className="text-[10px] text-yellow-400/50 space-y-0.5">
            <div>{(singleGeometryWeight / 31.1035).toFixed(3)} oz troy</div>
            {singleGeometryVolume !== undefined && (
              <div>Volume: {singleGeometryVolume.toFixed(2)} mm³</div>
            )}
          </div>
        </div>
        
        <p className="mt-3 text-[9px] text-white/30 text-center">
          Weight calculated based on selected material density
        </p>
      </div>
    );
  }
  
  // At this point we must have layer data with valid weightSummary
  if (!weightSummary) return null;

  const { totalMetalGrams, totalStoneCarats, breakdown } = weightSummary;

  // Generate report text
  const generateReportText = () => {
    let report = `═══════════════════════════════════════\n`;
    report += `  JEWELSHOT 3D VIEWER - WEIGHT REPORT\n`;
    report += `═══════════════════════════════════════\n\n`;
    
    report += `📁 File: ${fileName || 'Unknown'}\n`;
    report += `📏 Units: ${units}\n`;
    report += `📅 Date: ${new Date().toLocaleDateString()}\n\n`;
    
    report += `─────────────────────────────────────\n`;
    report += `  SUMMARY\n`;
    report += `─────────────────────────────────────\n\n`;
    
    report += `⚙️ Total Metal:  ${formatWeight(totalMetalGrams)}\n`;
    report += `💎 Total Stone:  ${formatCarats(totalStoneCarats)}\n\n`;
    
    if (breakdown.metals.length > 0) {
      report += `─────────────────────────────────────\n`;
      report += `  METAL BREAKDOWN\n`;
      report += `─────────────────────────────────────\n\n`;
      
      breakdown.metals.forEach((metal) => {
        report += `  • ${metal.name}: ${formatWeight(metal.grams)}\n`;
      });
      report += '\n';
    }
    
    if (breakdown.stones.length > 0) {
      report += `─────────────────────────────────────\n`;
      report += `  STONE BREAKDOWN\n`;
      report += `─────────────────────────────────────\n\n`;
      
      breakdown.stones.forEach((stone) => {
        report += `  • ${stone.name}: ${formatCarats(stone.carats)}\n`;
      });
      report += '\n';
    }
    
    report += `─────────────────────────────────────\n`;
    report += `  LAYER DETAILS\n`;
    report += `─────────────────────────────────────\n\n`;
    
    layers.forEach((layer) => {
      if (layer.weight) {
        const weightDisplay = layer.category === 'stone' 
          ? formatCarats(layer.weight.weightCarats || 0)
          : formatWeight(layer.weight.weightGrams);
        report += `  ${layer.name}\n`;
        report += `    Material: ${layer.weight.material.name}\n`;
        report += `    Weight: ${weightDisplay}\n\n`;
      }
    });
    
    report += `═══════════════════════════════════════\n`;
    report += `  Generated by Jewelshot 3D Viewer\n`;
    report += `  https://jewelshot.ai\n`;
    report += `═══════════════════════════════════════\n`;
    
    return report;
  };

  // Copy report to clipboard
  const handleCopyReport = async () => {
    try {
      await navigator.clipboard.writeText(generateReportText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Download as text file
  const handleDownloadReport = () => {
    const report = generateReportText();
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName?.replace(/\.[^/.]+$/, '') || 'model'}-weight-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`rounded-xl border border-white/10 bg-black/40 p-4 backdrop-blur-md ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-purple-400" />
          <h3 className="text-sm font-medium text-white/90">
            {t.viewer3d?.weightSummary || 'Weight Summary'}
          </h3>
        </div>
      </div>

      {/* Main Totals */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Metal Total */}
        <div className="rounded-lg bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <CircleDot className="h-3 w-3 text-yellow-400" />
            <span className="text-[10px] uppercase tracking-wider text-yellow-400/70">
              Metal
            </span>
          </div>
          <div className="text-lg font-semibold text-yellow-300">
            {formatWeight(totalMetalGrams)}
          </div>
          {totalMetalGrams > 0 && (
            <div className="text-[10px] text-yellow-400/50">
              {(totalMetalGrams / 31.1035).toFixed(3)} oz troy
            </div>
          )}
        </div>

        {/* Stone Total */}
        <div className="rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Gem className="h-3 w-3 text-cyan-400" />
            <span className="text-[10px] uppercase tracking-wider text-cyan-400/70">
              Gemstones
            </span>
          </div>
          <div className="text-lg font-semibold text-cyan-300">
            {formatCarats(totalStoneCarats)}
          </div>
          {totalStoneCarats > 0 && (
            <div className="text-[10px] text-cyan-400/50">
              {(totalStoneCarats * 0.2).toFixed(3)} g
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Toggle */}
      {(breakdown.metals.length > 0 || breakdown.stones.length > 0) && (
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex w-full items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60 hover:bg-white/10"
        >
          <span>{t.viewer3d?.materialBreakdown || 'Material Breakdown'}</span>
          {showBreakdown ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      )}

      {/* Breakdown Details */}
      {showBreakdown && (
        <div className="mt-3 space-y-3 border-t border-white/10 pt-3">
          {/* Metal Breakdown */}
          {breakdown.metals.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CircleDot className="h-3 w-3 text-yellow-400" />
                <span className="text-[10px] uppercase tracking-wider text-yellow-400/50">
                  Metals
                </span>
              </div>
              <div className="space-y-1 pl-4">
                {breakdown.metals.map((metal) => (
                  <WeightRow
                    key={metal.materialId}
                    label={metal.name}
                    value={formatWeight(metal.grams)}
                    color="text-yellow-300/70"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Stone Breakdown */}
          {breakdown.stones.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Gem className="h-3 w-3 text-cyan-400" />
                <span className="text-[10px] uppercase tracking-wider text-cyan-400/50">
                  Gemstones
                </span>
              </div>
              <div className="space-y-1 pl-4">
                {breakdown.stones.map((stone) => (
                  <WeightRow
                    key={stone.materialId}
                    label={stone.name}
                    value={formatCarats(stone.carats)}
                    color="text-cyan-300/70"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export Actions */}
      <div className="mt-4 flex gap-2 border-t border-white/10 pt-3">
        <button
          onClick={handleCopyReport}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-2 text-[10px] text-white/60 hover:bg-white/10 hover:text-white/80"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy Report</span>
            </>
          )}
        </button>
        <button
          onClick={handleDownloadReport}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white/5 py-2 text-[10px] text-white/60 hover:bg-white/10 hover:text-white/80"
        >
          <Download className="h-3 w-3" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );
}

export default WeightSummaryCard;

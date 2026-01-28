/**
 * ThreeDViewerSidebar - Integrated sidebar for 3D viewer with all panels
 * 
 * Features:
 * - Accordion-based panel organization
 * - All viewer controls in one place
 * - Responsive and collapsible
 */

'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Layers,
  Sun,
  Palette,
  Sparkles,
  Video,
  Settings,
  Box,
  Image,
  RotateCw,
  Diamond,
  Sliders,
  X,
} from 'lucide-react';

// Store
import { useThreeDViewerStore } from '@/store/threeDViewerStore';

// Panels
import { GroundPlaneControls } from '@/components/molecules/3d/GroundPlane';
import { LightingPanel } from '@/components/molecules/3d/LightingPanel';
import { BackgroundPanel } from '@/components/molecules/3d/BackgroundPanel';
import { EdgeSmoothingPanel } from '@/components/molecules/3d/EdgeSmoothingPanel';
import { HDRPanel } from '@/components/molecules/3d/HDRPanel';
import { DiamondPanel } from '@/components/molecules/3d/DiamondPanel';
import { PostProcessingPanelNew } from '@/components/molecules/3d';
import { MaterialEditor } from '@/components/molecules/3d/MaterialEditor';
import { VideoExportPanel } from '@/components/molecules/3d/VideoExportPanel';
import { TurntableControls } from '@/components/molecules/3d/TurntableController';
import { BatchExportPanel } from '@/components/molecules/3d/BatchExportPanel';
import { TransformControls } from '@/components/molecules/3d/TransformControls';

// ============================================
// ACCORDION SECTION COMPONENT
// ============================================

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string | number;
}

function AccordionSection({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  children,
  badge,
}: AccordionSectionProps) {
  return (
    <div className="border-b border-white/5">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-2">
          <span className={isOpen ? 'text-purple-400' : 'text-white/50'}>
            {icon}
          </span>
          <span className={`text-xs font-medium ${isOpen ? 'text-white' : 'text-white/70'}`}>
            {title}
          </span>
          {badge !== undefined && (
            <span className="rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[9px] text-purple-300">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-white/40" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// MAIN SIDEBAR COMPONENT
// ============================================

interface ThreeDViewerSidebarProps {
  canvasRef?: React.RefObject<HTMLCanvasElement>;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  onPauseRecording?: () => void;
  onTakeScreenshot?: () => void;
  onStartBatchExport?: () => void;
  onCancelBatchExport?: () => void;
  onPreviewAngle?: (angle: any) => void;
}

export function ThreeDViewerSidebar({
  canvasRef,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onTakeScreenshot,
  onStartBatchExport,
  onCancelBatchExport,
  onPreviewAngle,
}: ThreeDViewerSidebarProps) {
  // Store
  const {
    sidebarOpen,
    toggleSidebar,
    // Configs
    groundPlane,
    setGroundPlane,
    lighting,
    setLighting,
    background,
    setBackground,
    edgeSmoothing,
    setEdgeSmoothing,
    hdr,
    setHDR,
    diamond,
    setDiamond,
    postProcessing,
    setPostProcessing,
    turntable,
    setTurntable,
    videoExport,
    setVideoExport,
    batchExport,
    setBatchExport,
    // State
    recordingState,
    batchExportProgress,
    isTurntablePlaying,
    toggleTurntable,
    setTurntablePlaying,
    selectedMaterial,
    setSelectedMaterial,
    modelInfo,
    transform,
    setTransform,
    resetTransform,
  } = useThreeDViewerStore();

  // Local state for accordion
  const [openSections, setOpenSections] = useState<string[]>(['transform']);

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const isOpen = (id: string) => openSections.includes(id);

  // Default material for editor
  const defaultMaterial = selectedMaterial || {
    id: 'default',
    name: 'Default Material',
    color: '#D4AF37',
    metalness: 1,
    roughness: 0.1,
    envMapIntensity: 1.5,
  };

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        className="fixed right-4 top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-lg bg-black/60 text-white/60 backdrop-blur-xl transition-all hover:bg-black/80 hover:text-white"
      >
        <Sliders className="h-5 w-5" />
      </button>
    );
  }

  return (
    <aside className="fixed right-0 top-0 z-40 flex h-full w-80 flex-col border-l border-white/10 bg-black/80 backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-2">
          <Box className="h-4 w-4 text-purple-400" />
          <span className="text-sm font-medium text-white">3D Viewer</span>
        </div>
        <button
          onClick={toggleSidebar}
          className="rounded-md p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Model Info */}
      {modelInfo && (
        <div className="border-b border-white/5 px-4 py-2">
          <div className="flex items-center justify-between text-[10px] text-white/50">
            <span>{modelInfo.filename}</span>
            <span>{(modelInfo.fileSize / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="mt-1 flex gap-3 text-[9px] text-white/30">
            <span>{modelInfo.vertices.toLocaleString()} vertices</span>
            <span>{modelInfo.faces.toLocaleString()} faces</span>
          </div>
        </div>
      )}

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Transform */}
        <AccordionSection
          id="transform"
          title="Transform"
          icon={<RotateCw className="h-4 w-4" />}
          isOpen={isOpen('transform')}
          onToggle={() => toggleSection('transform')}
        >
          <TransformControls
            transform={{
              position: transform.position,
              rotation: transform.rotation,
              scale: { x: transform.scale, y: transform.scale, z: transform.scale },
            }}
            flip={{ x: false, y: false, z: false, normals: false }}
            onTransformChange={(newTransform) => setTransform({
              position: newTransform.position,
              rotation: newTransform.rotation,
              scale: newTransform.scale.x, // Use uniform scale
            })}
            onFlipChange={() => {}}
          />
        </AccordionSection>

        {/* Materials */}
        <AccordionSection
          id="materials"
          title="Malzemeler"
          icon={<Palette className="h-4 w-4" />}
          isOpen={isOpen('materials')}
          onToggle={() => toggleSection('materials')}
        >
          <MaterialEditor
            material={defaultMaterial}
            onChange={(updates) => setSelectedMaterial({ ...defaultMaterial, ...updates })}
          />
        </AccordionSection>

        {/* Lighting */}
        <AccordionSection
          id="lighting"
          title="Işıklandırma"
          icon={<Sun className="h-4 w-4" />}
          isOpen={isOpen('lighting')}
          onToggle={() => toggleSection('lighting')}
          badge={lighting.lights.length}
        >
          <LightingPanel config={lighting} onChange={setLighting} />
        </AccordionSection>

        {/* Environment (HDR) */}
        <AccordionSection
          id="environment"
          title="Ortam"
          icon={<Image className="h-4 w-4" />}
          isOpen={isOpen('environment')}
          onToggle={() => toggleSection('environment')}
        >
          <HDRPanel config={hdr} onChange={setHDR} />
        </AccordionSection>

        {/* Background */}
        <AccordionSection
          id="background"
          title="Arka Plan"
          icon={<Layers className="h-4 w-4" />}
          isOpen={isOpen('background')}
          onToggle={() => toggleSection('background')}
        >
          <BackgroundPanel config={background} onChange={setBackground} />
        </AccordionSection>

        {/* Ground Plane */}
        <AccordionSection
          id="ground"
          title="Zemin"
          icon={<Box className="h-4 w-4" />}
          isOpen={isOpen('ground')}
          onToggle={() => toggleSection('ground')}
        >
          <GroundPlaneControls config={groundPlane} onChange={setGroundPlane} />
        </AccordionSection>

        {/* Diamond Effects */}
        <AccordionSection
          id="diamond"
          title="Taş Efektleri"
          icon={<Diamond className="h-4 w-4" />}
          isOpen={isOpen('diamond')}
          onToggle={() => toggleSection('diamond')}
        >
          <DiamondPanel config={diamond} onChange={setDiamond} />
        </AccordionSection>

        {/* Quality */}
        <AccordionSection
          id="quality"
          title="Kalite"
          icon={<Settings className="h-4 w-4" />}
          isOpen={isOpen('quality')}
          onToggle={() => toggleSection('quality')}
        >
          <EdgeSmoothingPanel
            config={edgeSmoothing}
            onChange={setEdgeSmoothing}
            modelInfo={modelInfo ? { vertices: modelInfo.vertices, faces: modelInfo.faces } : null}
            has3DMFile={modelInfo?.format === '3dm'}
          />
        </AccordionSection>

        {/* Post-Processing */}
        <AccordionSection
          id="postprocessing"
          title="Post-Processing"
          icon={<Sparkles className="h-4 w-4" />}
          isOpen={isOpen('postprocessing')}
          onToggle={() => toggleSection('postprocessing')}
        >
          <PostProcessingPanelNew config={postProcessing} onChange={setPostProcessing} />
        </AccordionSection>

        {/* Turntable */}
        <AccordionSection
          id="turntable"
          title="Turntable"
          icon={<RotateCw className="h-4 w-4" />}
          isOpen={isOpen('turntable')}
          onToggle={() => toggleSection('turntable')}
        >
          <TurntableControls
            config={turntable}
            onChange={setTurntable}
            isPlaying={isTurntablePlaying}
            onTogglePlay={toggleTurntable}
            onReset={() => setTransform({ rotation: { x: 0, y: 0, z: 0 } })}
          />
        </AccordionSection>

        {/* Video Export */}
        <AccordionSection
          id="video"
          title="Video Export"
          icon={<Video className="h-4 w-4" />}
          isOpen={isOpen('video')}
          onToggle={() => toggleSection('video')}
        >
          <VideoExportPanel
            config={videoExport}
            onChange={setVideoExport}
            recordingState={recordingState}
            onStartRecording={onStartRecording || (() => {})}
            onStopRecording={onStopRecording || (() => {})}
            onPauseRecording={onPauseRecording || (() => {})}
            onTakeScreenshot={onTakeScreenshot || (() => {})}
            canvasRef={canvasRef}
          />
        </AccordionSection>

        {/* Batch Export */}
        <AccordionSection
          id="batch"
          title="Toplu Export"
          icon={<Layers className="h-4 w-4" />}
          isOpen={isOpen('batch')}
          onToggle={() => toggleSection('batch')}
          badge={batchExport.angles.length > 0 ? batchExport.angles.length : undefined}
        >
          <BatchExportPanel
            config={batchExport}
            onChange={setBatchExport}
            progress={batchExportProgress}
            onStartExport={onStartBatchExport || (() => {})}
            onCancelExport={onCancelBatchExport || (() => {})}
            onPreviewAngle={onPreviewAngle}
          />
        </AccordionSection>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 px-4 py-2">
        <p className="text-center text-[9px] text-white/30">
          JewelShot 3D Viewer v2.0
        </p>
      </div>
    </aside>
  );
}

export default ThreeDViewerSidebar;

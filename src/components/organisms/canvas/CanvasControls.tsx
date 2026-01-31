/**
 * =============================================================================
 * CANVAS CONTROLS - UI Controls & Positioning
 * =============================================================================
 *
 * Handles:
 * - All UI controls (zoom, actions, background, view mode)
 * - Control positioning based on sidebar states
 * - Control visibility animations
 * - AI Edit Control
 *
 * Extracted from Canvas.tsx (1,130 lines → maintainable components)
 */

'use client';

import React from 'react';
import TopLeftControls from '@/components/molecules/TopLeftControls';
import ViewModeSelector from '@/components/atoms/ViewModeSelector';
import ZoomControls from '@/components/molecules/ZoomControls';
import ActionControls from '@/components/molecules/ActionControls';
import BackgroundSelector, {
  type BackgroundType,
} from '@/components/molecules/BackgroundSelector';
import AIEditControl from '@/components/molecules/AIEditControl';
import BottomRightControls from '@/components/molecules/BottomRightControls';

/**
 * Props for CanvasControls component
 */
export interface CanvasControlsProps {
  // Image state
  hasImage: boolean;
  fileName: string;
  fileSize: number;

  // AI state
  isAIEditing: boolean;
  aiProgress: string;

  // Zoom state
  scale: number;
  leftImageScale: number; // For side-by-side view
  rightImageScale: number; // For side-by-side view

  // View mode
  viewMode: 'normal' | 'side-by-side';
  activeImage: 'left' | 'right';
  hasOriginalImage: boolean; // Show view mode selector only if original exists

  // Sidebar states (for positioning)
  leftOpen: boolean;
  rightOpen: boolean;
  topOpen: boolean;
  bottomOpen: boolean;
  allBarsOpen: boolean;

  // UI visibility
  controlsVisible: boolean;
  isFullscreen: boolean;
  isEditPanelOpen: boolean;

  // Background
  background: BackgroundType;

  // Event handlers - Zoom
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;

  // Event handlers - Actions
  onToggleAllBars: () => void;
  onToggleFullscreen: () => void;
  onToggleUI: () => void;
  onToggleEditPanel: () => void;

  // Event handlers - Image actions
  onCloseImage: () => void;
  onDelete: () => void;
  onSave: () => void;
  onDownload: () => void;

  // Event handlers - Background & View
  onBackgroundChange: (bg: BackgroundType) => void;
  onViewModeChange: (mode: 'normal' | 'side-by-side') => void;

  // Event handlers - AI Edit
  onImageEdited: (url: string) => void;
  onAIError: (error: { message: string }) => void;
  onPromptExpandedChange: (expanded: boolean) => void;

  // Current image URL (for AI Edit)
  currentImageUrl: string;
}

/**
 * CanvasControls: All UI controls with smart positioning
 */
export default function CanvasControls({
  hasImage,
  fileName,
  fileSize,
  isAIEditing,
  aiProgress,
  scale,
  leftImageScale,
  rightImageScale,
  viewMode,
  activeImage,
  hasOriginalImage,
  leftOpen,
  rightOpen,
  topOpen,
  bottomOpen,
  allBarsOpen,
  controlsVisible,
  isFullscreen,
  isEditPanelOpen,
  background,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  onToggleAllBars,
  onToggleFullscreen,
  onToggleUI,
  onToggleEditPanel,
  onCloseImage,
  onDelete,
  onSave,
  onDownload,
  onBackgroundChange,
  onViewModeChange,
  onImageEdited,
  onAIError,
  onPromptExpandedChange,
  currentImageUrl,
}: CanvasControlsProps) {
  // Don't render controls if no image
  if (!hasImage) return null;

  // Calculate scale for zoom controls (depends on view mode)
  const displayScale =
    viewMode === 'side-by-side'
      ? activeImage === 'left'
        ? leftImageScale
        : rightImageScale
      : scale;

  return (
    <>
      {/* Top Left Controls - File Info (z-30 to be above ViewModeSelector) */}
      <div
        className="fixed z-30 transition-all duration-panel ease-panel"
        style={{
          top: topOpen ? '80px' : '16px',
          left: leftOpen ? '276px' : '16px',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateX(0)' : 'translateX(-30px)',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <TopLeftControls
          fileName={fileName}
          fileSizeInBytes={fileSize}
          onClose={onCloseImage}
          visible={hasImage}
        />
      </div>

      {/* Top Center Controls - View Mode Selector */}
      {hasOriginalImage && (
        <div
          className="pointer-events-none fixed z-20 flex justify-center transition-all duration-panel ease-panel"
          style={{
            top: topOpen ? '80px' : '16px',
            left: leftOpen ? '130px' : '0px',
            right: rightOpen ? '130px' : '0px',
            opacity: controlsVisible ? 1 : 0,
            transform: controlsVisible ? 'translateY(0)' : 'translateY(-20px)',
          }}
        >
          <div className="pointer-events-auto">
            <ViewModeSelector
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              disabled={isAIEditing}
            />
          </div>
        </div>
      )}

      {/* Top Right Controls - Zoom (hideable) & Actions (always visible) */}
      <div
        className="fixed z-20 flex items-center gap-2 transition-all duration-panel ease-panel"
        style={{
          top: topOpen ? '80px' : '16px',
          right: rightOpen ? '276px' : '16px',
        }}
      >
        {/* Zoom Controls - Hideable */}
        <div
          className="transition-all duration-panel ease-panel"
          style={{
            opacity: controlsVisible ? 1 : 0,
            transform: controlsVisible ? 'translateX(0)' : 'translateX(20px)',
            pointerEvents: controlsVisible ? 'auto' : 'none',
          }}
        >
          <ZoomControls
            scale={displayScale}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onFitScreen={onFitScreen}
          />
        </div>
        {/* Action Controls - ALWAYS visible (toggle bars, UI, fullscreen) */}
        <ActionControls
          allBarsOpen={allBarsOpen}
          onToggleAllBars={onToggleAllBars}
          isFullscreen={isFullscreen}
          onToggleFullscreen={onToggleFullscreen}
          controlsVisible={controlsVisible}
          onToggleUI={onToggleUI}
        />
      </div>

      {/* Bottom Left Controls - Background Selector */}
      <div
        className="fixed z-30 transition-all duration-panel ease-panel"
        style={{
          bottom: bottomOpen ? '56px' : '16px',
          left: leftOpen ? '276px' : '16px',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateX(0) scale(1)' : 'translateX(-10px) scale(0.95)',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <div className="rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-1.5 backdrop-blur-[16px]">
          <BackgroundSelector
            background={background}
            onBackgroundChange={onBackgroundChange}
          />
        </div>
      </div>

      {/* Bottom Center - AI Edit Control */}
      <div
        className="fixed z-20 transition-all duration-panel ease-panel"
        style={{
          bottom: bottomOpen ? '56px' : '16px',
          left: leftOpen ? '260px' : '0px',
          right: rightOpen ? '260px' : '0px',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateY(0)' : 'translateY(20px)',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <AIEditControl
          currentImageUrl={currentImageUrl}
          onImageEdited={onImageEdited}
          onError={onAIError}
          isEditing={isAIEditing}
          progress={aiProgress}
          visible={hasImage}
          onExpandedChange={onPromptExpandedChange}
        />
      </div>

      {/* Bottom Right Controls - Edit, Delete, Save, Download, Video */}
      <div
        className="fixed z-20 transition-all duration-panel ease-panel"
        style={{
          bottom: bottomOpen ? '56px' : '16px',
          right: rightOpen ? '276px' : '16px',
          opacity: controlsVisible ? 1 : 0,
          transform: controlsVisible ? 'translateX(0)' : 'translateX(30px)',
          pointerEvents: controlsVisible ? 'auto' : 'none',
        }}
      >
        <BottomRightControls
          onEdit={onToggleEditPanel}
          editActive={isEditPanelOpen}
          onDelete={onDelete}
          onSave={onSave}
          onDownload={onDownload}
        />
      </div>
    </>
  );
}

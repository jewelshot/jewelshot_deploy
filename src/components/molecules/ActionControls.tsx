'use client';

import ToggleAllBarsButton from '@/components/atoms/ToggleAllBarsButton';
import FullscreenButton from '@/components/atoms/FullscreenButton';
import UIToggleButton from '@/components/atoms/UIToggleButton';

interface ActionControlsProps {
  /**
   * Whether all bars are open
   */
  allBarsOpen: boolean;
  /**
   * Toggle all bars handler
   */
  onToggleAllBars: () => void;
  /**
   * Whether fullscreen is active
   */
  isFullscreen: boolean;
  /**
   * Toggle fullscreen handler
   */
  onToggleFullscreen: () => void;
  /**
   * Whether UI controls are visible
   */
  controlsVisible: boolean;
  /**
   * Toggle UI controls handler
   */
  onToggleUI: () => void;
}

export function ActionControls({
  allBarsOpen,
  onToggleAllBars,
  isFullscreen,
  onToggleFullscreen,
  controlsVisible,
  onToggleUI,
}: ActionControlsProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-[rgba(10,10,10,0.8)] p-1.5 backdrop-blur-[16px]">
      <ToggleAllBarsButton
        allBarsOpen={allBarsOpen}
        onClick={onToggleAllBars}
      />
      <div className="h-5 w-px bg-white/10" />
      <UIToggleButton
        controlsVisible={controlsVisible}
        onToggle={onToggleUI}
      />
      <div className="h-5 w-px bg-white/10" />
      <FullscreenButton
        isFullscreen={isFullscreen}
        onClick={onToggleFullscreen}
      />
    </div>
  );
}

export default ActionControls;

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
    <div className="ctrl-container gap-1.5 p-1.5">
      <ToggleAllBarsButton
        allBarsOpen={allBarsOpen}
        onClick={onToggleAllBars}
      />
      <div className="ctrl-divider-v h-5" />
      <UIToggleButton
        controlsVisible={controlsVisible}
        onToggle={onToggleUI}
      />
      <div className="ctrl-divider-v h-5" />
      <FullscreenButton
        isFullscreen={isFullscreen}
        onClick={onToggleFullscreen}
      />
    </div>
  );
}

export default ActionControls;

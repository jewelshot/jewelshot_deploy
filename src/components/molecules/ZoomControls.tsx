'use client';

import { ZoomIn, ZoomOut, Locate } from 'lucide-react';
import ZoomButton from '@/components/atoms/ZoomButton';
import ZoomDisplay from '@/components/atoms/ZoomDisplay';
import { useLanguage } from '@/lib/i18n';

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitScreen: () => void;
  minZoom?: number;
  maxZoom?: number;
}

export function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onFitScreen,
  minZoom = 0.1,
  maxZoom = 8.0,
}: ZoomControlsProps) {
  const { t } = useLanguage();
  
  return (
    <div className="ctrl-container gap-1 p-1.5">
      <ZoomButton
        onClick={onZoomOut}
        icon={<ZoomOut className="h-3 w-3" />}
        title={t.tooltips.zoomOut}
        disabled={scale <= minZoom}
      />

      <ZoomDisplay value={scale} />

      <ZoomButton
        onClick={onZoomIn}
        icon={<ZoomIn className="h-3 w-3" />}
        title={t.tooltips.zoomIn}
        disabled={scale >= maxZoom}
      />

      <div className="ctrl-divider-v mx-0.5 h-4" />

      <ZoomButton
        onClick={onFitScreen}
        icon={<Locate className="h-3 w-3" />}
        title={t.tooltips.fitToScreen}
      />
    </div>
  );
}

export default ZoomControls;

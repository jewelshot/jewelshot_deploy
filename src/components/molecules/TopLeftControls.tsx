'use client';

import { X } from 'lucide-react';
import FileInfo from './FileInfo';
import { useLanguage } from '@/lib/i18n';

interface TopLeftControlsProps {
  /**
   * Name of the file
   */
  fileName: string;
  /**
   * Size of the file in bytes
   */
  fileSizeInBytes: number;
  /**
   * Close image handler
   */
  onClose: () => void;
  /**
   * Whether the controls are visible
   */
  visible: boolean;
}

export function TopLeftControls({
  fileName,
  fileSizeInBytes,
  onClose,
  visible,
}: TopLeftControlsProps) {
  const { t } = useLanguage();
  
  if (!visible) return null;

  return (
    <div 
      className="group flex cursor-pointer items-center gap-1 rounded-md border border-white/10 bg-[rgba(10,10,10,0.85)] px-2 py-1 backdrop-blur-[16px] transition-all hover:border-red-500/30 hover:bg-red-500/5"
      onClick={onClose}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose();
        }
      }}
      aria-label={t.canvas.closeImage}
    >
      <FileInfo fileName={fileName} fileSizeInBytes={fileSizeInBytes} />
      <div className="h-3 w-px bg-white/10 group-hover:bg-red-500/20" />
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/40 transition-all group-hover:text-red-400">
        <X className="h-3.5 w-3.5 shrink-0" />
      </div>
    </div>
  );
}

export default TopLeftControls;

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
      className="group flex cursor-pointer items-center gap-1.5 rounded-lg border border-[rgba(139,92,246,0.2)] bg-[rgba(10,10,10,0.8)] p-1.5 backdrop-blur-[16px] transition-all hover:border-red-500/30 hover:bg-red-500/5"
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
      <div className="h-4 w-px bg-[rgba(139,92,246,0.2)] group-hover:bg-red-500/20" />
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-red-500/30 bg-red-500/10 text-red-400 transition-all group-hover:border-red-500/60 group-hover:bg-red-500/20 group-hover:text-red-300">
        <X className="h-4 w-4 shrink-0" />
      </div>
    </div>
  );
}

export default TopLeftControls;

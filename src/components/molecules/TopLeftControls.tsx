'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import FileInfo from './FileInfo';
import { useLanguage } from '@/lib/i18n';
import { ConfirmationModal } from './ConfirmationModal';

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
  const [showConfirm, setShowConfirm] = useState(false);
  
  if (!visible) return null;

  const handleCloseClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  return (
    <>
      <div className="ctrl-container gap-1 px-2 py-1">
        <FileInfo fileName={fileName} fileSizeInBytes={fileSizeInBytes} />
        <div className="ctrl-divider-v h-3" />
        <button
          onClick={handleCloseClick}
          className="ctrl-btn h-6 w-6 shrink-0"
          aria-label={t.canvas.closeImage}
          title={t.canvas.closeImage}
        >
          <X className="h-3.5 w-3.5 shrink-0" />
        </button>
      </div>

      {/* Close confirmation modal */}
      <ConfirmationModal
        isOpen={showConfirm}
        title="Close Image"
        description="Are you sure you want to close this image? Any unsaved changes will be lost."
        confirmText="Close"
        cancelText="Cancel"
        onConfirm={handleConfirmClose}
        onClose={() => setShowConfirm(false)}
        variant="warning"
      />
    </>
  );
}

export default TopLeftControls;

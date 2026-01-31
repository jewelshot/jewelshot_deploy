'use client';

import EditButton from '@/components/atoms/EditButton';
import DeleteButton from '@/components/atoms/DeleteButton';
import SaveButton from '@/components/atoms/SaveButton';
import DownloadButton from '@/components/atoms/DownloadButton';

interface BottomRightControlsProps {
  /**
   * Edit handler
   */
  onEdit: () => void;
  /**
   * Whether edit panel is open
   */
  editActive?: boolean;
  /**
   * Delete handler
   */
  onDelete: () => void;
  /**
   * Save handler
   */
  onSave: () => void;
  /**
   * Download handler
   */
  onDownload: () => void;
}

export function BottomRightControls({
  onEdit,
  editActive = false,
  onDelete,
  onSave,
  onDownload,
}: BottomRightControlsProps) {
  return (
    <div className="ctrl-container gap-1 p-1.5">
      <EditButton onClick={onEdit} active={editActive} />
      <div className="ctrl-divider-v h-4" />
      <SaveButton onClick={onSave} />
      <DownloadButton onClick={onDownload} />
      <div className="ctrl-divider-v h-4" />
      <DeleteButton onClick={onDelete} />
    </div>
  );
}

export default BottomRightControls;

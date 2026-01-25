import React from 'react';

interface FileNameProps {
  /**
   * Name of the file
   */
  name: string;
}

export function FileName({ name }: FileNameProps) {
  return (
    <div className="max-w-[120px] truncate text-[10px] font-medium text-white/80">
      {name}
    </div>
  );
}

export default FileName;

import React from 'react';

interface FileNameProps {
  /**
   * Name of the file
   */
  name: string;
}

export function FileName({ name }: FileNameProps) {
  return (
    <div className="max-w-[160px] truncate text-[11px] font-medium text-white">
      {name}
    </div>
  );
}

export default FileName;

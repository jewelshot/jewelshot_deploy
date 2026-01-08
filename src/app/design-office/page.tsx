/**
 * Design Office Page
 * 
 * Creative workspace for design templates and compositions
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';

// Lazy load Design Office component
const DesignOfficeContent = dynamic(
  () => import('@/components/organisms/DesignOfficeContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          <span className="text-sm text-white/40">Loading Design Office...</span>
        </div>
      </div>
    )
  }
);

export default function DesignOfficePage() {
  return (
    <>
      <AuroraBackground />
      <DesignOfficeContent />
    </>
  );
}

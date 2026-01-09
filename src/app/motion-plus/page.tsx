/**
 * Motion+ Page
 * 
 * Video generation, editing, and export hub
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import { useNoScroll } from '@/hooks/useNoScroll';

// Lazy load Motion+ component (heavy with video processing)
const MotionPlusContent = dynamic(
  () => import('@/components/organisms/MotionPlusContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          <span className="text-sm text-white/40">Loading Motion+...</span>
        </div>
      </div>
    )
  }
);

export default function MotionPlusPage() {
  useNoScroll();
  
  return (
    <>
      <AuroraBackground />
      <MotionPlusContent />
    </>
  );
}

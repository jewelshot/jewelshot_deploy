/**
 * Editor Page
 * 
 * Advanced image editing with AI-powered tools
 */

'use client';

import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import { useNoScroll } from '@/hooks/useNoScroll';

// Lazy load Editor component (heavy with Fabric.js)
const EditorCanvas = dynamic(
  () => import('@/components/organisms/EditorCanvas'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/60" />
          <span className="text-sm text-white/40">Loading Editor...</span>
        </div>
      </div>
    )
  }
);

export default function EditorPage() {
  useNoScroll();
  
  return (
    <>
      <AuroraBackground />
      <EditorCanvas />
    </>
  );
}

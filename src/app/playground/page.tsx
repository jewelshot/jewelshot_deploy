/**
 * 3D Playground Page
 * 
 * Interactive 3D jewelry viewer with environment controls,
 * camera settings, and material options.
 */

'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Three.js
const PlaygroundContent = dynamic(
  () => import('@/components/organisms/PlaygroundContent').then(mod => mod.PlaygroundContent),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-full items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent mx-auto"></div>
          <p className="text-sm text-white/60">Loading 3D Viewer...</p>
        </div>
      </div>
    )
  }
);

export default function PlaygroundPage() {
  return <PlaygroundContent />;
}

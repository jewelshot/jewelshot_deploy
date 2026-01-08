'use client';

import dynamic from 'next/dynamic';

// Dynamic import to avoid SSR issues with Three.js
const ThreeDViewContent = dynamic(
  () => import('@/components/organisms/ThreeDViewContent'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80 mx-auto" />
          <p className="text-sm text-white/60">Loading 3D Viewer...</p>
        </div>
      </div>
    )
  }
);

export default function ThreeDViewPage() {
  return <ThreeDViewContent />;
}


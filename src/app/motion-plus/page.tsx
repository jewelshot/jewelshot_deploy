/**
 * Motion+ Page
 * 
 * Video and animation creation tools
 */

'use client';

import { Video, Sparkles } from 'lucide-react';
import AuroraBackground from '@/components/atoms/AuroraBackground';

export default function MotionPlusPage() {
  return (
    <>
      <AuroraBackground />
      
      <div className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                <Video className="h-5 w-5 text-white/60" />
              </div>
              <div>
                <h1 className="text-xl font-medium text-white/90">Motion+</h1>
                <p className="text-xs text-white/40">Video & animation tools</p>
              </div>
            </div>
          </div>

          {/* Coming Soon */}
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-6">
              <Sparkles className="h-8 w-8 text-white/30" />
            </div>
            <h2 className="text-lg font-medium text-white/60 mb-2">Coming Soon</h2>
            <p className="text-sm text-white/30 max-w-md">
              Create stunning jewelry videos, 360° product spins, and animated content for social media and e-commerce.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}



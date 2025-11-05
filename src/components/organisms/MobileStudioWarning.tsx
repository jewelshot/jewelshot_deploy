/**
 * MobileStudioWarning Component
 *
 * Displays a friendly message to mobile users explaining that
 * Studio works best on desktop, with options to try simplified version
 * or view gallery.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { Monitor, Smartphone, Image, Sparkles } from 'lucide-react';

interface MobileStudioWarningProps {
  onTryMobileVersion?: () => void;
}

export function MobileStudioWarning({
  onTryMobileVersion,
}: MobileStudioWarningProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a0a2e] to-[#0a0a0a] p-6">
      {/* Background decorations */}
      <div className="absolute left-1/4 top-20 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-20 right-1/4 h-72 w-72 rounded-full bg-purple-500/5 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="rounded-2xl bg-purple-500/20 p-4">
              <Monitor className="h-12 w-12 text-purple-400" />
            </div>
          </div>

          {/* Heading */}
          <h2 className="mb-3 text-center text-2xl font-bold text-white">
            Studio Works Best on Desktop
          </h2>

          {/* Description */}
          <p className="mb-6 text-center text-white/70">
            For the best editing experience with full canvas controls and
            professional tools, we recommend using a desktop or laptop.
          </p>

          {/* Device comparison */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            {/* Desktop */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-center">
              <Monitor className="mx-auto mb-2 h-6 w-6 text-green-400" />
              <p className="mb-1 text-xs font-medium text-green-400">Desktop</p>
              <p className="text-xs text-white/50">Full Features</p>
            </div>

            {/* Mobile */}
            <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-center">
              <Smartphone className="mx-auto mb-2 h-6 w-6 text-orange-400" />
              <p className="mb-1 text-xs font-medium text-orange-400">Mobile</p>
              <p className="text-xs text-white/50">Limited</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {/* Try Mobile Version (if available) */}
            {onTryMobileVersion && (
              <button
                onClick={onTryMobileVersion}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-3 font-medium text-white transition-all hover:bg-purple-600 active:scale-95"
              >
                <Sparkles className="h-5 w-5" />
                Try Simplified Mobile Editor
              </button>
            )}

            {/* View Gallery */}
            <Link
              href="/gallery"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-medium text-white transition-all hover:bg-white/10 active:scale-95"
            >
              <Image className="h-5 w-5" />
              View Gallery
            </Link>

            {/* Continue Anyway */}
            <button
              onClick={() => {
                // Just close the warning, let them try
                if (typeof window !== 'undefined') {
                  sessionStorage.setItem(
                    'mobile-studio-warning-dismissed',
                    'true'
                  );
                  window.location.reload();
                }
              }}
              className="w-full py-2 text-sm text-white/50 transition-colors hover:text-white/70"
            >
              Continue to Studio anyway
            </button>
          </div>

          {/* Info note */}
          <div className="mt-6 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
            <p className="text-center text-xs text-purple-300">
              💡 <strong>Tip:</strong> Access from a computer for canvas tools,
              advanced filters, and professional editing features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileStudioWarning;

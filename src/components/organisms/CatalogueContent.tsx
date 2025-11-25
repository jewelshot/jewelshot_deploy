'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Settings, Eye, Download } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useImageMetadataStore } from '@/store/imageMetadataStore';
import { createScopedLogger } from '@/lib/logger';

const logger = createScopedLogger('Catalogue');

export default function CatalogueContent() {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
  const { favorites, metadata } = useImageMetadataStore();

  const [activeTab, setActiveTab] = useState<'setup' | 'preview'>('setup');

  // Get favorite images with metadata
  const favoriteItems = useMemo(() => {
    return favorites
      .map((fav) => {
        const imageMetadata = metadata[fav.imageId];
        return {
          imageId: fav.imageId,
          order: fav.order,
          metadata: imageMetadata,
        };
      })
      .sort((a, b) => a.order - b.order);
  }, [favorites, metadata]);

  useEffect(() => {
    logger.info('Catalogue loaded with favorites:', favoriteItems.length);
  }, [favoriteItems.length]);

  return (
    <div
      className="fixed z-10 flex h-full flex-col gap-6 overflow-y-auto p-6 transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '16px',
        right: rightOpen ? '276px' : '16px',
        top: topOpen ? '64px' : '16px',
        bottom: bottomOpen ? '64px' : '16px',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            PDF Catalogue Generator
          </h1>
          <p className="text-sm text-white/60">
            Create professional catalogues from your favorite images
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 rounded-lg bg-white/5 p-1">
          <button
            onClick={() => setActiveTab('setup')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'setup'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Settings className="h-4 w-4" />
            Setup
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'preview'
                ? 'bg-white/10 text-white'
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex-1">
          <p className="text-sm text-white/60">Favorite Images</p>
          <p className="text-2xl font-semibold text-white">
            {favoriteItems.length}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/60">With Metadata</p>
          <p className="text-2xl font-semibold text-white">
            {favoriteItems.filter((item) => item.metadata).length}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm text-white/60">Status</p>
          <p className="text-sm font-medium text-white">
            {favoriteItems.length > 0 ? '✓ Ready' : '⚠ No Favorites'}
          </p>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'setup' && (
        <div className="flex-1">
          {favoriteItems.length > 0 ? (
            <div className="space-y-6">
              {/* Images Section */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  Selected Images ({favoriteItems.length})
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  {favoriteItems.map((item) => (
                    <div
                      key={item.imageId}
                      className="aspect-square rounded-lg border border-white/10 bg-white/5 p-2"
                    >
                      <div className="flex h-full items-center justify-center">
                        <FileText className="h-8 w-8 text-white/40" />
                      </div>
                      <p className="mt-2 text-center text-xs text-white/60">
                        #{item.order}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-white/40">
                  Tip: Reorder images in the Gallery Favorites tab
                </p>
              </div>

              {/* Settings Section */}
              <div className="rounded-lg border border-white/10 bg-white/5 p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">
                  PDF Settings
                </h3>
                <div className="space-y-4">
                  {/* Format Selection */}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-white/80">
                      Page Format
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white transition-colors hover:bg-white/10">
                        A4 Portrait
                      </button>
                      <button className="rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white transition-colors hover:bg-white/10">
                        A4 Landscape
                      </button>
                    </div>
                  </div>

                  {/* More settings will be added in next phases */}
                  <p className="text-xs text-white/40">
                    More settings coming soon...
                  </p>
                </div>
              </div>

              {/* Export Button */}
              <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-white/20">
                <Download className="h-4 w-4" />
                Export PDF (Coming Soon)
              </button>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="max-w-md text-center">
                <FileText className="mx-auto mb-4 h-16 w-16 text-white/20" />
                <h3 className="mb-2 text-lg font-semibold text-white">
                  No Favorites Yet
                </h3>
                <p className="text-sm text-white/60">
                  Add images to your favorites in the Gallery to create a
                  catalogue.
                </p>
                <a
                  href="/gallery"
                  className="mt-4 inline-block rounded-lg bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
                >
                  Go to Gallery
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="flex h-full items-center justify-center">
          <p className="text-white/60">Preview mode coming soon...</p>
        </div>
      )}
    </div>
  );
}

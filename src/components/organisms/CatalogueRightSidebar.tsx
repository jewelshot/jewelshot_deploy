/**
 * CatalogueRightSidebar Component
 *
 * Right sidebar for catalogue settings (replaces modal)
 * All PDF configuration options in a persistent sidebar
 */

'use client';

import React from 'react';
import {
  Check,
  Settings,
  Grid3x3,
  List,
  LayoutGrid,
  FileText,
  Upload,
  X,
} from 'lucide-react';
import { useCatalogueStore } from '@/store/catalogueStore';

interface CatalogueRightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CatalogueRightSidebar({
  isOpen,
  onClose,
}: CatalogueRightSidebarProps) {
  const {
    settings,
    setPageFormat,
    setPageLayout,
    setImagesPerPage,
    toggleMetadataField,
    setMargin,
    setShowPageNumbers,
    setContactInfo,
    setFrontCover,
    setBackCover,
  } = useCatalogueStore();

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-[90] w-[350px] border-l border-white/10 bg-[#0A0A0F]/95 shadow-[-4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <Settings className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">PDF Settings</h2>
        </div>
        <button
          onClick={onClose}
          className="rounded-lg bg-white/5 p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        {/* Page Format */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-white">
            Page Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPageFormat('a4-portrait')}
              className={`group relative overflow-hidden rounded-lg border p-3 transition-all ${
                settings.pageFormat === 'a4-portrait'
                  ? 'border-purple-500/40 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
              }`}
            >
              <div className="mb-2 flex justify-center">
                <div
                  className={`h-12 w-8 rounded border-2 ${
                    settings.pageFormat === 'a4-portrait'
                      ? 'border-purple-400'
                      : 'border-white/30'
                  }`}
                />
              </div>
              <div className="text-center text-xs text-white/80">Portrait</div>
              {settings.pageFormat === 'a4-portrait' && (
                <div className="absolute right-2 top-2 rounded-full bg-purple-500 p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>

            <button
              onClick={() => setPageFormat('a4-landscape')}
              className={`group relative overflow-hidden rounded-lg border p-3 transition-all ${
                settings.pageFormat === 'a4-landscape'
                  ? 'border-purple-500/40 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
              }`}
            >
              <div className="mb-2 flex justify-center">
                <div
                  className={`h-8 w-12 rounded border-2 ${
                    settings.pageFormat === 'a4-landscape'
                      ? 'border-purple-400'
                      : 'border-white/30'
                  }`}
                />
              </div>
              <div className="text-center text-xs text-white/80">
                Landscape
              </div>
              {settings.pageFormat === 'a4-landscape' && (
                <div className="absolute right-2 top-2 rounded-full bg-purple-500 p-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Page Layout */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-white">
            Layout Style
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'grid', icon: Grid3x3, label: 'Grid' },
              { value: 'list', icon: List, label: 'List' },
            ].map((layout) => {
              const Icon = layout.icon;
              return (
                <button
                  key={layout.value}
                  onClick={() =>
                    setPageLayout(layout.value as 'grid' | 'list')
                  }
                  className={`relative rounded-lg border p-2.5 transition-all ${
                    settings.pageLayout === layout.value
                      ? 'border-purple-500/40 bg-purple-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  }`}
                >
                  <Icon className="mx-auto mb-1 h-5 w-5 text-white/70" />
                  <div className="text-center text-[10px] text-white/60">
                    {layout.label}
                  </div>
                  {settings.pageLayout === layout.value && (
                    <div className="absolute right-1 top-1 rounded-full bg-purple-500 p-0.5">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Images Per Page */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-white">
            Images Per Page
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 4, 6].map((count) => (
              <button
                key={count}
                onClick={() => setImagesPerPage(count)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                  settings.imagesPerPage === count
                    ? 'border-purple-500/40 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/8 hover:text-white'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Metadata Fields */}
        <div>
          <label className="mb-3 block text-sm font-semibold text-white">
            Information to Display
          </label>
          <div className="space-y-2">
            {settings.metadataFields.map((field) => (
              <button
                key={field.key}
                onClick={() => toggleMetadataField(field.key)}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
                  field.enabled
                    ? 'border-purple-500/40 bg-purple-500/10 text-white'
                    : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:bg-white/8 hover:text-white'
                }`}
              >
                <div
                  className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded ${
                    field.enabled
                      ? 'bg-purple-500'
                      : 'border border-white/30'
                  }`}
                >
                  {field.enabled && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className="flex-1 text-left">{field.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Margins & Page Numbers */}
        <div className="space-y-4">
          {/* Margins */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Margins (mm)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-xs text-white/60">Top</label>
                <input
                  type="number"
                  value={settings.margins.top}
                  onChange={(e) => setMargin('top', Number(e.target.value))}
                  min={0}
                  max={50}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/60">Bottom</label>
                <input
                  type="number"
                  value={settings.margins.bottom}
                  onChange={(e) => setMargin('bottom', Number(e.target.value))}
                  min={0}
                  max={50}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/60">Left</label>
                <input
                  type="number"
                  value={settings.margins.left}
                  onChange={(e) => setMargin('left', Number(e.target.value))}
                  min={0}
                  max={50}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-white/60">Right</label>
                <input
                  type="number"
                  value={settings.margins.right}
                  onChange={(e) => setMargin('right', Number(e.target.value))}
                  min={0}
                  max={50}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-sm text-white focus:border-purple-500/50 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Page Numbers */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-white">
              Page Numbers
            </label>
            <button
              onClick={() => setShowPageNumbers(!settings.showPageNumbers)}
              className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-all ${
                settings.showPageNumbers
                  ? 'border-purple-500/40 bg-purple-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
              }`}
            >
              <span>{settings.showPageNumbers ? 'Enabled' : 'Disabled'}</span>
              <div
                className={`h-4 w-4 rounded ${
                  settings.showPageNumbers
                    ? 'bg-purple-500'
                    : 'border border-white/30'
                }`}
              >
                {settings.showPageNumbers && (
                  <Check className="h-4 w-4 text-white" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Contact Information
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={settings.contactInfo.phone}
              onChange={(e) =>
                setContactInfo({ ...settings.contactInfo, phone: e.target.value })
              }
              placeholder="Phone"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <input
              type="email"
              value={settings.contactInfo.email}
              onChange={(e) =>
                setContactInfo({ ...settings.contactInfo, email: e.target.value })
              }
              placeholder="Email"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <input
              type="text"
              value={settings.contactInfo.website}
              onChange={(e) =>
                setContactInfo({ ...settings.contactInfo, website: e.target.value })
              }
              placeholder="Website"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>

        {/* Front Cover Image */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Front Cover Image URL
          </label>
          <input
            type="text"
            value={settings.cover.frontCover || ''}
            onChange={(e) => setFrontCover(e.target.value)}
            placeholder="https://example.com/front-cover.jpg"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <p className="mt-1 text-xs text-white/50">Optional custom cover image</p>
        </div>

        {/* Back Cover Image */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-white">
            Back Cover Image URL
          </label>
          <input
            type="text"
            value={settings.cover.backCover || ''}
            onChange={(e) => setBackCover(e.target.value)}
            placeholder="https://example.com/back-cover.jpg"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          />
          <p className="mt-1 text-xs text-white/50">Optional back cover image</p>
        </div>
      </div>
    </aside>
  );
}


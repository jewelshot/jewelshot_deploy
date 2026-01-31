/**
 * CatalogueRightSidebar Component
 *
 * Right sidebar for catalogue settings with accordion sections
 * Follows the same design pattern as RightSidebar (preset bar)
 */

'use client';

import React, { useState } from 'react';
import {
  Check,
  Settings,
  Grid3x3,
  List,
  ChevronDown,
} from 'lucide-react';
import { useCatalogueStore } from '@/store/catalogueStore';

interface CatalogueRightSidebarProps {
  isOpen: boolean;
}

export default function CatalogueRightSidebar({
  isOpen,
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

  // Accordion states
  const [isPageFormatOpen, setIsPageFormatOpen] = useState(true);
  const [isLayoutOpen, setIsLayoutOpen] = useState(false);
  const [isMetadataOpen, setIsMetadataOpen] = useState(false);
  const [isMarginsOpen, setIsMarginsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  return (
    <aside
      className={`fixed bottom-0 right-0 top-0 z-[90] w-[350px] border-l border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[-4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-purple-400" />
            <h2 className="text-sm font-semibold text-white">PDF Settings</h2>
          </div>
        </div>

        {/* Page Format Accordion */}
        <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setIsPageFormatOpen(!isPageFormatOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">📄</span>
              <span className="text-[11px] font-medium text-white/90">
                Page Format
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-white/40">
                {settings.pageFormat === 'a4-portrait' ? 'Portrait' : 'Landscape'}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                  isPageFormatOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {isPageFormatOpen && (
            <div className="border-t border-white/5 p-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setPageFormat('a4-portrait');
                    setIsPageFormatOpen(false);
                  }}
                  className={`relative rounded-lg border p-2 transition-all ${
                    settings.pageFormat === 'a4-portrait'
                      ? 'border-purple-500/50 bg-purple-500/20'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="mb-1 flex justify-center">
                    <div
                      className={`h-8 w-6 rounded border ${
                        settings.pageFormat === 'a4-portrait'
                          ? 'border-purple-400'
                          : 'border-white/30'
                      }`}
                    />
                  </div>
                  <div className="text-center text-[10px] text-white/80">
                    Portrait
                  </div>
                </button>

                <button
                  onClick={() => {
                    setPageFormat('a4-landscape');
                    setIsPageFormatOpen(false);
                  }}
                  className={`relative rounded-lg border p-2 transition-all ${
                    settings.pageFormat === 'a4-landscape'
                      ? 'border-purple-500/50 bg-purple-500/20'
                      : 'border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="mb-1 flex justify-center">
                    <div
                      className={`h-6 w-8 rounded border ${
                        settings.pageFormat === 'a4-landscape'
                          ? 'border-purple-400'
                          : 'border-white/30'
                      }`}
                    />
                  </div>
                  <div className="text-center text-[10px] text-white/80">
                    Landscape
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Layout & Density Accordion */}
        <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setIsLayoutOpen(!isLayoutOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-white/90">
                Layout & Density
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-white/40">
                {settings.pageLayout} • {settings.imagesPerPage}/page
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                  isLayoutOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {isLayoutOpen && (
            <div className="border-t border-white/5 p-2 space-y-2">
              {/* Layout Style */}
              <div>
                <label className="mb-1 block text-[10px] text-white/60">
                  Layout Style
                </label>
                <div className="grid grid-cols-2 gap-1">
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
                        className={`rounded border px-2 py-1.5 text-[9px] font-medium transition-all ${
                          settings.pageLayout === layout.value
                            ? 'border-purple-500/50 bg-purple-500/20 text-purple-300'
                            : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:bg-white/[0.05]'
                        }`}
                      >
                        <Icon className="mx-auto mb-0.5 h-4 w-4" />
                        {layout.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Images Per Page */}
              <div>
                <label className="mb-1 block text-[10px] text-white/60">
                  Images Per Page
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 4, 6].map((count) => (
                    <button
                      key={count}
                      onClick={() => setImagesPerPage(count)}
                      className={`rounded border px-2 py-1 text-[10px] font-medium transition-all ${
                        settings.imagesPerPage === count
                          ? 'border-purple-500/50 bg-purple-500/20 text-white'
                          : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Fields Accordion */}
        <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setIsMetadataOpen(!isMetadataOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">🏷️</span>
              <span className="text-[11px] font-medium text-white/90">
                Information Fields
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-white/40">
                {settings.metadataFields.filter((f) => f.enabled).length}/
                {settings.metadataFields.length}
              </span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                  isMetadataOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>

          {isMetadataOpen && (
            <div className="border-t border-white/5 p-2">
              <div className="space-y-1">
                {settings.metadataFields.map((field) => (
                  <button
                    key={field.key}
                    onClick={() => toggleMetadataField(field.key)}
                    className={`flex w-full items-center gap-2 rounded border px-2 py-1.5 text-[10px] transition-all ${
                      field.enabled
                        ? 'border-purple-500/40 bg-purple-500/10 text-white'
                        : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                    }`}
                  >
                    <div
                      className={`flex h-3 w-3 flex-shrink-0 items-center justify-center rounded ${
                        field.enabled
                          ? 'bg-purple-500'
                          : 'border border-white/30'
                      }`}
                    >
                      {field.enabled && (
                        <Check className="h-2 w-2 text-white" />
                      )}
                    </div>
                    <span className="flex-1 text-left">{field.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Margins & Page Numbers Accordion */}
        <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setIsMarginsOpen(!isMarginsOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">📏</span>
              <span className="text-[11px] font-medium text-white/90">
                Margins & Numbers
              </span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                isMarginsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isMarginsOpen && (
            <div className="border-t border-white/5 p-2 space-y-2">
              {/* Margins */}
              <div>
                <label className="mb-1 block text-[10px] text-white/60">
                  Margins (mm)
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {[
                    { key: 'top', label: 'Top' },
                    { key: 'bottom', label: 'Bottom' },
                    { key: 'left', label: 'Left' },
                    { key: 'right', label: 'Right' },
                  ].map((margin) => (
                    <div key={margin.key}>
                      <label className="mb-0.5 block text-[9px] text-white/50">
                        {margin.label}
                      </label>
                      <input
                        type="number"
                        value={
                          settings.margins[
                            margin.key as keyof typeof settings.margins
                          ]
                        }
                        onChange={(e) =>
                          setMargin(
                            margin.key as keyof typeof settings.margins,
                            Number(e.target.value)
                          )
                        }
                        min={0}
                        max={50}
                        className="w-full rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Page Numbers */}
              <div>
                <button
                  onClick={() =>
                    setShowPageNumbers(!settings.showPageNumbers)
                  }
                  className={`flex w-full items-center justify-between rounded border px-2 py-1.5 text-[10px] transition-all ${
                    settings.showPageNumbers
                      ? 'border-purple-500/40 bg-purple-500/10 text-white'
                      : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20'
                  }`}
                >
                  <span>Page Numbers</span>
                  <div
                    className={`h-3 w-3 rounded ${
                      settings.showPageNumbers
                        ? 'bg-purple-500'
                        : 'border border-white/30'
                    }`}
                  >
                    {settings.showPageNumbers && (
                      <Check className="h-3 w-3 text-white" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Contact Info Accordion */}
        <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setIsContactOpen(!isContactOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xs">📞</span>
              <span className="text-[11px] font-medium text-white/90">
                Contact Info
              </span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                isContactOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isContactOpen && (
            <div className="border-t border-white/5 p-2 space-y-1">
              <input
                type="text"
                value={settings.contactInfo.phone || ''}
                onChange={(e) =>
                  setContactInfo({
                    ...settings.contactInfo,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone"
                className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none"
              />
              <input
                type="email"
                value={settings.contactInfo.email || ''}
                onChange={(e) =>
                  setContactInfo({
                    ...settings.contactInfo,
                    email: e.target.value,
                  })
                }
                placeholder="Email"
                className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none"
              />
              <input
                type="text"
                value={settings.contactInfo.website || ''}
                onChange={(e) =>
                  setContactInfo({
                    ...settings.contactInfo,
                    website: e.target.value,
                  })
                }
                placeholder="Website"
                className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Cover Images Accordion */}
        <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.02]">
          <button
            onClick={() => setIsCoverOpen(!isCoverOpen)}
            className="flex w-full items-center justify-between px-2.5 py-2 text-left transition-colors hover:bg-white/[0.05]"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-white/90">
                Cover Images
              </span>
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
                isCoverOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isCoverOpen && (
            <div className="border-t border-white/5 p-2 space-y-1">
              <div>
                <label className="mb-0.5 block text-[9px] text-white/50">
                  Front Cover
                </label>
                <input
                  type="text"
                  value={settings.cover.frontCover || ''}
                  onChange={(e) => setFrontCover(e.target.value)}
                  placeholder="Image URL"
                  className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-0.5 block text-[9px] text-white/50">
                  Back Cover
                </label>
                <input
                  type="text"
                  value={settings.cover.backCover || ''}
                  onChange={(e) => setBackCover(e.target.value)}
                  placeholder="Image URL"
                  className="w-full rounded border border-white/10 bg-white/5 px-2 py-1.5 text-[10px] text-white placeholder:text-white/40 focus:border-purple-500/50 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

'use client';

import React, { useRef } from 'react';
import {
  X,
  Check,
  Settings,
  Upload,
  FileText,
  Grid3x3,
  List,
  LayoutGrid,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCatalogueStore } from '@/store/catalogueStore';

interface CatalogueSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CatalogueSettingsModal({
  isOpen,
  onClose,
}: CatalogueSettingsModalProps) {
  const { leftOpen, rightOpen, topOpen, bottomOpen } = useSidebarStore();
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed z-[100] flex items-center justify-center bg-black/90 backdrop-blur-xl transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '16px',
        right: rightOpen ? '276px' : '16px',
        top: topOpen ? '64px' : '16px',
        bottom: bottomOpen ? '64px' : '16px',
      }}
      onClick={onClose}
    >
      <div
        className="relative my-4 flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0F] shadow-2xl backdrop-blur-sm"
        style={{ maxHeight: 'calc(100% - 2rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-shrink-0 items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-white/80" />
            <h2 className="text-xl font-semibold text-white">PDF Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg bg-white/5 p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          {/* Page Format */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/90">
              Page Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPageFormat('a4-portrait')}
                className={`group relative overflow-hidden rounded-lg border p-4 transition-all ${
                  settings.pageFormat === 'a4-portrait'
                    ? 'border-white/40 bg-white/10'
                    : 'hover:bg-white/8 border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <div
                    className={`h-16 w-11 rounded border-2 ${
                      settings.pageFormat === 'a4-portrait'
                        ? 'border-white/60'
                        : 'border-white/30'
                    }`}
                  />
                </div>
                <div className="text-center text-sm text-white/80">
                  Portrait
                </div>
                {settings.pageFormat === 'a4-portrait' && (
                  <div className="absolute right-2 top-2 rounded-full bg-white/20 p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setPageFormat('a4-landscape')}
                className={`group relative overflow-hidden rounded-lg border p-4 transition-all ${
                  settings.pageFormat === 'a4-landscape'
                    ? 'border-white/40 bg-white/10'
                    : 'hover:bg-white/8 border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="mb-2 flex justify-center">
                  <div
                    className={`h-11 w-16 rounded border-2 ${
                      settings.pageFormat === 'a4-landscape'
                        ? 'border-white/60'
                        : 'border-white/30'
                    }`}
                  />
                </div>
                <div className="text-center text-sm text-white/80">
                  Landscape
                </div>
                {settings.pageFormat === 'a4-landscape' && (
                  <div className="absolute right-2 top-2 rounded-full bg-white/20 p-1">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Page Layout */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/90">
              Layout Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPageLayout('grid')}
                className={`group relative overflow-hidden rounded-lg border p-3 transition-all ${
                  settings.pageLayout === 'grid'
                    ? 'border-white/40 bg-white/10'
                    : 'hover:bg-white/8 border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <Grid3x3 className="mx-auto mb-1 h-6 w-6 text-white/70" />
                <div className="text-center text-xs text-white/80">Grid</div>
                {settings.pageLayout === 'grid' && (
                  <div className="absolute right-1.5 top-1.5 rounded-full bg-white/20 p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setPageLayout('list')}
                className={`group relative overflow-hidden rounded-lg border p-3 transition-all ${
                  settings.pageLayout === 'list'
                    ? 'border-white/40 bg-white/10'
                    : 'hover:bg-white/8 border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <List className="mx-auto mb-1 h-6 w-6 text-white/70" />
                <div className="text-center text-xs text-white/80">List</div>
                {settings.pageLayout === 'list' && (
                  <div className="absolute right-1.5 top-1.5 rounded-full bg-white/20 p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>

              <button
                onClick={() => setPageLayout('magazine')}
                className={`group relative overflow-hidden rounded-lg border p-3 transition-all ${
                  settings.pageLayout === 'magazine'
                    ? 'border-white/40 bg-white/10'
                    : 'hover:bg-white/8 border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <LayoutGrid className="mx-auto mb-1 h-6 w-6 text-white/70" />
                <div className="text-center text-xs text-white/80">
                  Magazine
                </div>
                {settings.pageLayout === 'magazine' && (
                  <div className="absolute right-1.5 top-1.5 rounded-full bg-white/20 p-0.5">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Images Per Page */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/90">
              Images Per Page
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[1, 2, 4, 6, 8, 12].map((count) => (
                <button
                  key={count}
                  onClick={() => setImagesPerPage(count)}
                  className={`rounded-lg border p-2 text-sm font-medium transition-all ${
                    settings.imagesPerPage === count
                      ? 'border-white/40 bg-white/10 text-white'
                      : 'hover:bg-white/8 border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Fields */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/90">
              Information to Display
            </label>
            <div className="grid grid-cols-3 gap-2">
              {settings.metadataFields.map((field) => (
                <button
                  key={field.key}
                  onClick={() => toggleMetadataField(field.key)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-all ${
                    field.enabled
                      ? 'border-white/40 bg-white/10 text-white'
                      : 'hover:bg-white/8 border-white/10 bg-white/5 text-white/60 hover:border-white/20 hover:text-white'
                  }`}
                >
                  <div
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded ${
                      field.enabled ? 'bg-white/30' : 'border border-white/30'
                    }`}
                  >
                    {field.enabled && <Check className="h-2.5 w-2.5" />}
                  </div>
                  <span className="flex-1">{field.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Margins & Page Numbers Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Margins */}
            <div>
              <label className="mb-3 block text-sm font-medium text-white/90">
                Margins (mm)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['top', 'bottom', 'left', 'right'] as const).map((side) => (
                  <div key={side} className="flex items-center gap-2">
                    <label className="w-12 text-xs text-white/60">
                      {side.charAt(0).toUpperCase() + side.slice(1)}
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={settings.margins[side]}
                      onChange={(e) =>
                        setMargin(side, parseInt(e.target.value) || 0)
                      }
                      className="w-16 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs text-white outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Page Numbers Toggle */}
            <div>
              <label className="mb-3 block text-sm font-medium text-white/90">
                Page Numbers
              </label>
              <button
                onClick={() => setShowPageNumbers(!settings.showPageNumbers)}
                className="hover:bg-white/8 flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 transition-colors"
              >
                <span className="text-sm text-white/80">
                  {settings.showPageNumbers ? 'Enabled' : 'Disabled'}
                </span>
                <div
                  className={`relative h-5 w-9 rounded-full transition-colors ${
                    settings.showPageNumbers ? 'bg-white/30' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                      settings.showPageNumbers
                        ? 'translate-x-4'
                        : 'translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/90">
              Contact Information
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Company Name"
                value={settings.contactInfo.companyName || ''}
                onChange={(e) =>
                  setContactInfo({ companyName: e.target.value })
                }
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={settings.contactInfo.phone || ''}
                  onChange={(e) => setContactInfo({ phone: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={settings.contactInfo.email || ''}
                  onChange={(e) => setContactInfo({ email: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Address"
                  value={settings.contactInfo.address || ''}
                  onChange={(e) => setContactInfo({ address: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                />
                <input
                  type="url"
                  placeholder="Website"
                  value={settings.contactInfo.website || ''}
                  onChange={(e) => setContactInfo({ website: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition-colors focus:border-white/30 focus:bg-white/10"
                />
              </div>
            </div>
          </div>

          {/* Cover Pages */}
          <div>
            <label className="mb-3 block text-sm font-medium text-white/90">
              Cover Pages (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <CoverUpload
                label="Front"
                coverUrl={settings.cover.frontCover}
                onUpload={setFrontCover}
                onRemove={() => setFrontCover(undefined)}
              />
              <CoverUpload
                label="Back"
                coverUrl={settings.cover.backCover}
                onUpload={setBackCover}
                onRemove={() => setBackCover(undefined)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-shrink-0 justify-end border-t border-white/10 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-white/10 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// CoverUpload Component
interface CoverUploadProps {
  label: string;
  coverUrl?: string;
  onUpload: (url: string) => void;
  onRemove: () => void;
}

function CoverUpload({
  label,
  coverUrl,
  onUpload,
  onRemove,
}: CoverUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Convert to data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpload(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <p className="mb-2 text-xs text-white/60">{label}</p>
      {coverUrl ? (
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/10">
          <img
            src={coverUrl}
            alt={label}
            className="h-full w-full object-cover"
          />
          <button
            onClick={onRemove}
            className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white/80 backdrop-blur-sm transition-colors hover:bg-red-500/80 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 transition-colors hover:border-white/40 hover:bg-white/5"
        >
          <Upload className="h-5 w-5 text-white/40" />
          <span className="text-xs text-white/40">Upload</span>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

export default CatalogueSettingsModal;

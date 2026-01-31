/**
 * BatchDetailContent Component
 *
 * Full-page batch detail view (replaces modal)
 * Shows batch project images with actions
 * Adapts to sidebar states
 */

'use client';

import React from 'react';
import {
  ArrowLeft,
  Download,
  Eye,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

interface BatchImage {
  id: string;
  original_filename: string;
  original_url: string | null;
  result_url: string | null;
  status: string;
  error_message?: string | null;
  created_at?: string; // Optional
}

interface BatchProject {
  id: string;
  name: string;
  prompt?: string; // Optional
  total_images: number;
  completed_images: number;
  created_at: string;
  batch_images?: BatchImage[];
}

interface BatchDetailContentProps {
  project: BatchProject;
  onBack: () => void;
  onViewImage: (image: {
    originalUrl: string | null;
    generatedUrl: string;
    name: string;
  }) => void;
  onOpenInStudio: (image: {
    imageUrl: string;
    originalUrl?: string | null;
    name: string;
  }) => void;
  onDownloadImage: (imageUrl: string, filename: string) => void;
}

export function BatchDetailContent({
  project,
  onBack,
  onViewImage,
  onOpenInStudio,
  onDownloadImage,
}: BatchDetailContentProps) {
  const { leftOpen } = useSidebarStore();

  const images = project.batch_images || [];
  const completedImages = images.filter((img) => img.status === 'completed');
  const failedImages = images.filter((img) => img.status === 'failed');

  return (
    <div
      className="fixed z-10 flex h-full flex-col gap-6 overflow-y-auto p-6 transition-all duration-[400ms] ease-[cubic-bezier(0.4,0.0,0.2,1)]"
      style={{
        left: leftOpen ? '260px' : '16px',
        right: '16px',
        top: '16px',
        bottom: '16px',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </button>
          <h1 className="mb-2 text-3xl font-bold text-white">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(project.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </div>
            <div className="flex items-center gap-1.5">
              <ImageIcon className="h-4 w-4" />
              {project.total_images} images
            </div>
            {completedImages.length > 0 && (
              <div className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                ✓ {completedImages.length} completed
              </div>
            )}
            {failedImages.length > 0 && (
              <div className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">
                ✗ {failedImages.length} failed
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prompt */}
      {project.prompt && (
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h3 className="mb-2 text-sm font-semibold text-white/80">Prompt</h3>
          <p className="text-sm text-white/60">{project.prompt}</p>
        </div>
      )}

      {/* Images Grid */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-white">
          Images ({images.length})
        </h3>

        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 py-20">
            <ImageIcon className="mb-4 h-12 w-12 text-white/20" />
            <p className="text-white/60">No images in this batch</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-white/5 transition-all hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20"
              >
                {/* Image */}
                <img
                  src={image.result_url || image.original_url || '/placeholder.png'}
                  alt={image.original_filename}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Status Badge */}
                <div className="absolute left-2 top-2">
                  {image.status === 'completed' && (
                    <div className="rounded-full bg-green-500/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      ✓ Done
                    </div>
                  )}
                  {image.status === 'failed' && (
                    <div className="rounded-full bg-red-500/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      ✗ Failed
                    </div>
                  )}
                  {image.status === 'processing' && (
                    <div className="rounded-full bg-blue-500/80 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
                      ⏳ Processing
                    </div>
                  )}
                </div>

                {/* Filename */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="truncate text-xs text-white">
                    {image.original_filename}
                  </p>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/70 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                  {/* Compare Button (if has original) */}
                  {image.original_url && image.result_url && (
                    <button
                      onClick={() =>
                        onViewImage({
                          originalUrl: image.original_url,
                          generatedUrl: image.result_url!,
                          name: image.original_filename,
                        })
                      }
                      className="rounded-lg bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                      title="Compare Before/After"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}

                  {/* Open in Studio */}
                  {image.result_url && (
                    <button
                      onClick={() =>
                        onOpenInStudio({
                          imageUrl: image.result_url!,
                          originalUrl: image.original_url,
                          name: image.original_filename,
                        })
                      }
                      className="rounded-lg bg-purple-500/20 p-2.5 text-purple-400 backdrop-blur-sm transition-colors hover:bg-purple-500/30"
                      title="Open in Studio"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  )}

                  {/* Download */}
                  {image.result_url && (
                    <button
                      onClick={() =>
                        onDownloadImage(image.result_url!, image.original_filename)
                      }
                      className="rounded-lg bg-white/10 p-2.5 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default BatchDetailContent;


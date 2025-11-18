'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import { BatchContent } from '@/components/organisms/BatchContent';
import { BatchProcessingModal } from '@/components/organisms/BatchProcessingModal';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';
import { saveBatchProject, type BatchProject } from '@/lib/batch-storage';
import { toast } from 'sonner';

// Dynamic imports matching Studio page
const Sidebar = dynamic(() => import('@/components/organisms/Sidebar'), {
  loading: () => null,
});
const SidebarToggle = dynamic(() => import('@/components/atoms/SidebarToggle'));
const RightSidebar = dynamic(
  () => import('@/components/organisms/RightSidebar'),
  { loading: () => null }
);
const RightSidebarToggle = dynamic(
  () => import('@/components/atoms/RightSidebarToggle')
);
const TopBar = dynamic(() => import('@/components/organisms/TopBar'), {
  loading: () => null,
});
const TopBarToggle = dynamic(() => import('@/components/atoms/TopBarToggle'));
const BottomBar = dynamic(() => import('@/components/organisms/BottomBar'), {
  loading: () => null,
});
const BottomBarToggle = dynamic(
  () => import('@/components/atoms/BottomBarToggle')
);

/**
 * BatchPage - Batch processing page with Studio layout
 */
export function BatchPage() {
  const [images, setImages] = useState<BatchImage[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [batchName, setBatchName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Handle file selection
  const handleFilesSelected = useCallback((files: File[]) => {
    const newImages: BatchImage[] = files.map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
    }));

    setImages((prev) => [...prev, ...newImages]);
  }, []);

  // Handle remove image
  const handleRemoveImage = useCallback((id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter((img) => img.id !== id);
    });
  }, []);

  // Handle clear all
  const handleClearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  }, [images]);

  // Handle preset from RightSidebar
  const handleGenerateWithPreset = useCallback(
    (prompt: string, aspectRatio?: string) => {
      if (images.length === 0) {
        alert('Please upload images first');
        return;
      }
      // Store preset info
      setSelectedPreset(prompt);
      // Auto-start batch
      handleStartBatch();
    },
    [images]
  );

  // Handle start batch
  const handleStartBatch = useCallback(async () => {
    if (!selectedPreset || images.length === 0) return;

    setIsProcessing(true);
    setIsPaused(false);

    // Process images one by one
    for (let i = 0; i < images.length; i++) {
      // Check for pause
      while (isPaused) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const imageId = images[i].id;

      // Set processing
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, status: 'processing', progress: 0 } : img
        )
      );

      // Simulate progress
      for (let progress = 0; progress <= 100; progress += 20) {
        // Check for pause during progress
        while (isPaused) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        await new Promise((resolve) => setTimeout(resolve, 200));
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, progress } : img
          )
        );
      }

      // Set completed with result thumbnail
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? { ...img, status: 'completed', progress: 100, result: img.preview }
            : img
        )
      );
    }

    // Batch processing complete - save to Gallery
    const completedImages = images.filter((img) => img.status === 'completed');
    
    if (completedImages.length > 0) {
      try {
        const batchProject: BatchProject = {
          id: crypto.randomUUID(),
          name: batchName || `Batch ${new Date().toLocaleDateString()}`,
          createdAt: new Date(),
          imageCount: completedImages.length,
          thumbnail: completedImages[0].result,
          images: completedImages.map((img) => ({
            id: img.id,
            originalFile: img.file.name,
            originalPreview: img.preview,
            result: img.result || img.preview,
            status: 'completed',
          })),
        };

        await saveBatchProject(batchProject);
        toast.success(`Batch saved! ${completedImages.length} images processed.`);
      } catch (error) {
        console.error('Failed to save batch project:', error);
        toast.error('Failed to save batch project');
      }
    }

    setIsProcessing(false);
  }, [selectedPreset, images, isPaused, batchName]);

  // Handle pause/resume
  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Handle cancel batch
  const handleCancelBatch = useCallback(() => {
    setIsProcessing(false);
    setIsPaused(false);
    setIsMinimized(false);
    // Reset all processing images to pending
    setImages((prev) =>
      prev.map((img) =>
        img.status === 'processing' || img.status === 'pending'
          ? { ...img, status: 'pending', progress: 0 }
          : img
      )
    );
  }, []);

  const processingStarted = images.some(
    (img) => img.status === 'processing' || img.status === 'completed'
  );

  return (
    <>
      {/* Aurora Background */}
      <AuroraBackground />

      {/* Top Bar */}
      <TopBar />
      <TopBarToggle />

      {/* Left Sidebar */}
      <Sidebar />
      <SidebarToggle />

      {/* Right Sidebar - Same as Studio */}
      <RightSidebar onGenerateWithPreset={handleGenerateWithPreset} />
      <RightSidebarToggle />

      {/* Bottom Bar */}
      <BottomBar />
      <BottomBarToggle />

      {/* Batch Content - Replaces Canvas */}
      <BatchContent
        images={images}
        onFilesSelected={handleFilesSelected}
        onRemoveImage={handleRemoveImage}
        onClearAll={handleClearAll}
        disabled={isProcessing}
        batchName={batchName}
        onBatchNameChange={setBatchName}
      />

      {/* Processing Modal */}
      {processingStarted && (
        <BatchProcessingModal
          images={images}
          isMinimized={isMinimized}
          isPaused={isPaused}
          onMinimize={() => setIsMinimized(true)}
          onMaximize={() => setIsMinimized(false)}
          onTogglePause={handleTogglePause}
          onCancel={handleCancelBatch}
          canCancel={isProcessing}
        />
      )}
    </>
  );
}

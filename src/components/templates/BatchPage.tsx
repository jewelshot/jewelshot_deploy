'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import { BatchContent } from '@/components/organisms/BatchContent';
import { BatchProcessingModal } from '@/components/organisms/BatchProcessingModal';
import { BatchConfirmModal } from '@/components/molecules/BatchConfirmModal';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';
import { saveBatchProject, type BatchProject } from '@/lib/batch-storage';
import { useSidebarStore } from '@/store/sidebarStore';
import { useCreditStore } from '@/store/creditStore';
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
 * Convert blob URL to base64 data URI
 */
async function blobUrlToDataUri(blobUrl: string): Promise<string> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * BatchPage - Batch processing page with Studio layout
 */
export function BatchPage() {
  const router = useRouter();
  const { openRight } = useSidebarStore();
  const { credits, fetchCredits } = useCreditStore();
  const [images, setImages] = useState<BatchImage[]>([]);
  const [batchPrompt, setBatchPrompt] = useState('');
  const [batchName, setBatchName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Fetch credits on mount
  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Auto-expand right sidebar when images are uploaded
  useEffect(() => {
    if (images.length > 0) {
      openRight();
    }
  }, [images.length, openRight]);

  // Handle image click - Open in Studio
  const handleImageClick = useCallback(
    (id: string, preview: string) => {
      const image = images.find((img) => img.id === id);
      if (!image) return;

      // Use result if available, otherwise use preview
      const imageUrl = image.result || preview;
      const imageName = image.file.name;

      const params = new URLSearchParams({
        imageUrl,
        imageName,
      });

      router.push(`/studio?${params.toString()}`);
    },
    [images, router]
  );

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
    setBatchPrompt('');
  }, [images]);

  // Handle generate from prompt control OR preset from RightSidebar
  const handleGenerate = useCallback((prompt: string) => {
    if (images.length === 0) {
      toast.error('Please upload images first');
      return;
    }

    // Check credits
    if (credits < images.length) {
      toast.error(`Insufficient credits. You need ${images.length} credits, but have ${credits}.`);
      return;
    }

    setBatchPrompt(prompt);
    setShowConfirmModal(true);
  }, [images, credits]);

  // Handle preset from RightSidebar
  const handleGenerateWithPreset = useCallback(
    (prompt: string, aspectRatio?: string) => {
      handleGenerate(prompt);
    },
    [handleGenerate]
  );

  // Handle confirm batch processing
  const handleConfirmBatch = useCallback(async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);
    setIsPaused(false);
    setIsMinimized(false);

    // Process images one by one
    for (let i = 0; i < images.length; i++) {
      // Check for pause
      while (isPaused) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const image = images[i];
      const imageId = image.id;

      // Set processing
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, status: 'processing', progress: 0 } : img
        )
      );

      try {
        // Convert blob URL to data URI
        const imageDataUri = await blobUrlToDataUri(image.preview);

        // Call AI edit API
        const response = await fetch('/api/ai/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: imageDataUri, // ✅ API expects image_url (not imageUrl)
            prompt: batchPrompt || '',
          }),
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.statusText}`);
        }

        const data = await response.json();

        // FAL.AI returns: { images: [{ url, width, height }] }
        if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
          throw new Error(data.error || 'No images returned from API');
        }

        const editedImageUrl = data.images[0].url;

        // Update to completed with result
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  status: 'completed',
                  progress: 100,
                  result: editedImageUrl,
                }
              : img
          )
        );

        toast.success(`${image.file.name} processed successfully`);
      } catch (error) {
        console.error(`Failed to process ${image.file.name}:`, error);
        
        // Mark as failed
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  status: 'failed',
                  progress: 0,
                  error: error instanceof Error ? error.message : 'Processing failed',
                }
              : img
          )
        );

        toast.error(`Failed to process ${image.file.name}`);
      }
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
  }, [images, batchPrompt, batchName, isPaused]);

  // Handle pause/resume
  const handleTogglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Handle cancel batch
  const handleCancelBatch = useCallback(() => {
    setIsProcessing(false);
    setIsPaused(false);
    setIsMinimized(false);
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

      {/* Right Sidebar - Preset selection */}
      <RightSidebar onGenerateWithPreset={handleGenerateWithPreset} />
      <RightSidebarToggle />

      {/* Bottom Bar */}
      <BottomBar />
      <BottomBarToggle />

      {/* Batch Content */}
      <BatchContent
        images={images}
        onFilesSelected={handleFilesSelected}
        onRemoveImage={handleRemoveImage}
        onClearAll={handleClearAll}
        disabled={isProcessing}
        batchName={batchName}
        onBatchNameChange={setBatchName}
        onImageClick={handleImageClick}
        onGenerate={handleGenerate}
        isProcessing={isProcessing}
      />

      {/* Batch Confirm Modal */}
      <BatchConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmBatch}
        onCancel={() => setShowConfirmModal(false)}
        imageCount={images.length}
        prompt={batchPrompt}
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
          canCancel={!isProcessing || images.every(img => img.status !== 'processing')}
        />
      )}
    </>
  );
}

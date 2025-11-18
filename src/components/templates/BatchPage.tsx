'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import AuroraBackground from '@/components/atoms/AuroraBackground';
import { BatchContent } from '@/components/organisms/BatchContent';
import { BatchConfirmModal } from '@/components/molecules/BatchConfirmModal';
import type { BatchImage } from '@/components/molecules/BatchImageGrid';
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPromptInModal, setShowPromptInModal] = useState(true); // Hide preset prompts

  // Note: State persistence removed due to blob URL invalidation on page reload
  // Blob URLs (blob:http://...) are temporary and become invalid after page refresh
  // Users should complete batch processing in one session

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

  // Handle generate from prompt control (custom prompt - show in modal)
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
    setShowPromptInModal(true); // Show custom prompt
    setShowConfirmModal(true);
  }, [images, credits]);

  // Handle preset from RightSidebar (hide prompt in modal)
  const handleGenerateWithPreset = useCallback(
    (prompt: string, aspectRatio?: string) => {
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
      setShowPromptInModal(false); // Hide preset prompt
      setShowConfirmModal(true);
    },
    [images, credits]
  );

  // Handle confirm batch processing
  const handleConfirmBatch = useCallback(async () => {
    setShowConfirmModal(false);
    setIsProcessing(true);

    // Capture current prompt (closure issue fix)
    const currentBatchPrompt = batchPrompt || 'enhance the image quality and details';

    // 1. Create batch project in Supabase
    let batchProjectId: string | null = null;
    try {
      const response = await fetch('/api/batch/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: batchName || `Batch ${new Date().toLocaleString()}`,
          totalImages: images.length,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Check if it's a migration issue (500 error)
        if (response.status === 500) {
          console.error('[Batch] ❌ Database migration required!');
          toast.error('⚠️ Database setup required! Redirecting...');
          setIsProcessing(false);
          
          // Redirect to setup page after 2 seconds
          setTimeout(() => {
            window.location.href = '/setup';
          }, 2000);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to create batch project');
      }

      const data = await response.json();
      batchProjectId = data.project.id;
      
      toast.success('Batch project created! Processing images...');
      console.log('[Batch] Project created:', batchProjectId);
    } catch (error) {
      console.error('[Batch] Failed to create project:', error);
      toast.error('Failed to create batch project');
      setIsProcessing(false);
      return;
    }

    // Process images one by one
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageId = image.id;

      // Set processing
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId ? { ...img, status: 'processing', progress: 0 } : img
        )
      );

      // Start progress simulation (40 seconds to reach ~95%)
      const progressInterval = setInterval(() => {
        setImages((prev) =>
          prev.map((img) => {
            if (img.id === imageId && img.status === 'processing') {
              const currentProgress = img.progress || 0;
              // Increment by ~2.4% each second to reach 95% in ~40s
              const newProgress = Math.min(currentProgress + 2.4, 95);
              return { ...img, progress: newProgress };
            }
            return img;
          })
        );
      }, 1000); // Update every second

      try {
        // TODO: Credit deduction should be handled by /api/ai/edit
        // Currently that endpoint only checks credits, doesn't deduct them
        
        // Convert blob URL to data URI
        const imageDataUri = await blobUrlToDataUri(image.preview);

        // Call AI edit API
        console.log('[Batch] Sending request:', {
          imageSize: imageDataUri.length,
          promptLength: currentBatchPrompt.length,
          prompt: currentBatchPrompt.substring(0, 100),
        });

        const response = await fetch('/api/ai/edit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: imageDataUri,
            prompt: currentBatchPrompt,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('[Batch] API Error:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });
          throw new Error(errorData.message || errorData.error || `API error: ${response.statusText}`);
        }

        const data = await response.json();

        // FAL.AI returns: { images: [{ url, width, height }] }
        if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
          throw new Error(data.error || 'No images returned from API');
        }

        const editedImageUrl = data.images[0].url;

        console.log('[Batch] Image completed:', {
          filename: image.file.name,
          originalPreview: image.preview.substring(0, 50),
          generatedUrl: editedImageUrl.substring(0, 50),
        });

        // Stop progress simulation
        clearInterval(progressInterval);

        // Update to completed with result (progress = 100%)
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

        // 2. Save completed image to Supabase
        if (batchProjectId) {
          try {
            await fetch(`/api/batch/${batchProjectId}/image`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                originalFilename: image.file.name,
                originalSize: image.file.size,
                resultUrl: editedImageUrl,
                status: 'completed',
              }),
            });
            console.log('[Batch] Image saved to DB:', image.file.name);
          } catch (dbError) {
            console.error('[Batch] Failed to save image to DB:', dbError);
            // Don't fail the whole batch, just log it
          }
        }

        toast.success(`${image.file.name} processed successfully`);
      } catch (error) {
        console.error(`Failed to process ${image.file.name}:`, error);
        
        // Stop progress simulation
        clearInterval(progressInterval);

        // Mark as failed
        const errorMessage = error instanceof Error ? error.message : 'Processing failed';
        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId
              ? {
                  ...img,
                  status: 'failed',
                  progress: 0,
                  error: errorMessage,
                }
              : img
          )
        );

        // Save failed image to Supabase
        if (batchProjectId) {
          try {
            await fetch(`/api/batch/${batchProjectId}/image`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                originalFilename: image.file.name,
                originalSize: image.file.size,
                status: 'failed',
                errorMessage,
              }),
            });
            console.log('[Batch] Failed image saved to DB:', image.file.name);
          } catch (dbError) {
            console.error('[Batch] Failed to save failed image to DB:', dbError);
          }
        }

        toast.error(`Failed to process ${image.file.name}`);
      }
    }

    // Batch processing complete
    const completedCount = images.filter((img) => img.status === 'completed').length;
    const failedCount = images.filter((img) => img.status === 'failed').length;
    
    toast.success(
      `Batch complete! ${completedCount} successful, ${failedCount} failed.`,
      { duration: 5000 }
    );
    
    console.log('[Batch] Processing complete', {
      total: images.length,
      completed: completedCount,
      failed: failedCount,
      projectId: batchProjectId,
    });

    // Refresh credits after batch completes
    fetchCredits();
    
    setIsProcessing(false);
  }, [images, batchPrompt, batchName, fetchCredits]);

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
        prompt={showPromptInModal ? batchPrompt : undefined}
      />
    </>
  );
}

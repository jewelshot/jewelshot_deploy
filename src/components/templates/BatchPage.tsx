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
  const [presetName, setPresetName] = useState(''); // Store preset name (not prompt)
  const [aspectRatio, setAspectRatio] = useState<string>(''); // Required aspect ratio
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isCustomPrompt, setIsCustomPrompt] = useState(false); // Track if user typed custom prompt

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
    setPresetName('');
    setAspectRatio('');
  }, [images]);

  // Handle generate from prompt control (custom prompt - show in modal)
  const handleGenerate = useCallback((prompt: string) => {
    if (images.length === 0) {
      toast.error('Please upload images first');
      return;
    }

    // Aspect ratio is required
    if (!aspectRatio) {
      toast.error('Please select an aspect ratio first');
      return;
    }

    // Check credits
    if (credits < images.length) {
      toast.error(`Insufficient credits. You need ${images.length} credits, but have ${credits}.`);
      return;
    }

    setBatchPrompt(prompt);
    setPresetName(''); // Clear preset name
    setIsCustomPrompt(true); // Mark as custom prompt
    setShowConfirmModal(true);
  }, [images, credits, aspectRatio]);

  // Handle preset from RightSidebar (show preset name, not prompt)
  const handleGenerateWithPreset = useCallback(
    (prompt: string, ratio?: string, name?: string) => {
      if (images.length === 0) {
        toast.error('Please upload images first');
        return;
      }

      // Aspect ratio is required
      if (!ratio && !aspectRatio) {
        toast.error('Please select an aspect ratio first');
        return;
      }

      // Check credits
      if (credits < images.length) {
        toast.error(`Insufficient credits. You need ${images.length} credits, but have ${credits}.`);
        return;
      }

      setBatchPrompt(prompt); // Store the actual prompt for API
      setPresetName(name || 'Selected Preset'); // Store preset name for display
      setIsCustomPrompt(false); // Mark as preset
      if (ratio) setAspectRatio(ratio); // Use preset's aspect ratio if provided
      setShowConfirmModal(true);
    },
    [images, credits, aspectRatio]
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

      // Retry configuration
      const MAX_RETRIES = 3;
      
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
        // Convert blob URL to data URI
        const imageDataUri = await blobUrlToDataUri(image.preview);

        // Retry logic: 3 attempts with exponential backoff
        let lastError: Error | null = null;
        let response: Response | null = null;

        for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
          try {
            console.log(`[Batch] Attempt ${attempt}/${MAX_RETRIES} for ${image.file.name}`, {
              imageSize: imageDataUri.length,
              promptLength: currentBatchPrompt.length,
              prompt: currentBatchPrompt.substring(0, 100),
            });

            response = await fetch('/api/ai/edit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                image_url: imageDataUri,
                prompt: currentBatchPrompt,
                aspect_ratio: aspectRatio || '1:1', // Send aspect ratio to nano banana
              }),
            });

            // Success!
            if (response.ok) {
              if (attempt > 1) {
                console.log(`[Batch] ✅ Succeeded on attempt ${attempt}`);
              }
              break;
            }

            // Error - check if we should retry
            const errorData = await response.json().catch(() => ({}));
            const statusCode = response.status;
            
            console.warn(`[Batch] Attempt ${attempt} failed:`, {
              status: statusCode,
              error: errorData,
            });

            // Retry on 500, 502, 503, 504 (server errors)
            if (statusCode >= 500 && statusCode < 600 && attempt < MAX_RETRIES) {
              const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // 1s, 2s, 4s (max 5s)
              console.log(`[Batch] Retrying in ${waitTime}ms...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }

            // Don't retry on 4xx errors (client errors)
            lastError = new Error(errorData.message || errorData.error || `API error: ${response.statusText}`);
            break;
          } catch (fetchError) {
            lastError = fetchError instanceof Error ? fetchError : new Error('Network error');
            
            // Retry on network errors
            if (attempt < MAX_RETRIES) {
              const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
              console.log(`[Batch] Network error, retrying in ${waitTime}ms...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            }
          }
        }

        // Check final result
        if (!response || !response.ok) {
          console.error('[Batch] All attempts failed:', {
            filename: image.file.name,
            attempts: MAX_RETRIES,
            lastError: lastError?.message,
          });
          throw lastError || new Error('Failed after all retries');
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

        toast.success(`✅ ${image.file.name} completed`);
      } catch (error) {
        console.error(`❌ Failed to process ${image.file.name} after ${MAX_RETRIES} attempts:`, error);
        
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
                errorMessage: `Failed after ${MAX_RETRIES} retries: ${errorMessage}`,
              }),
            });
            console.log('[Batch] Failed image saved to DB:', image.file.name);
          } catch (dbError) {
            console.error('[Batch] Failed to save failed image to DB:', dbError);
          }
        }

        // Don't show error toast immediately - continue processing
        console.log(`[Batch] ⏭️ Skipping ${image.file.name}, continuing with next image...`);
      }
    }

    // Batch processing complete
    const completedCount = images.filter((img) => img.status === 'completed').length;
    const failedCount = images.filter((img) => img.status === 'failed').length;
    
    // Show summary with retry info
    if (failedCount > 0) {
      toast.warning(
        `🎯 Batch Complete!\n✅ ${completedCount} succeeded\n❌ ${failedCount} failed after retries`,
        { duration: 6000 }
      );
    } else {
      toast.success(
        `🎉 All ${completedCount} images processed successfully!`,
        { duration: 4000 }
      );
    }
    
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
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
      />

      {/* Batch Confirm Modal */}
      <BatchConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmBatch}
        onCancel={() => setShowConfirmModal(false)}
        imageCount={images.length}
        prompt={isCustomPrompt ? batchPrompt : undefined}
        presetName={!isCustomPrompt ? presetName : undefined}
        aspectRatio={aspectRatio}
      />
    </>
  );
}

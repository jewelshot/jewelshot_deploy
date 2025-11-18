/**
 * ZIP Utilities
 * Functions for creating and downloading ZIP archives
 */

import JSZip from 'jszip';
import type { BatchProject } from './batch-storage';

/**
 * Download a batch project as ZIP
 */
export async function downloadBatchAsZip(project: BatchProject): Promise<void> {
  try {
    const zip = new JSZip();
    const folder = zip.folder(project.name);

    if (!folder) {
      throw new Error('Failed to create ZIP folder');
    }

    // Add all images to the ZIP
    for (let i = 0; i < project.images.length; i++) {
      const image = project.images[i];
      
      // Convert data URI to blob
      const response = await fetch(image.result);
      const blob = await response.blob();
      
      // Generate filename
      const extension = blob.type.split('/')[1] || 'jpg';
      const filename = `${i + 1}-${image.originalFile.replace(/\.[^/.]+$/, '')}.${extension}`;
      
      folder.file(filename, blob);
    }

    // Add a metadata.json file
    folder.file(
      'metadata.json',
      JSON.stringify(
        {
          projectName: project.name,
          createdAt: project.createdAt,
          imageCount: project.imageCount,
          images: project.images.map((img) => ({
            originalFile: img.originalFile,
            status: img.status,
          })),
        },
        null,
        2
      )
    );

    // Generate ZIP blob
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: {
        level: 6,
      },
    });

    // Download the ZIP
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.name}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to create ZIP:', error);
    throw error;
  }
}

/**
 * Estimate ZIP size (for progress indication)
 */
export function estimateZipSize(project: BatchProject): number {
  // Rough estimation: 70% of original size due to compression
  return project.images.length * 500 * 1024 * 0.7; // 500KB average per image
}


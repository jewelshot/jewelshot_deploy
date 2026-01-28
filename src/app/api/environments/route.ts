/**
 * API Route: /api/environments
 * 
 * Scans the public/environments folder and returns a list of available HDR/EXR files
 * for use as custom environment maps in the 3D viewer.
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface EnvironmentFile {
  id: string;
  name: string;
  filename: string;
  path: string;
  format: 'hdr' | 'exr';
  size: number;
  sizeFormatted: string;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function generateDisplayName(filename: string): string {
  // Remove extension and format nicely
  const nameWithoutExt = filename.replace(/\.(hdr|exr)$/i, '');
  // Replace underscores and dashes with spaces, capitalize words
  return nameWithoutExt
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export async function GET() {
  try {
    const environmentsDir = path.join(process.cwd(), 'public', 'environments');
    
    // Check if directory exists
    if (!fs.existsSync(environmentsDir)) {
      return NextResponse.json({
        success: true,
        environments: [],
        message: 'Environments folder not found',
      });
    }

    // Read directory contents
    const files = fs.readdirSync(environmentsDir);
    
    // Filter for HDR and EXR files
    const environmentFiles: EnvironmentFile[] = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.hdr' || ext === '.exr';
      })
      .map((filename) => {
        const filePath = path.join(environmentsDir, filename);
        const stats = fs.statSync(filePath);
        const ext = path.extname(filename).toLowerCase().slice(1) as 'hdr' | 'exr';
        
        return {
          id: filename.replace(/\.(hdr|exr)$/i, '').toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: generateDisplayName(filename),
          filename,
          path: `/environments/${filename}`,
          format: ext,
          size: stats.size,
          sizeFormatted: formatBytes(stats.size),
          createdAt: stats.birthtime.toISOString(),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({
      success: true,
      environments: environmentFiles,
      count: environmentFiles.length,
      directory: '/environments',
    });
  } catch (error) {
    console.error('Error reading environments directory:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to read environments directory',
        environments: [],
      },
      { status: 500 }
    );
  }
}

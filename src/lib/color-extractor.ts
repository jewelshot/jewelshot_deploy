/**
 * Color Extractor Utility
 * Extract dominant colors from images using color theory principles
 */

export interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  percentage: number;
  name?: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: ExtractedColor[];
  type: 'extracted' | 'custom' | 'complementary' | 'analogous' | 'triadic' | 'split-complementary';
  sourceStyleId?: string;
}

// Convert RGB to HEX
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

// Convert RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Convert HEX to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// K-means clustering for color extraction
function kMeansColors(pixels: number[][], k: number, maxIterations = 20): number[][] {
  if (pixels.length === 0) return [];
  
  // Initialize centroids randomly
  let centroids = pixels.slice(0, k).map(p => [...p]);
  
  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign pixels to closest centroid
    const clusters: number[][][] = Array.from({ length: k }, () => []);
    
    for (const pixel of pixels) {
      let minDist = Infinity;
      let closestIdx = 0;
      
      for (let i = 0; i < centroids.length; i++) {
        const dist = Math.sqrt(
          Math.pow(pixel[0] - centroids[i][0], 2) +
          Math.pow(pixel[1] - centroids[i][1], 2) +
          Math.pow(pixel[2] - centroids[i][2], 2)
        );
        
        if (dist < minDist) {
          minDist = dist;
          closestIdx = i;
        }
      }
      
      clusters[closestIdx].push(pixel);
    }
    
    // Update centroids
    const newCentroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];
      
      const sum = cluster.reduce(
        (acc, p) => [acc[0] + p[0], acc[1] + p[1], acc[2] + p[2]],
        [0, 0, 0]
      );
      
      return [
        sum[0] / cluster.length,
        sum[1] / cluster.length,
        sum[2] / cluster.length,
      ];
    });
    
    // Check for convergence
    const converged = centroids.every((c, i) =>
      Math.abs(c[0] - newCentroids[i][0]) < 1 &&
      Math.abs(c[1] - newCentroids[i][1]) < 1 &&
      Math.abs(c[2] - newCentroids[i][2]) < 1
    );
    
    centroids = newCentroids;
    
    if (converged) break;
  }
  
  return centroids;
}

/**
 * Extract dominant colors from an image URL
 */
export async function extractColorsFromImage(
  imageUrl: string,
  numColors = 5
): Promise<ExtractedColor[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      // Resize for performance (max 100px width)
      const scale = Math.min(1, 100 / img.width);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels: number[][] = [];
      
      // Sample pixels (skip transparent ones)
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        
        // Skip transparent and very dark/light pixels
        if (a > 128) {
          const brightness = (r + g + b) / 3;
          if (brightness > 15 && brightness < 240) {
            pixels.push([r, g, b]);
          }
        }
      }
      
      if (pixels.length === 0) {
        resolve([]);
        return;
      }
      
      // Extract colors using k-means
      const centroids = kMeansColors(pixels, numColors);
      
      // Count pixels for each cluster to calculate percentages
      const counts = new Array(centroids.length).fill(0);
      for (const pixel of pixels) {
        let minDist = Infinity;
        let closestIdx = 0;
        
        for (let i = 0; i < centroids.length; i++) {
          const dist = Math.sqrt(
            Math.pow(pixel[0] - centroids[i][0], 2) +
            Math.pow(pixel[1] - centroids[i][1], 2) +
            Math.pow(pixel[2] - centroids[i][2], 2)
          );
          
          if (dist < minDist) {
            minDist = dist;
            closestIdx = i;
          }
        }
        
        counts[closestIdx]++;
      }
      
      const total = pixels.length;
      
      // Convert to ExtractedColor format
      const colors: ExtractedColor[] = centroids
        .map((centroid, i) => {
          const r = Math.round(centroid[0]);
          const g = Math.round(centroid[1]);
          const b = Math.round(centroid[2]);
          
          return {
            hex: rgbToHex(r, g, b),
            rgb: { r, g, b },
            hsl: rgbToHsl(r, g, b),
            percentage: (counts[i] / total) * 100,
          };
        })
        .sort((a, b) => b.percentage - a.percentage);
      
      resolve(colors);
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    img.src = imageUrl;
  });
}

/**
 * Extract colors from multiple images and merge
 */
export async function extractColorsFromImages(
  imageUrls: string[],
  numColors = 5
): Promise<ExtractedColor[]> {
  const allColors: ExtractedColor[] = [];
  
  for (const url of imageUrls) {
    try {
      const colors = await extractColorsFromImage(url, numColors);
      allColors.push(...colors);
    } catch (error) {
      console.warn('Failed to extract colors from:', url, error);
    }
  }
  
  if (allColors.length === 0) return [];
  
  // Cluster all extracted colors to get unique ones
  const pixels = allColors.map(c => [c.rgb.r, c.rgb.g, c.rgb.b]);
  const centroids = kMeansColors(pixels, numColors);
  
  return centroids.map((centroid, i) => {
    const r = Math.round(centroid[0]);
    const g = Math.round(centroid[1]);
    const b = Math.round(centroid[2]);
    
    return {
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      percentage: 100 / centroids.length,
    };
  });
}

/**
 * Generate complementary colors
 */
export function generateComplementary(baseColor: ExtractedColor): ExtractedColor[] {
  const { h, s, l } = baseColor.hsl;
  
  // Complementary is 180 degrees opposite
  const complementaryH = (h + 180) % 360;
  const complementaryRgb = hslToRgb(complementaryH, s, l);
  
  return [
    baseColor,
    {
      hex: rgbToHex(complementaryRgb.r, complementaryRgb.g, complementaryRgb.b),
      rgb: complementaryRgb,
      hsl: { h: complementaryH, s, l },
      percentage: 50,
    },
  ];
}

/**
 * Generate analogous colors (30 degrees apart)
 */
export function generateAnalogous(baseColor: ExtractedColor): ExtractedColor[] {
  const { h, s, l } = baseColor.hsl;
  
  const angles = [-30, 0, 30];
  
  return angles.map(angle => {
    const newH = (h + angle + 360) % 360;
    const rgb = angle === 0 ? baseColor.rgb : hslToRgb(newH, s, l);
    
    return {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl: { h: newH, s, l },
      percentage: 33.33,
    };
  });
}

/**
 * Generate triadic colors (120 degrees apart)
 */
export function generateTriadic(baseColor: ExtractedColor): ExtractedColor[] {
  const { h, s, l } = baseColor.hsl;
  
  const angles = [0, 120, 240];
  
  return angles.map(angle => {
    const newH = (h + angle) % 360;
    const rgb = angle === 0 ? baseColor.rgb : hslToRgb(newH, s, l);
    
    return {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl: { h: newH, s, l },
      percentage: 33.33,
    };
  });
}

/**
 * Generate split-complementary colors
 */
export function generateSplitComplementary(baseColor: ExtractedColor): ExtractedColor[] {
  const { h, s, l } = baseColor.hsl;
  
  const angles = [0, 150, 210];
  
  return angles.map(angle => {
    const newH = (h + angle) % 360;
    const rgb = angle === 0 ? baseColor.rgb : hslToRgb(newH, s, l);
    
    return {
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl: { h: newH, s, l },
      percentage: 33.33,
    };
  });
}

/**
 * Get a readable name for a color
 */
export function getColorName(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return 'Unknown';
  
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);
  
  // Determine lightness name
  let lightnessName = '';
  if (l < 20) lightnessName = 'Dark ';
  else if (l > 80) lightnessName = 'Light ';
  
  // Determine saturation
  if (s < 10) {
    if (l < 20) return 'Black';
    if (l > 90) return 'White';
    return 'Gray';
  }
  
  // Determine hue name
  let hueName = '';
  if (h < 15 || h >= 345) hueName = 'Red';
  else if (h < 45) hueName = 'Orange';
  else if (h < 75) hueName = 'Yellow';
  else if (h < 165) hueName = 'Green';
  else if (h < 195) hueName = 'Cyan';
  else if (h < 255) hueName = 'Blue';
  else if (h < 285) hueName = 'Purple';
  else if (h < 345) hueName = 'Pink';
  
  return lightnessName + hueName;
}

/**
 * Check if two colors are similar (within threshold)
 */
export function areColorsSimilar(color1: ExtractedColor, color2: ExtractedColor, threshold = 30): boolean {
  const dist = Math.sqrt(
    Math.pow(color1.rgb.r - color2.rgb.r, 2) +
    Math.pow(color1.rgb.g - color2.rgb.g, 2) +
    Math.pow(color1.rgb.b - color2.rgb.b, 2)
  );
  
  return dist < threshold;
}

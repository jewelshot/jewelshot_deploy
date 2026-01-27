/**
 * Unified Model Loader
 * 
 * Supports: GLTF/GLB, FBX, OBJ, STL, 3DM
 * Atomic Architecture: This is a utility module
 */

import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { parse3DMFile, type Rhino3dmDocument } from './rhino-loader';

// ============================================
// TYPES
// ============================================

export type SupportedFormat = 'gltf' | 'glb' | 'fbx' | 'obj' | 'stl' | '3dm';

export interface LoadedModel {
  type: 'geometry' | 'scene' | 'rhino';
  geometry?: THREE.BufferGeometry;
  scene?: THREE.Group;
  rhinoDoc?: Rhino3dmDocument;
  format: SupportedFormat;
  fileName: string;
  metadata?: {
    vertexCount: number;
    faceCount: number;
    hasNormals: boolean;
    hasUVs: boolean;
    hasMaterials: boolean;
    boundingBox: THREE.Box3;
  };
}

export interface LoadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status: string;
}

export type ProgressCallback = (progress: LoadProgress) => void;

// ============================================
// FORMAT DETECTION
// ============================================

/**
 * Detect file format from filename
 */
export function detectFormat(fileName: string): SupportedFormat | null {
  const ext = fileName.toLowerCase().split('.').pop();
  
  switch (ext) {
    case 'gltf':
      return 'gltf';
    case 'glb':
      return 'glb';
    case 'fbx':
      return 'fbx';
    case 'obj':
      return 'obj';
    case 'stl':
      return 'stl';
    case '3dm':
      return '3dm';
    default:
      return null;
  }
}

/**
 * Get list of supported extensions
 */
export function getSupportedExtensions(): string[] {
  return ['.gltf', '.glb', '.fbx', '.obj', '.stl', '.3dm'];
}

/**
 * Get accept string for file input
 */
export function getAcceptString(): string {
  return '.gltf,.glb,.fbx,.obj,.stl,.3dm';
}

/**
 * Check if file is supported
 */
export function isSupported(fileName: string): boolean {
  return detectFormat(fileName) !== null;
}

// ============================================
// DRACO LOADER (for compressed GLTF)
// ============================================

let dracoLoader: DRACOLoader | null = null;

function getDracoLoader(): DRACOLoader {
  if (!dracoLoader) {
    dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
    dracoLoader.setDecoderConfig({ type: 'js' });
  }
  return dracoLoader;
}

// ============================================
// INDIVIDUAL LOADERS
// ============================================

/**
 * Load GLTF/GLB file
 */
async function loadGLTF(
  buffer: ArrayBuffer,
  fileName: string,
  onProgress?: ProgressCallback
): Promise<LoadedModel> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(getDracoLoader());
    
    onProgress?.({
      loaded: 0,
      total: buffer.byteLength,
      percentage: 0,
      status: 'Parsing GLTF...',
    });
    
    // Convert ArrayBuffer to blob URL for loader
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    loader.load(
      url,
      (gltf) => {
        URL.revokeObjectURL(url);
        
        // Calculate metadata
        let vertexCount = 0;
        let faceCount = 0;
        let hasNormals = false;
        let hasUVs = false;
        let hasMaterials = false;
        
        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const geo = child.geometry;
            vertexCount += geo.attributes.position?.count || 0;
            faceCount += geo.index ? geo.index.count / 3 : (geo.attributes.position?.count || 0) / 3;
            hasNormals = hasNormals || !!geo.attributes.normal;
            hasUVs = hasUVs || !!geo.attributes.uv;
            hasMaterials = hasMaterials || !!child.material;
          }
        });
        
        const boundingBox = new THREE.Box3().setFromObject(gltf.scene);
        
        onProgress?.({
          loaded: buffer.byteLength,
          total: buffer.byteLength,
          percentage: 100,
          status: 'Complete',
        });
        
        resolve({
          type: 'scene',
          scene: gltf.scene,
          format: fileName.toLowerCase().endsWith('.glb') ? 'glb' : 'gltf',
          fileName,
          metadata: {
            vertexCount,
            faceCount,
            hasNormals,
            hasUVs,
            hasMaterials,
            boundingBox,
          },
        });
      },
      (xhr) => {
        onProgress?.({
          loaded: xhr.loaded,
          total: xhr.total || buffer.byteLength,
          percentage: (xhr.loaded / (xhr.total || buffer.byteLength)) * 100,
          status: 'Loading GLTF...',
        });
      },
      (error) => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load GLTF: ${error}`));
      }
    );
  });
}

/**
 * Load FBX file
 */
async function loadFBX(
  buffer: ArrayBuffer,
  fileName: string,
  onProgress?: ProgressCallback
): Promise<LoadedModel> {
  return new Promise((resolve, reject) => {
    const loader = new FBXLoader();
    
    onProgress?.({
      loaded: 0,
      total: buffer.byteLength,
      percentage: 0,
      status: 'Parsing FBX...',
    });
    
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    
    loader.load(
      url,
      (fbx) => {
        URL.revokeObjectURL(url);
        
        // Calculate metadata
        let vertexCount = 0;
        let faceCount = 0;
        let hasNormals = false;
        let hasUVs = false;
        let hasMaterials = false;
        
        fbx.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            const geo = child.geometry;
            vertexCount += geo.attributes.position?.count || 0;
            faceCount += geo.index ? geo.index.count / 3 : (geo.attributes.position?.count || 0) / 3;
            hasNormals = hasNormals || !!geo.attributes.normal;
            hasUVs = hasUVs || !!geo.attributes.uv;
            hasMaterials = hasMaterials || !!child.material;
          }
        });
        
        const boundingBox = new THREE.Box3().setFromObject(fbx);
        
        onProgress?.({
          loaded: buffer.byteLength,
          total: buffer.byteLength,
          percentage: 100,
          status: 'Complete',
        });
        
        resolve({
          type: 'scene',
          scene: fbx,
          format: 'fbx',
          fileName,
          metadata: {
            vertexCount,
            faceCount,
            hasNormals,
            hasUVs,
            hasMaterials,
            boundingBox,
          },
        });
      },
      (xhr) => {
        onProgress?.({
          loaded: xhr.loaded,
          total: xhr.total || buffer.byteLength,
          percentage: (xhr.loaded / (xhr.total || buffer.byteLength)) * 100,
          status: 'Loading FBX...',
        });
      },
      (error) => {
        URL.revokeObjectURL(url);
        reject(new Error(`Failed to load FBX: ${error}`));
      }
    );
  });
}

/**
 * Load OBJ file
 */
async function loadOBJ(
  buffer: ArrayBuffer,
  fileName: string,
  onProgress?: ProgressCallback
): Promise<LoadedModel> {
  return new Promise((resolve, reject) => {
    const loader = new OBJLoader();
    
    onProgress?.({
      loaded: 0,
      total: buffer.byteLength,
      percentage: 0,
      status: 'Parsing OBJ...',
    });
    
    try {
      const text = new TextDecoder().decode(buffer);
      const obj = loader.parse(text);
      
      // Calculate metadata
      let vertexCount = 0;
      let faceCount = 0;
      let hasNormals = false;
      let hasUVs = false;
      
      obj.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const geo = child.geometry;
          vertexCount += geo.attributes.position?.count || 0;
          faceCount += geo.index ? geo.index.count / 3 : (geo.attributes.position?.count || 0) / 3;
          hasNormals = hasNormals || !!geo.attributes.normal;
          hasUVs = hasUVs || !!geo.attributes.uv;
        }
      });
      
      const boundingBox = new THREE.Box3().setFromObject(obj);
      
      onProgress?.({
        loaded: buffer.byteLength,
        total: buffer.byteLength,
        percentage: 100,
        status: 'Complete',
      });
      
      resolve({
        type: 'scene',
        scene: obj,
        format: 'obj',
        fileName,
        metadata: {
          vertexCount,
          faceCount,
          hasNormals,
          hasUVs,
          hasMaterials: false,
          boundingBox,
        },
      });
    } catch (error) {
      reject(new Error(`Failed to load OBJ: ${error}`));
    }
  });
}

/**
 * Load STL file
 */
async function loadSTL(
  buffer: ArrayBuffer,
  fileName: string,
  onProgress?: ProgressCallback
): Promise<LoadedModel> {
  return new Promise((resolve, reject) => {
    const loader = new STLLoader();
    
    onProgress?.({
      loaded: 0,
      total: buffer.byteLength,
      percentage: 0,
      status: 'Parsing STL...',
    });
    
    try {
      const geometry = loader.parse(buffer);
      
      // Compute normals if not present
      if (!geometry.attributes.normal) {
        geometry.computeVertexNormals();
      }
      
      const vertexCount = geometry.attributes.position?.count || 0;
      const faceCount = geometry.index ? geometry.index.count / 3 : vertexCount / 3;
      
      // Compute bounding box
      geometry.computeBoundingBox();
      const boundingBox = geometry.boundingBox || new THREE.Box3();
      
      onProgress?.({
        loaded: buffer.byteLength,
        total: buffer.byteLength,
        percentage: 100,
        status: 'Complete',
      });
      
      resolve({
        type: 'geometry',
        geometry,
        format: 'stl',
        fileName,
        metadata: {
          vertexCount,
          faceCount,
          hasNormals: true,
          hasUVs: !!geometry.attributes.uv,
          hasMaterials: false,
          boundingBox,
        },
      });
    } catch (error) {
      reject(new Error(`Failed to load STL: ${error}`));
    }
  });
}

/**
 * Load 3DM file (Rhino)
 */
async function load3DM(
  buffer: ArrayBuffer,
  fileName: string,
  onProgress?: ProgressCallback
): Promise<LoadedModel> {
  onProgress?.({
    loaded: 0,
    total: buffer.byteLength,
    percentage: 0,
    status: 'Loading Rhino library...',
  });
  
  try {
    onProgress?.({
      loaded: buffer.byteLength * 0.3,
      total: buffer.byteLength,
      percentage: 30,
      status: 'Parsing 3DM...',
    });
    
    const rhinoDoc = await parse3DMFile(buffer, fileName);
    
    // Calculate metadata from rhino objects
    let vertexCount = 0;
    let faceCount = 0;
    let hasNormals = false;
    
    const boundingBox = new THREE.Box3();
    
    for (const obj of rhinoDoc.objects) {
      if (obj.geometry) {
        vertexCount += obj.geometry.attributes.position?.count || 0;
        faceCount += obj.geometry.index ? obj.geometry.index.count / 3 : (obj.geometry.attributes.position?.count || 0) / 3;
        hasNormals = hasNormals || !!obj.geometry.attributes.normal;
        
        obj.geometry.computeBoundingBox();
        if (obj.geometry.boundingBox) {
          boundingBox.union(obj.geometry.boundingBox);
        }
      }
    }
    
    onProgress?.({
      loaded: buffer.byteLength,
      total: buffer.byteLength,
      percentage: 100,
      status: 'Complete',
    });
    
    return {
      type: 'rhino',
      rhinoDoc,
      format: '3dm',
      fileName,
      metadata: {
        vertexCount,
        faceCount,
        hasNormals,
        hasUVs: false,
        hasMaterials: false,
        boundingBox,
      },
    };
  } catch (error) {
    throw new Error(`Failed to load 3DM: ${error}`);
  }
}

// ============================================
// MAIN LOADER
// ============================================

/**
 * Load a 3D model from file
 */
export async function loadModel(
  file: File,
  onProgress?: ProgressCallback
): Promise<LoadedModel> {
  const format = detectFormat(file.name);
  
  if (!format) {
    throw new Error(`Unsupported file format: ${file.name}`);
  }
  
  onProgress?.({
    loaded: 0,
    total: file.size,
    percentage: 0,
    status: 'Reading file...',
  });
  
  // Read file as ArrayBuffer
  const buffer = await file.arrayBuffer();
  
  onProgress?.({
    loaded: file.size * 0.1,
    total: file.size,
    percentage: 10,
    status: `Loading ${format.toUpperCase()}...`,
  });
  
  // Route to appropriate loader
  switch (format) {
    case 'gltf':
    case 'glb':
      return loadGLTF(buffer, file.name, onProgress);
    case 'fbx':
      return loadFBX(buffer, file.name, onProgress);
    case 'obj':
      return loadOBJ(buffer, file.name, onProgress);
    case 'stl':
      return loadSTL(buffer, file.name, onProgress);
    case '3dm':
      return load3DM(buffer, file.name, onProgress);
    default:
      throw new Error(`Loader not implemented for format: ${format}`);
  }
}

/**
 * Load a 3D model from URL
 */
export async function loadModelFromURL(
  url: string,
  onProgress?: ProgressCallback
): Promise<LoadedModel> {
  const fileName = url.split('/').pop() || 'model';
  const format = detectFormat(fileName);
  
  if (!format) {
    throw new Error(`Unsupported file format: ${fileName}`);
  }
  
  onProgress?.({
    loaded: 0,
    total: 0,
    percentage: 0,
    status: 'Fetching file...',
  });
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  
  const buffer = await response.arrayBuffer();
  
  switch (format) {
    case 'gltf':
    case 'glb':
      return loadGLTF(buffer, fileName, onProgress);
    case 'fbx':
      return loadFBX(buffer, fileName, onProgress);
    case 'obj':
      return loadOBJ(buffer, fileName, onProgress);
    case 'stl':
      return loadSTL(buffer, fileName, onProgress);
    case '3dm':
      return load3DM(buffer, fileName, onProgress);
    default:
      throw new Error(`Loader not implemented for format: ${format}`);
  }
}

// ============================================
// EXPORT
// ============================================

export default {
  loadModel,
  loadModelFromURL,
  detectFormat,
  getSupportedExtensions,
  getAcceptString,
  isSupported,
};

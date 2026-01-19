/**
 * Rhino3dm Loader Service
 * 
 * Handles loading and parsing of 3DM (Rhino) files using rhino3dm.js WASM library.
 * Provides layer extraction, geometry conversion, and metadata parsing.
 * 
 * NOTE: rhino3dm is loaded via script tag at runtime to avoid bundler issues
 * with Node.js built-in modules (fs, path, etc.)
 */

import * as THREE from 'three';

// ============================================
// TYPES
// ============================================

export interface RhinoLayer {
  id: string;
  index: number;
  name: string;
  color: string;
  visible: boolean;
  locked: boolean;
  parentId: string | null;
}

export interface RhinoObject {
  id: string;
  layerIndex: number;
  layerId: string;
  geometry: THREE.BufferGeometry;
  objectType: string;
  name: string;
  color: string | null;
}

export interface Rhino3dmDocument {
  layers: RhinoLayer[];
  objects: RhinoObject[];
  units: string;
  metadata: {
    fileName: string;
    created: string | null;
    notes: string | null;
  };
}

// ============================================
// RHINO3DM MODULE SINGLETON
// ============================================

let rhino3dmModule: any = null;
let loadingPromise: Promise<any> | null = null;

/**
 * Load rhino3dm via CDN script tag (avoids bundler issues with fs/path)
 */
async function loadRhino3dmFromCDN(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Check if already loaded globally
    if ((window as any).rhino3dm) {
      return resolve((window as any).rhino3dm);
    }
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/rhino3dm@8.9.0/rhino3dm.min.js';
    script.async = true;
    
    script.onload = () => {
      if ((window as any).rhino3dm) {
        resolve((window as any).rhino3dm);
      } else {
        reject(new Error('rhino3dm not found on window after script load'));
      }
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load rhino3dm from CDN'));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Initialize rhino3dm WASM module (lazy loading via CDN)
 * Only runs on client-side
 */
export async function initRhino3dm(): Promise<any> {
  // Check if we're on the server
  if (typeof window === 'undefined') {
    throw new Error('rhino3dm can only be loaded on the client side');
  }

  if (rhino3dmModule) {
    return rhino3dmModule;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      // Load via CDN script tag to avoid bundler issues
      console.log('[Rhino3dm] Loading from CDN...');
      const rhino3dm = await loadRhino3dmFromCDN();
      rhino3dmModule = await rhino3dm();
      console.log('[Rhino3dm] WASM module loaded successfully');
      return rhino3dmModule;
    } catch (error) {
      console.error('[Rhino3dm] Failed to load WASM module:', error);
      loadingPromise = null;
      throw error;
    }
  })();

  return loadingPromise;
}

/**
 * Check if rhino3dm is loaded
 */
export function isRhino3dmLoaded(): boolean {
  return rhino3dmModule !== null;
}

// ============================================
// COLOR UTILITIES
// ============================================

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (c: number) => {
    const hex = Math.max(0, Math.min(255, c)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ============================================
// GEOMETRY CONVERSION
// ============================================

/**
 * Convert Rhino mesh to Three.js BufferGeometry
 */
function rhinoMeshToBufferGeometry(rhinoMesh: any): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  
  // Get vertices
  const vertices = rhinoMesh.vertices();
  const vertexCount = vertices.count;
  const positions = new Float32Array(vertexCount * 3);
  
  for (let i = 0; i < vertexCount; i++) {
    const vertex = vertices.get(i);
    positions[i * 3] = vertex[0];
    positions[i * 3 + 1] = vertex[1];
    positions[i * 3 + 2] = vertex[2];
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  // Get faces
  const faces = rhinoMesh.faces();
  const faceCount = faces.count;
  const indices: number[] = [];
  
  for (let i = 0; i < faceCount; i++) {
    const face = faces.get(i);
    // Rhino faces can be triangles (3) or quads (4)
    if (face.length >= 3) {
      indices.push(face[0], face[1], face[2]);
      if (face.length === 4) {
        // Convert quad to two triangles
        indices.push(face[0], face[2], face[3]);
      }
    }
  }
  
  geometry.setIndex(indices);
  
  // Get normals if available
  const normals = rhinoMesh.normals();
  if (normals && normals.count > 0) {
    const normalArray = new Float32Array(vertexCount * 3);
    for (let i = 0; i < normals.count; i++) {
      const normal = normals.get(i);
      normalArray[i * 3] = normal[0];
      normalArray[i * 3 + 1] = normal[1];
      normalArray[i * 3 + 2] = normal[2];
    }
    geometry.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3));
  } else {
    geometry.computeVertexNormals();
  }
  
  return geometry;
}

/**
 * Convert Rhino Brep to mesh (tessellation)
 */
function rhinoBrepToMesh(brep: any, rhino: any): THREE.BufferGeometry | null {
  try {
    // Create mesh from Brep with tessellation parameters
    const meshParameters = new rhino.MeshingParameters();
    meshParameters.minEdgeLength = 0.01;
    meshParameters.maxEdgeLength = 10;
    meshParameters.gridAspectRatio = 0;
    meshParameters.gridMinCount = 16;
    meshParameters.refine = true;
    
    const meshes = rhino.Mesh.createFromBrep(brep, meshParameters);
    
    if (meshes && meshes.length > 0) {
      // If multiple meshes, merge them
      if (meshes.length === 1) {
        return rhinoMeshToBufferGeometry(meshes[0]);
      }
      
      // Merge multiple meshes
      const geometries: THREE.BufferGeometry[] = [];
      for (let i = 0; i < meshes.length; i++) {
        geometries.push(rhinoMeshToBufferGeometry(meshes[i]));
      }
      
      // Use BufferGeometryUtils to merge (or manual merge)
      const mergedGeometry = mergeBufferGeometries(geometries);
      return mergedGeometry;
    }
    
    return null;
  } catch (error) {
    console.warn('[Rhino3dm] Failed to convert Brep to mesh:', error);
    return null;
  }
}

/**
 * Simple buffer geometry merge utility
 */
function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry {
  if (geometries.length === 0) {
    return new THREE.BufferGeometry();
  }
  
  if (geometries.length === 1) {
    return geometries[0];
  }
  
  // Calculate total vertex count
  let totalVertices = 0;
  let totalIndices = 0;
  
  for (const geo of geometries) {
    const pos = geo.getAttribute('position');
    if (pos) {
      totalVertices += pos.count;
    }
    const idx = geo.getIndex();
    if (idx) {
      totalIndices += idx.count;
    }
  }
  
  const mergedPositions = new Float32Array(totalVertices * 3);
  const mergedNormals = new Float32Array(totalVertices * 3);
  const mergedIndices: number[] = [];
  
  let vertexOffset = 0;
  
  for (const geo of geometries) {
    const positions = geo.getAttribute('position') as THREE.BufferAttribute;
    const normals = geo.getAttribute('normal') as THREE.BufferAttribute;
    const indices = geo.getIndex();
    
    if (positions) {
      for (let i = 0; i < positions.count * 3; i++) {
        mergedPositions[vertexOffset * 3 + i] = positions.array[i];
      }
    }
    
    if (normals) {
      for (let i = 0; i < normals.count * 3; i++) {
        mergedNormals[vertexOffset * 3 + i] = normals.array[i];
      }
    }
    
    if (indices) {
      for (let i = 0; i < indices.count; i++) {
        mergedIndices.push(indices.array[i] + vertexOffset);
      }
    }
    
    if (positions) {
      vertexOffset += positions.count;
    }
  }
  
  const merged = new THREE.BufferGeometry();
  merged.setAttribute('position', new THREE.BufferAttribute(mergedPositions, 3));
  merged.setAttribute('normal', new THREE.BufferAttribute(mergedNormals, 3));
  merged.setIndex(mergedIndices);
  
  return merged;
}

// ============================================
// MAIN PARSE FUNCTION
// ============================================

/**
 * Parse a 3DM file and extract layers, objects, and metadata
 */
export async function parse3DMFile(buffer: ArrayBuffer, fileName: string = 'model.3dm'): Promise<Rhino3dmDocument> {
  console.log(`[Rhino3dm] Starting to parse: ${fileName} (${(buffer.byteLength / 1024).toFixed(1)} KB)`);
  
  const rhino = await initRhino3dm();
  
  if (!rhino) {
    throw new Error('rhino3dm module not loaded');
  }
  
  // Parse the file
  const uint8Array = new Uint8Array(buffer);
  console.log('[Rhino3dm] Calling File3dm.fromByteArray...');
  
  let doc;
  try {
    doc = rhino.File3dm.fromByteArray(uint8Array);
  } catch (parseError) {
    console.error('[Rhino3dm] Parse error:', parseError);
    throw new Error(`Failed to parse 3DM file: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
  }
  
  if (!doc) {
    throw new Error('Failed to parse 3DM file. The file may be corrupted, in an unsupported Rhino version, or not a valid 3DM file.');
  }
  
  console.log('[Rhino3dm] Document parsed successfully');
  
  // Extract layers
  const layers: RhinoLayer[] = [];
  const layerTable = doc.layers();
  
  for (let i = 0; i < layerTable.count; i++) {
    const layer = layerTable.get(i);
    const color = layer.color;
    
    layers.push({
      id: layer.id || `layer-${i}`,
      index: i,
      name: layer.name || `Layer ${i}`,
      color: rgbToHex(color.r, color.g, color.b),
      visible: layer.visible,
      locked: layer.locked,
      parentId: layer.parentLayerId || null,
    });
  }
  
  console.log(`[Rhino3dm] Extracted ${layers.length} layers`);
  
  // Extract objects
  const objects: RhinoObject[] = [];
  const objectTable = doc.objects();
  const totalObjects = objectTable.count;
  
  console.log(`[Rhino3dm] Processing ${totalObjects} objects...`);
  
  let skippedCount = 0;
  let errorCount = 0;
  
  for (let i = 0; i < totalObjects; i++) {
    try {
      const obj = objectTable.get(i);
      if (!obj) {
        console.warn(`[Rhino3dm] Object ${i} is null`);
        skippedCount++;
        continue;
      }
      
      const attributes = obj.attributes();
      const geometry = obj.geometry();
      
      if (!geometry) {
        console.log(`[Rhino3dm] Object ${i} has no geometry`);
        skippedCount++;
        continue;
      }
      
      let bufferGeometry: THREE.BufferGeometry | null = null;
      const geometryType = geometry.objectType;
      
      // Log geometry type for debugging
      console.log(`[Rhino3dm] Object ${i}: type=${geometryType}`);
      
      // Convert based on geometry type
      // ObjectType enum values: https://mcneel.github.io/rhino3dm/javascript/api/ObjectType.html
      try {
        if (geometryType === rhino.ObjectType.Mesh || geometryType === 32) {
          bufferGeometry = rhinoMeshToBufferGeometry(geometry);
        } else if (geometryType === rhino.ObjectType.Brep || geometryType === 16) {
          bufferGeometry = rhinoBrepToMesh(geometry, rhino);
        } else if (geometryType === rhino.ObjectType.Extrusion || geometryType === 1073741824) {
          bufferGeometry = rhinoBrepToMesh(geometry, rhino);
        } else if (geometryType === rhino.ObjectType.SubD || geometryType === 8388608) {
          // SubD needs to be converted to mesh first
          const subdMesh = geometry.toMesh(rhino.MeshType.Any);
          if (subdMesh) {
            bufferGeometry = rhinoMeshToBufferGeometry(subdMesh);
          }
        } else if (geometryType === rhino.ObjectType.Surface || geometryType === 8) {
          // Try to convert surface to brep then mesh
          try {
            const brep = geometry.toBrep();
            if (brep) {
              bufferGeometry = rhinoBrepToMesh(brep, rhino);
            }
          } catch (e) {
            console.log(`[Rhino3dm] Could not convert Surface to mesh`);
          }
        } else if (geometryType === rhino.ObjectType.PolysrfFilter || geometryType === 16) {
          bufferGeometry = rhinoBrepToMesh(geometry, rhino);
        } else {
          // Skip non-mesh geometry types (curves, points, annotations, etc.)
          console.log(`[Rhino3dm] Skipping geometry type: ${geometryType} (not meshable)`);
          skippedCount++;
          continue;
        }
      } catch (conversionError) {
        console.warn(`[Rhino3dm] Failed to convert object ${i}:`, conversionError);
        errorCount++;
        continue;
      }
      
      if (bufferGeometry) {
        const layerIndex = attributes.layerIndex;
        const layer = layers[layerIndex] || layers[0];
        
        // Get object color (from attributes or layer)
        let objColor: string | null = null;
        try {
          const colorSource = attributes.colorSource;
          if (colorSource === rhino.ObjectColorSource.ColorFromObject) {
            const c = attributes.objectColor;
            objColor = rgbToHex(c.r, c.g, c.b);
          }
        } catch (e) {
          // Use layer color as fallback
        }
        
        objects.push({
          id: attributes.id || `object-${i}`,
          layerIndex,
          layerId: layer.id,
          geometry: bufferGeometry,
          objectType: geometryType.toString(),
          name: attributes.name || `Object ${i}`,
          color: objColor,
        });
        
        console.log(`[Rhino3dm] Object ${i} converted successfully (${bufferGeometry.getAttribute('position')?.count || 0} vertices)`);
      } else {
        console.warn(`[Rhino3dm] Object ${i}: conversion returned null geometry`);
        errorCount++;
      }
    } catch (objError) {
      console.error(`[Rhino3dm] Error processing object ${i}:`, objError);
      errorCount++;
    }
  }
  
  console.log(`[Rhino3dm] Extracted ${objects.length} objects (skipped: ${skippedCount}, errors: ${errorCount})`);
  
  // Warn if no objects were extracted
  if (objects.length === 0 && totalObjects > 0) {
    console.warn('[Rhino3dm] WARNING: No meshable objects found in file. The file may contain only curves, points, or other non-mesh geometry.');
  }
  
  // Get document metadata
  const settings = doc.settings();
  let units = 'mm';
  
  try {
    const unitSystem = settings.modelUnitSystem;
    switch (unitSystem) {
      case 0: units = 'none'; break;
      case 1: units = 'microns'; break;
      case 2: units = 'mm'; break;
      case 3: units = 'cm'; break;
      case 4: units = 'm'; break;
      case 5: units = 'km'; break;
      case 6: units = 'microinches'; break;
      case 7: units = 'mils'; break;
      case 8: units = 'inches'; break;
      case 9: units = 'feet'; break;
      case 10: units = 'miles'; break;
    }
  } catch (e) {
    // Default to mm
  }
  
  // Cleanup
  doc.delete();
  
  return {
    layers,
    objects,
    units,
    metadata: {
      fileName,
      created: null,
      notes: null,
    },
  };
}

/**
 * Get supported file extensions
 */
export function getSupportedExtensions(): string[] {
  return ['.3dm'];
}

/**
 * Check if a file is a valid 3DM file by extension
 */
export function is3DMFile(fileName: string): boolean {
  return fileName.toLowerCase().endsWith('.3dm');
}

export default {
  initRhino3dm,
  isRhino3dmLoaded,
  parse3DMFile,
  getSupportedExtensions,
  is3DMFile,
};

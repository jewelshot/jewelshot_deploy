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
  console.log('[Rhino3dm] loadRhino3dmFromCDN called');
  
  return new Promise((resolve, reject) => {
    // Check if already loaded globally
    if ((window as any).rhino3dm) {
      console.log('[Rhino3dm] Already loaded globally');
      return resolve((window as any).rhino3dm);
    }
    
    // Check if script is already in DOM
    const existingScript = document.querySelector('script[src*="rhino3dm"]');
    if (existingScript) {
      console.log('[Rhino3dm] Script tag already exists, waiting for load...');
      // Wait a bit for it to load
      const checkInterval = setInterval(() => {
        if ((window as any).rhino3dm) {
          clearInterval(checkInterval);
          resolve((window as any).rhino3dm);
        }
      }, 100);
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!(window as any).rhino3dm) {
          reject(new Error('Timeout waiting for existing rhino3dm script'));
        }
      }, 10000);
      return;
    }
    
    console.log('[Rhino3dm] Creating script tag for CDN...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/rhino3dm@8.9.0/rhino3dm.min.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    
    script.onload = () => {
      console.log('[Rhino3dm] Script loaded from CDN');
      if ((window as any).rhino3dm) {
        console.log('[Rhino3dm] rhino3dm found on window');
        resolve((window as any).rhino3dm);
      } else {
        console.error('[Rhino3dm] Script loaded but rhino3dm not on window');
        reject(new Error('rhino3dm not found on window after script load'));
      }
    };
    
    script.onerror = (error) => {
      console.error('[Rhino3dm] Failed to load script from CDN:', error);
      reject(new Error('Failed to load rhino3dm from CDN. Check your internet connection and CSP settings.'));
    };
    
    document.head.appendChild(script);
    console.log('[Rhino3dm] Script tag added to document head');
  });
}

/**
 * Initialize rhino3dm WASM module (lazy loading via CDN)
 * Only runs on client-side
 */
export async function initRhino3dm(): Promise<any> {
  console.log('[Rhino3dm] initRhino3dm called');
  
  // Check if we're on the server
  if (typeof window === 'undefined') {
    console.error('[Rhino3dm] Cannot load on server side');
    throw new Error('rhino3dm can only be loaded on the client side');
  }

  if (rhino3dmModule) {
    console.log('[Rhino3dm] Returning cached module');
    return rhino3dmModule;
  }

  if (loadingPromise) {
    console.log('[Rhino3dm] Returning existing loading promise');
    return loadingPromise;
  }

  console.log('[Rhino3dm] Starting new load sequence...');
  
  loadingPromise = (async () => {
    try {
      // Load via CDN script tag to avoid bundler issues
      console.log('[Rhino3dm] Step 1: Loading script from CDN...');
      const rhino3dm = await loadRhino3dmFromCDN();
      
      console.log('[Rhino3dm] Step 2: Initializing WASM module...');
      console.log('[Rhino3dm] rhino3dm type:', typeof rhino3dm);
      
      // rhino3dm is a function that returns a promise
      if (typeof rhino3dm === 'function') {
        rhino3dmModule = await rhino3dm();
      } else if (rhino3dm && typeof rhino3dm.then === 'function') {
        rhino3dmModule = await rhino3dm;
      } else {
        rhino3dmModule = rhino3dm;
      }
      
      console.log('[Rhino3dm] WASM module loaded successfully');
      console.log('[Rhino3dm] Module keys:', Object.keys(rhino3dmModule || {}).slice(0, 10));
      
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
  
  try {
    // Get vertices - try multiple approaches
    let vertices: any = null;
    let vertexCount = 0;
    
    // Approach 1: vertices() method
    if (typeof rhinoMesh.vertices === 'function') {
      vertices = rhinoMesh.vertices();
      vertexCount = vertices?.count || 0;
    }
    
    // Approach 2: Try getVertices
    if (vertexCount === 0 && typeof rhinoMesh.getVertices === 'function') {
      vertices = rhinoMesh.getVertices();
      vertexCount = vertices?.length || 0;
    }
    
    if (vertexCount === 0) {
      console.warn('[Rhino3dm] rhinoMeshToBufferGeometry: No vertices found');
      return geometry;
    }
    
    console.log(`[Rhino3dm] rhinoMeshToBufferGeometry: Found ${vertexCount} vertices`);
    
    const positions = new Float32Array(vertexCount * 3);
    
    for (let i = 0; i < vertexCount; i++) {
      let vertex;
      if (typeof vertices.get === 'function') {
        vertex = vertices.get(i);
      } else if (Array.isArray(vertices)) {
        vertex = vertices[i];
      } else {
        continue;
      }
      
      if (vertex) {
        // Handle both array and object formats
        if (Array.isArray(vertex)) {
          positions[i * 3] = vertex[0] || 0;
          positions[i * 3 + 1] = vertex[1] || 0;
          positions[i * 3 + 2] = vertex[2] || 0;
        } else if (typeof vertex === 'object') {
          positions[i * 3] = vertex.x ?? vertex[0] ?? 0;
          positions[i * 3 + 1] = vertex.y ?? vertex[1] ?? 0;
          positions[i * 3 + 2] = vertex.z ?? vertex[2] ?? 0;
        }
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Get faces - try multiple approaches
    let faces: any = null;
    let faceCount = 0;
    
    if (typeof rhinoMesh.faces === 'function') {
      faces = rhinoMesh.faces();
      faceCount = faces?.count || 0;
    }
    
    if (faceCount === 0 && typeof rhinoMesh.getFaces === 'function') {
      faces = rhinoMesh.getFaces();
      faceCount = faces?.length || 0;
    }
    
    console.log(`[Rhino3dm] rhinoMeshToBufferGeometry: Found ${faceCount} faces`);
    
    const indices: number[] = [];
    
    for (let i = 0; i < faceCount; i++) {
      let face;
      if (typeof faces.get === 'function') {
        face = faces.get(i);
      } else if (Array.isArray(faces)) {
        face = faces[i];
      } else {
        continue;
      }
      
      if (face) {
        // Rhino faces can be triangles (3) or quads (4)
        const faceLength = face.length || 4; // Default quad
        if (faceLength >= 3) {
          indices.push(face[0], face[1], face[2]);
          if (faceLength === 4 && face[3] !== face[2]) {
            // Convert quad to two triangles
            indices.push(face[0], face[2], face[3]);
          }
        }
      }
    }
    
    if (indices.length > 0) {
      geometry.setIndex(indices);
    }
    
    // Get normals if available
    try {
      let normals: any = null;
      if (typeof rhinoMesh.normals === 'function') {
        normals = rhinoMesh.normals();
      }
      
      if (normals && normals.count > 0) {
        const normalArray = new Float32Array(vertexCount * 3);
        for (let i = 0; i < Math.min(normals.count, vertexCount); i++) {
          const normal = typeof normals.get === 'function' ? normals.get(i) : normals[i];
          if (normal) {
            if (Array.isArray(normal)) {
              normalArray[i * 3] = normal[0] || 0;
              normalArray[i * 3 + 1] = normal[1] || 0;
              normalArray[i * 3 + 2] = normal[2] || 0;
            } else {
              normalArray[i * 3] = normal.x ?? normal[0] ?? 0;
              normalArray[i * 3 + 1] = normal.y ?? normal[1] ?? 0;
              normalArray[i * 3 + 2] = normal.z ?? normal[2] ?? 0;
            }
          }
        }
        geometry.setAttribute('normal', new THREE.BufferAttribute(normalArray, 3));
      } else {
        geometry.computeVertexNormals();
      }
    } catch (e) {
      console.log('[Rhino3dm] rhinoMeshToBufferGeometry: Computing normals instead');
      geometry.computeVertexNormals();
    }
    
    console.log(`[Rhino3dm] rhinoMeshToBufferGeometry: Complete - ${positions.length / 3} vertices, ${indices.length / 3} triangles`);
    
  } catch (error) {
    console.error('[Rhino3dm] rhinoMeshToBufferGeometry error:', error);
  }
  
  return geometry;
}

/**
 * Tessellation quality levels
 * 0.25 = Low quality (fast, fewer polygons)
 * 1.0 = Medium quality (balanced)
 * 5.0 = High quality (slow, more polygons)
 */
export type TessellationQuality = number;

// Current tessellation quality (can be changed dynamically)
let currentTessellationQuality: TessellationQuality = 1.0;

export function setTessellationQuality(quality: TessellationQuality): void {
  currentTessellationQuality = Math.max(0.1, Math.min(10, quality));
  console.log(`[Rhino3dm] Tessellation quality set to: ${currentTessellationQuality}`);
}

export function getTessellationQuality(): TessellationQuality {
  return currentTessellationQuality;
}

/**
 * Convert Rhino Brep to mesh (tessellation)
 * @param brep - Rhino Brep geometry
 * @param rhino - Rhino3dm module
 * @param quality - Optional quality override (0.1 to 10, default uses global setting)
 */
function rhinoBrepToMesh(brep: any, rhino: any, quality?: number): THREE.BufferGeometry | null {
  const tessQuality = quality ?? currentTessellationQuality;
  
  try {
    console.log(`[Rhino3dm] rhinoBrepToMesh: Starting conversion (quality: ${tessQuality})...`);
    
    // Try multiple meshing approaches
    let meshes: any = null;
    
    // Calculate meshing parameters based on quality
    // Higher quality = smaller edge lengths, more grid cells
    const minEdge = 0.001 / tessQuality;  // Smaller for jewelry
    const maxEdge = 1 / tessQuality;       // Smaller for jewelry
    const gridMin = Math.round(16 * tessQuality); // More grid cells
    
    console.log(`[Rhino3dm] Meshing params: minEdge=${minEdge}, maxEdge=${maxEdge}, gridMin=${gridMin}`);
    
    // Approach 1: Try to get existing render mesh from brep first (fastest)
    try {
      if (typeof brep.getRenderMesh === 'function') {
        console.log('[Rhino3dm] rhinoBrepToMesh: Trying brep.getRenderMesh()...');
        const mesh = brep.getRenderMesh(rhino.MeshType?.Render ?? 1, true);
        if (mesh) {
          meshes = [mesh];
        }
      }
    } catch (e) {
      console.log('[Rhino3dm] rhinoBrepToMesh: getRenderMesh failed:', e);
    }
    
    // Approach 2: Try getMesh with different types
    if (!meshes || meshes.length === 0) {
      try {
        if (typeof brep.getMesh === 'function') {
          console.log('[Rhino3dm] rhinoBrepToMesh: Trying brep.getMesh()...');
          // Try render mesh first, then any
          for (const meshType of [rhino.MeshType?.Render, rhino.MeshType?.Analysis, rhino.MeshType?.Any, 1, 2, 0]) {
            if (meshType !== undefined) {
              try {
                const mesh = brep.getMesh(meshType);
                if (mesh) {
                  meshes = [mesh];
                  console.log(`[Rhino3dm] rhinoBrepToMesh: getMesh(${meshType}) succeeded`);
                  break;
                }
              } catch (e) {
                // Try next type
              }
            }
          }
        }
      } catch (e) {
        console.log('[Rhino3dm] rhinoBrepToMesh: getMesh approach failed:', e);
      }
    }
    
    // Approach 3: Use MeshingParameters with quality-based settings
    if (!meshes || meshes.length === 0) {
      try {
        if (rhino.MeshingParameters) {
          const meshParameters = new rhino.MeshingParameters();
          meshParameters.minEdgeLength = minEdge;
          meshParameters.maxEdgeLength = maxEdge;
          meshParameters.gridAspectRatio = 0;
          meshParameters.gridMinCount = gridMin;
          meshParameters.refine = true;
          meshParameters.jaggedSeams = false;
          meshParameters.simplePlanes = true;
          
          console.log('[Rhino3dm] rhinoBrepToMesh: Trying createFromBrep with MeshingParameters...');
          meshes = rhino.Mesh.createFromBrep(brep, meshParameters);
        }
      } catch (e) {
        console.log('[Rhino3dm] rhinoBrepToMesh: MeshingParameters approach failed:', e);
      }
    }
    
    // Approach 4: Try without parameters
    if (!meshes || meshes.length === 0) {
      try {
        console.log('[Rhino3dm] rhinoBrepToMesh: Trying createFromBrep without parameters...');
        meshes = rhino.Mesh.createFromBrep(brep);
      } catch (e) {
        console.log('[Rhino3dm] rhinoBrepToMesh: No-params approach failed:', e);
      }
    }
    
    // Approach 5: Try default meshing parameters
    if (!meshes || meshes.length === 0) {
      try {
        if (rhino.MeshingParameters?.Default) {
          console.log('[Rhino3dm] rhinoBrepToMesh: Trying with Default MeshingParameters...');
          meshes = rhino.Mesh.createFromBrep(brep, rhino.MeshingParameters.Default);
        }
      } catch (e) {
        console.log('[Rhino3dm] rhinoBrepToMesh: Default params approach failed:', e);
      }
    }
    
    // Approach 6: Try FastRenderMesh
    if (!meshes || meshes.length === 0) {
      try {
        if (rhino.MeshingParameters?.FastRenderMesh) {
          console.log('[Rhino3dm] rhinoBrepToMesh: Trying with FastRenderMesh...');
          meshes = rhino.Mesh.createFromBrep(brep, rhino.MeshingParameters.FastRenderMesh);
        }
      } catch (e) {
        console.log('[Rhino3dm] rhinoBrepToMesh: FastRenderMesh approach failed:', e);
      }
    }
    
    // Approach 7: Try QualityRenderMesh for higher quality
    if (!meshes || meshes.length === 0) {
      try {
        if (rhino.MeshingParameters?.QualityRenderMesh) {
          console.log('[Rhino3dm] rhinoBrepToMesh: Trying with QualityRenderMesh...');
          meshes = rhino.Mesh.createFromBrep(brep, rhino.MeshingParameters.QualityRenderMesh);
        }
      } catch (e) {
        console.log('[Rhino3dm] rhinoBrepToMesh: QualityRenderMesh approach failed:', e);
      }
    }
    
    // Approach 8: Try creating mesh from faces individually
    if (!meshes || meshes.length === 0) {
      try {
        if (typeof brep.faces === 'function') {
          const faces = brep.faces();
          if (faces && faces.count > 0) {
            console.log(`[Rhino3dm] rhinoBrepToMesh: Trying individual face meshing (${faces.count} faces)...`);
            meshes = [];
            for (let i = 0; i < faces.count; i++) {
              try {
                const face = faces.get(i);
                if (face) {
                  // Try to get mesh from face
                  if (typeof face.getMesh === 'function') {
                    const faceMesh = face.getMesh(rhino.MeshType?.Render ?? 1);
                    if (faceMesh) {
                      meshes.push(faceMesh);
                    }
                  }
                }
              } catch (e) {
                // Skip this face
              }
            }
            if (meshes.length > 0) {
              console.log(`[Rhino3dm] rhinoBrepToMesh: Got ${meshes.length} face meshes`);
            }
          }
        }
      } catch (e) {
        console.log('[Rhino3dm] rhinoBrepToMesh: Face meshing approach failed:', e);
      }
    }
    
    if (meshes && meshes.length > 0) {
      console.log(`[Rhino3dm] rhinoBrepToMesh: Got ${meshes.length} mesh(es)`);
      
      // If multiple meshes, merge them
      if (meshes.length === 1) {
        const geo = rhinoMeshToBufferGeometry(meshes[0]);
        console.log(`[Rhino3dm] rhinoBrepToMesh: Single mesh converted, ${geo?.getAttribute('position')?.count || 0} vertices`);
        return geo;
      }
      
      // Merge multiple meshes
      const geometries: THREE.BufferGeometry[] = [];
      for (let i = 0; i < meshes.length; i++) {
        const geo = rhinoMeshToBufferGeometry(meshes[i]);
        if (geo && geo.getAttribute('position')?.count > 0) {
          geometries.push(geo);
        }
      }
      
      if (geometries.length === 0) {
        console.warn('[Rhino3dm] rhinoBrepToMesh: All mesh conversions returned empty geometry');
        return null;
      }
      
      // Use BufferGeometryUtils to merge (or manual merge)
      const mergedGeometry = mergeBufferGeometries(geometries);
      console.log(`[Rhino3dm] rhinoBrepToMesh: Merged ${geometries.length} meshes, ${mergedGeometry?.getAttribute('position')?.count || 0} vertices`);
      return mergedGeometry;
    }
    
    console.warn('[Rhino3dm] rhinoBrepToMesh: No meshes generated from Brep');
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
 * Try to convert any geometry to mesh using all available methods
 */
function tryConvertToMesh(geometry: any, rhino: any, objectIndex: number): THREE.BufferGeometry | null {
  const geometryTypeName = geometry.constructor?.name || 'Unknown';
  
  // Method 1: Direct mesh
  if (geometryTypeName === 'Mesh' || geometry.objectType === rhino.ObjectType?.Mesh) {
    console.log(`[Rhino3dm] Object ${objectIndex}: Direct Mesh conversion`);
    return rhinoMeshToBufferGeometry(geometry);
  }
  
  // Method 2: getRenderMesh - works for many geometry types
  if (typeof geometry.getRenderMesh === 'function') {
    try {
      console.log(`[Rhino3dm] Object ${objectIndex}: Trying getRenderMesh()`);
      const renderMesh = geometry.getRenderMesh(rhino.MeshType?.Render ?? rhino.MeshType?.Any ?? 1, true);
      if (renderMesh) {
        const geo = rhinoMeshToBufferGeometry(renderMesh);
        if (geo && (geo.getAttribute('position')?.count || 0) > 0) {
          console.log(`[Rhino3dm] Object ${objectIndex}: getRenderMesh succeeded`);
          return geo;
        }
      }
    } catch (e) {
      console.log(`[Rhino3dm] Object ${objectIndex}: getRenderMesh failed:`, e);
    }
  }
  
  // Method 3: toMesh - SubD, Extrusion, etc.
  if (typeof geometry.toMesh === 'function') {
    try {
      console.log(`[Rhino3dm] Object ${objectIndex}: Trying toMesh()`);
      const mesh = geometry.toMesh(rhino.MeshType?.Any ?? 0);
      if (mesh) {
        const geo = rhinoMeshToBufferGeometry(mesh);
        if (geo && (geo.getAttribute('position')?.count || 0) > 0) {
          console.log(`[Rhino3dm] Object ${objectIndex}: toMesh succeeded`);
          return geo;
        }
      }
    } catch (e) {
      console.log(`[Rhino3dm] Object ${objectIndex}: toMesh failed:`, e);
    }
  }
  
  // Method 4: Brep conversion with multiple parameter sets
  if (geometryTypeName === 'Brep' || geometry.objectType === rhino.ObjectType?.Brep) {
    console.log(`[Rhino3dm] Object ${objectIndex}: Brep - trying multiple meshing strategies`);
    const geo = rhinoBrepToMesh(geometry, rhino);
    if (geo && (geo.getAttribute('position')?.count || 0) > 0) {
      return geo;
    }
  }
  
  // Method 5: Extrusion -> Brep -> Mesh
  if (geometryTypeName === 'Extrusion' || geometry.objectType === rhino.ObjectType?.Extrusion) {
    try {
      console.log(`[Rhino3dm] Object ${objectIndex}: Extrusion.toBrep()`);
      const brep = geometry.toBrep(true);
      if (brep) {
        const geo = rhinoBrepToMesh(brep, rhino);
        if (geo && (geo.getAttribute('position')?.count || 0) > 0) {
          return geo;
        }
      }
    } catch (e) {
      console.log(`[Rhino3dm] Object ${objectIndex}: Extrusion.toBrep failed:`, e);
    }
  }
  
  // Method 6: Surface -> Brep -> Mesh
  if (geometryTypeName === 'Surface' || geometryTypeName === 'NurbsSurface' || 
      geometry.objectType === rhino.ObjectType?.Surface) {
    try {
      console.log(`[Rhino3dm] Object ${objectIndex}: Surface.toBrep()`);
      const brep = geometry.toBrep();
      if (brep) {
        const geo = rhinoBrepToMesh(brep, rhino);
        if (geo && (geo.getAttribute('position')?.count || 0) > 0) {
          return geo;
        }
      }
    } catch (e) {
      console.log(`[Rhino3dm] Object ${objectIndex}: Surface.toBrep failed:`, e);
    }
  }
  
  // Method 7: SubD special handling
  if (geometryTypeName === 'SubD' || geometry.objectType === rhino.ObjectType?.SubD) {
    try {
      console.log(`[Rhino3dm] Object ${objectIndex}: SubD.toMesh()`);
      // Try different subdivision levels
      for (const level of [0, 1, 2]) {
        try {
          const mesh = geometry.toMesh(level);
          if (mesh) {
            const geo = rhinoMeshToBufferGeometry(mesh);
            if (geo && (geo.getAttribute('position')?.count || 0) > 0) {
              return geo;
            }
          }
        } catch (e) {
          // Try next level
        }
      }
    } catch (e) {
      console.log(`[Rhino3dm] Object ${objectIndex}: SubD.toMesh failed:`, e);
    }
  }
  
  // Method 8: Generic toBrep fallback
  if (typeof geometry.toBrep === 'function' && geometryTypeName !== 'Brep') {
    try {
      console.log(`[Rhino3dm] Object ${objectIndex}: Generic toBrep()`);
      const brep = geometry.toBrep();
      if (brep) {
        const geo = rhinoBrepToMesh(brep, rhino);
        if (geo && (geo.getAttribute('position')?.count || 0) > 0) {
          return geo;
        }
      }
    } catch (e) {
      console.log(`[Rhino3dm] Object ${objectIndex}: Generic toBrep failed:`, e);
    }
  }
  
  return null;
}

/**
 * Parse a 3DM file and extract layers, objects, and metadata
 */
/**
 * Parse a 3DM file with optional tessellation quality
 * @param buffer - File buffer
 * @param fileName - File name for logging
 * @param quality - Tessellation quality (0.1-10, default 1.0)
 */
export async function parse3DMFile(
  buffer: ArrayBuffer, 
  fileName: string = 'model.3dm',
  quality?: TessellationQuality
): Promise<Rhino3dmDocument> {
  // Set quality for this parse operation
  if (quality !== undefined) {
    setTessellationQuality(quality);
  }
  
  console.log(`[Rhino3dm] Starting to parse: ${fileName} (${(buffer.byteLength / 1024).toFixed(1)} KB, quality: ${getTessellationQuality()})`);
  
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
  
  // Extract instance definitions (blocks) for InstanceReference expansion
  const instanceDefinitions: Map<string, any[]> = new Map();
  try {
    const idefTable = doc.instanceDefinitions?.() || null;
    if (idefTable) {
      console.log(`[Rhino3dm] Found ${idefTable.count || 0} instance definitions`);
      for (let i = 0; i < (idefTable.count || 0); i++) {
        try {
          const idef = idefTable.get(i);
          if (idef) {
            const id = idef.id || `idef-${i}`;
            const geometry = idef.getObjects?.() || [];
            console.log(`[Rhino3dm] InstanceDefinition ${i}: id=${id}, objectCount=${geometry.length}`);
            instanceDefinitions.set(id, geometry);
          }
        } catch (e) {
          console.warn(`[Rhino3dm] Failed to get instance definition ${i}:`, e);
        }
      }
    }
  } catch (e) {
    console.log('[Rhino3dm] No instance definitions table or failed to read:', e);
  }
  
  // Extract objects
  const objects: RhinoObject[] = [];
  const objectTable = doc.objects();
  const totalObjects = objectTable.count;
  
  console.log(`[Rhino3dm] Processing ${totalObjects} objects...`);
  
  // Log available ObjectType values for debugging
  console.log('[Rhino3dm] Available ObjectType values:', {
    Mesh: rhino.ObjectType?.Mesh,
    Brep: rhino.ObjectType?.Brep,
    Extrusion: rhino.ObjectType?.Extrusion,
    SubD: rhino.ObjectType?.SubD,
    Surface: rhino.ObjectType?.Surface,
    Curve: rhino.ObjectType?.Curve,
    Point: rhino.ObjectType?.Point,
    InstanceReference: rhino.ObjectType?.InstanceReference,
  });
  
  let skippedCount = 0;
  let errorCount = 0;
  const geometryTypesFound: Record<string, number> = {};
  
  // Helper to add object to results
  const addObject = (
    bufferGeometry: THREE.BufferGeometry,
    attributes: any,
    geometryTypeName: string,
    objectIndex: number,
    transform?: any
  ) => {
    const vertexCount = bufferGeometry.getAttribute('position')?.count || 0;
    if (vertexCount === 0) {
      console.warn(`[Rhino3dm] Object ${objectIndex}: Geometry has 0 vertices`);
      return false;
    }
    
    // Apply transform if provided (for InstanceReferences)
    if (transform) {
      try {
        const matrix = new THREE.Matrix4();
        // rhino3dm transform is a 4x4 matrix in column-major order
        if (transform.toFloatArray) {
          const arr = transform.toFloatArray(true); // true = column major
          if (arr && arr.length === 16) {
            matrix.fromArray(arr);
            bufferGeometry.applyMatrix4(matrix);
          }
        }
      } catch (e) {
        console.warn(`[Rhino3dm] Object ${objectIndex}: Failed to apply transform:`, e);
      }
    }
    
    const layerIndex = attributes.layerIndex;
    const layer = layers[layerIndex] || layers[0];
    
    // Get object color (from attributes or layer)
    let objColor: string | null = null;
    try {
      const colorSource = attributes.colorSource;
      if (colorSource === rhino.ObjectColorSource?.ColorFromObject) {
        const c = attributes.objectColor;
        objColor = rgbToHex(c.r, c.g, c.b);
      }
    } catch (e) {
      // Use layer color as fallback
    }
    
    objects.push({
      id: attributes.id || `object-${objectIndex}`,
      layerIndex,
      layerId: layer.id,
      geometry: bufferGeometry,
      objectType: geometryTypeName,
      name: attributes.name || `Object ${objectIndex}`,
      color: objColor,
    });
    
    console.log(`[Rhino3dm] Object ${objectIndex} converted successfully (${vertexCount} vertices)`);
    return true;
  };

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
      
      const geometryType = geometry.objectType;
      const geometryTypeName = geometry.constructor?.name || 'Unknown';
      
      // Track geometry types found
      const typeKey = `${geometryType} (${geometryTypeName})`;
      geometryTypesFound[typeKey] = (geometryTypesFound[typeKey] || 0) + 1;
      
      // Log geometry type for debugging
      console.log(`[Rhino3dm] Object ${i}: type=${geometryType}, typeName=${geometryTypeName}`);
      
      // Special handling for InstanceReference (Block instances)
      if (geometryTypeName === 'InstanceReference' || geometryType === rhino.ObjectType?.InstanceReference) {
        console.log(`[Rhino3dm] Object ${i}: InstanceReference detected`);
        
        let instanceConverted = false;
        
        // Get the transform for this instance
        let instanceTransform = null;
        try {
          instanceTransform = geometry.xform || geometry.transform;
        } catch (e) {
          console.log(`[Rhino3dm] Object ${i}: No transform available`);
        }
        
        // Try to get the parent definition ID
        try {
          const parentIdefId = geometry.parentIdefId;
          console.log(`[Rhino3dm] Object ${i}: InstanceReference parentIdefId=${parentIdefId}`);
          
          // Look up in our instance definitions map
          if (parentIdefId && instanceDefinitions.has(parentIdefId)) {
            const defObjects = instanceDefinitions.get(parentIdefId)!;
            console.log(`[Rhino3dm] Object ${i}: Found ${defObjects.length} objects in definition`);
            
            for (let j = 0; j < defObjects.length; j++) {
              const defObj = defObjects[j];
              if (defObj) {
                const defGeom = defObj.geometry?.() || defObj;
                if (defGeom) {
                  const bufferGeometry = tryConvertToMesh(defGeom, rhino, i);
                  if (bufferGeometry && addObject(bufferGeometry, attributes, geometryTypeName, i, instanceTransform)) {
                    instanceConverted = true;
                  }
                }
              }
            }
          }
        } catch (e) {
          console.warn(`[Rhino3dm] Object ${i}: Failed to expand InstanceReference:`, e);
        }
        
        if (!instanceConverted) {
          console.log(`[Rhino3dm] Object ${i}: InstanceReference couldn't be expanded - this is a limitation of rhino3dm WASM`);
          skippedCount++;
        }
        continue;
      }
      
      // Try to convert geometry using our comprehensive method
      try {
        const bufferGeometry = tryConvertToMesh(geometry, rhino, i);
        
        if (bufferGeometry) {
          if (!addObject(bufferGeometry, attributes, geometryTypeName, i)) {
            errorCount++;
          }
        } else {
          // Check if it's a non-meshable type
          const nonMeshableTypes = ['Curve', 'Point', 'PointCloud', 'TextDot', 'Annotation', 'Hatch', 'Light'];
          const isNonMeshable = nonMeshableTypes.some(t => geometryTypeName.includes(t));
          
          if (isNonMeshable) {
            console.log(`[Rhino3dm] Object ${i}: Skipping non-meshable type: ${geometryTypeName}`);
            skippedCount++;
          } else {
            console.warn(`[Rhino3dm] Object ${i}: All conversion methods failed for ${geometryTypeName}`);
            errorCount++;
          }
        }
      } catch (conversionError) {
        console.warn(`[Rhino3dm] Failed to convert object ${i}:`, conversionError);
        errorCount++;
      }
    } catch (objError) {
      console.error(`[Rhino3dm] Error processing object ${i}:`, objError);
      errorCount++;
    }
  }
  
  console.log(`[Rhino3dm] Geometry types found:`, geometryTypesFound);
  console.log(`[Rhino3dm] Extracted ${objects.length} objects (skipped: ${skippedCount}, errors: ${errorCount})`);
  
  // Warn if no objects were extracted
  if (objects.length === 0 && totalObjects > 0) {
    const typeList = Object.keys(geometryTypesFound).join(', ');
    console.warn(`[Rhino3dm] WARNING: No meshable objects found. Types in file: ${typeList}`);
    console.warn('[Rhino3dm] This could mean: NURBS/Brep tessellation failed, or file contains only curves/points.');
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

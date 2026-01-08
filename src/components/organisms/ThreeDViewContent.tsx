/**
 * ThreeDViewContent - 3D Model Viewer
 * 
 * Features:
 * - STL and 3DM file support
 * - Mouse controls (orbit, pan, zoom)
 * - Layer management for 3DM files
 * - Material assignment (metals, stones)
 * - Snapshot export
 */

'use client';

import React, { useState, useRef, useCallback, Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Center, Environment, Grid, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import {
  Upload,
  Box,
  RotateCcw,
  Camera,
  Download,
  Layers,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Trash2,
  Grid3X3,
  Loader2,
  X,
  Check,
  Circle,
  ZoomIn,
  ZoomOut,
  Image,
  Sun,
  Moon,
  Palette,
  Info,
  Focus,
  Maximize2,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react';
import { useSidebarStore } from '@/store/sidebarStore';

// Rhino3dm - Will be loaded dynamically when needed
// Note: 3DM support requires additional setup due to WASM complexity

// Types
interface ModelLayer {
  id: string;
  name: string;
  visible: boolean;
  geometry: THREE.BufferGeometry;
  materialId: string;
  color: string;
}

interface MaterialPreset {
  id: string;
  name: string;
  color: string;
  metalness: number;
  roughness: number;
  envMapIntensity: number;
}

// Metal material presets
const METAL_PRESETS: MaterialPreset[] = [
  { id: 'yellow-gold', name: 'Yellow Gold', color: '#D4AF37', metalness: 1, roughness: 0.15, envMapIntensity: 1.5 },
  { id: 'white-gold', name: 'White Gold', color: '#E8E8E8', metalness: 1, roughness: 0.1, envMapIntensity: 1.5 },
  { id: 'rose-gold', name: 'Rose Gold', color: '#B76E79', metalness: 1, roughness: 0.15, envMapIntensity: 1.5 },
  { id: 'platinum', name: 'Platinum', color: '#E5E4E2', metalness: 1, roughness: 0.08, envMapIntensity: 1.8 },
  { id: 'silver', name: 'Silver', color: '#C0C0C0', metalness: 1, roughness: 0.12, envMapIntensity: 1.6 },
];

// Stone material presets
const STONE_PRESETS: MaterialPreset[] = [
  { id: 'diamond', name: 'Diamond', color: '#E8F4F8', metalness: 0, roughness: 0, envMapIntensity: 2.5 },
  { id: 'ruby', name: 'Ruby', color: '#E0115F', metalness: 0, roughness: 0.05, envMapIntensity: 2 },
  { id: 'sapphire', name: 'Sapphire', color: '#0F52BA', metalness: 0, roughness: 0.05, envMapIntensity: 2 },
  { id: 'emerald', name: 'Emerald', color: '#50C878', metalness: 0, roughness: 0.08, envMapIntensity: 1.8 },
  { id: 'amethyst', name: 'Amethyst', color: '#9966CC', metalness: 0, roughness: 0.05, envMapIntensity: 1.8 },
];

// Environment presets (without emojis per user preference)
const ENVIRONMENT_PRESETS = [
  { id: 'none', name: 'None' },
  { id: 'studio', name: 'Studio' },
  { id: 'sunset', name: 'Sunset' },
  { id: 'dawn', name: 'Dawn' },
  { id: 'warehouse', name: 'Warehouse' },
  { id: 'city', name: 'City' },
] as const;

type EnvironmentPreset = typeof ENVIRONMENT_PRESETS[number]['id'];

// Background presets
const BACKGROUND_PRESETS = [
  { id: 'dark', name: 'Dark', color: '#0a0a0a' },
  { id: 'darker', name: 'Darker', color: '#000000' },
  { id: 'gray', name: 'Gray', color: '#1a1a1a' },
  { id: 'gradient', name: 'Gradient', color: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)' },
];

// Lighting presets
interface LightingPreset {
  id: string;
  name: string;
  ambient: number;
  main: { intensity: number; color: string; position: [number, number, number] };
  fill: { intensity: number; color: string; position: [number, number, number] };
  back: { intensity: number; color: string; position: [number, number, number] };
}

const LIGHTING_PRESETS: LightingPreset[] = [
  {
    id: 'studio',
    name: 'Studio',
    ambient: 0.6,
    main: { intensity: 2.0, color: '#ffffff', position: [5, 8, 5] },
    fill: { intensity: 1.0, color: '#e0e8ff', position: [-5, 3, -3] },
    back: { intensity: 0.8, color: '#fff5e0', position: [0, 5, -8] },
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    ambient: 0.2,
    main: { intensity: 3.0, color: '#ffffff', position: [8, 10, 2] },
    fill: { intensity: 0.3, color: '#4488ff', position: [-8, 2, -5] },
    back: { intensity: 1.5, color: '#ff8844', position: [-3, 8, -10] },
  },
  {
    id: 'soft',
    name: 'Soft',
    ambient: 1.0,
    main: { intensity: 1.2, color: '#fff8f0', position: [3, 6, 4] },
    fill: { intensity: 0.8, color: '#f0f8ff', position: [-4, 4, 2] },
    back: { intensity: 0.5, color: '#ffffff', position: [0, 3, -5] },
  },
  {
    id: 'warm',
    name: 'Warm',
    ambient: 0.5,
    main: { intensity: 2.0, color: '#ffddaa', position: [5, 7, 5] },
    fill: { intensity: 0.8, color: '#ffcc88', position: [-5, 4, 0] },
    back: { intensity: 0.6, color: '#ff9966', position: [0, 5, -6] },
  },
  {
    id: 'cool',
    name: 'Cool',
    ambient: 0.5,
    main: { intensity: 2.0, color: '#e0f0ff', position: [5, 7, 5] },
    fill: { intensity: 0.8, color: '#aaccff', position: [-5, 4, 0] },
    back: { intensity: 0.6, color: '#88aaff', position: [0, 5, -6] },
  },
  {
    id: 'product',
    name: 'Product',
    ambient: 0.8,
    main: { intensity: 1.8, color: '#ffffff', position: [0, 10, 5] },
    fill: { intensity: 1.2, color: '#ffffff', position: [-6, 5, 3] },
    back: { intensity: 1.2, color: '#ffffff', position: [6, 5, 3] },
  },
];

// 3D Model component
function Model({ 
  geometry, 
  material,
  wireframe = false,
}: { 
  geometry: THREE.BufferGeometry;
  material: MaterialPreset;
  wireframe?: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={material.color}
        metalness={material.metalness}
        roughness={material.roughness}
        envMapIntensity={material.envMapIntensity}
        wireframe={wireframe}
      />
    </mesh>
  );
}

// Layer Model component
function LayerModel({ 
  layer,
  material,
  wireframe = false,
}: { 
  layer: ModelLayer;
  material: MaterialPreset;
  wireframe?: boolean;
}) {
  if (!layer.visible) return null;
  
  return (
    <mesh geometry={layer.geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={material.color}
        metalness={material.metalness}
        roughness={material.roughness}
        envMapIntensity={material.envMapIntensity}
        wireframe={wireframe}
      />
    </mesh>
  );
}

// Scene content component
function SceneContent({
  geometry,
  material,
  layers,
  layerMaterials,
  autoRotate,
  showGrid,
  wireframe,
  environment,
  modelRotation,
  lighting,
  lightIntensity,
  onControlsReady,
  onFitToView,
}: {
  geometry: THREE.BufferGeometry | null;
  material: MaterialPreset;
  layers: ModelLayer[];
  layerMaterials: Record<string, MaterialPreset>;
  autoRotate: boolean;
  showGrid: boolean;
  wireframe: boolean;
  environment: EnvironmentPreset;
  modelRotation: [number, number, number];
  lighting: LightingPreset;
  lightIntensity: number;
  onControlsReady: (controls: any) => void;
  onFitToView: (fitFn: () => void) => void;
}) {
  const controlsRef = useRef<any>(null);
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [modelTransform, setModelTransform] = useState<{
    position: THREE.Vector3;
    scale: number;
  } | null>(null);

  useEffect(() => {
    if (controlsRef.current) {
      onControlsReady(controlsRef.current);
    }
  }, [onControlsReady]);

  // Fit camera to model
  const fitToView = useCallback(() => {
    if (!controlsRef.current) return;
    
    // Calculate bounding box
    const box = new THREE.Box3();
    
    if (geometry) {
      const tempGeom = geometry.clone();
      tempGeom.computeBoundingBox();
      if (tempGeom.boundingBox) {
        box.copy(tempGeom.boundingBox);
      }
    }
    
    if (box.isEmpty()) return;
    
    const center = new THREE.Vector3();
    box.getCenter(center);
    
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Position camera to see the whole model
    const fov = 50 * (Math.PI / 180);
    const cameraDistance = (maxDim / 2) / Math.tan(fov / 2) * 2.5;
    
    camera.position.set(cameraDistance, cameraDistance * 0.7, cameraDistance);
    camera.lookAt(0, 0, 0);
    
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  }, [geometry, camera]);

  // Expose fitToView function
  useEffect(() => {
    onFitToView(fitToView);
  }, [fitToView, onFitToView]);

  // Center and scale model when loaded (STL)
  useEffect(() => {
    if (geometry) {
      // Clone geometry to avoid modifying original
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      
      const boundingBox = geometry.boundingBox;
      if (boundingBox) {
        const center = new THREE.Vector3();
        boundingBox.getCenter(center);
        
        const size = new THREE.Vector3();
        boundingBox.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = maxDim > 0 ? 2 / maxDim : 1;
        
        setModelTransform({
          position: new THREE.Vector3(-center.x, -center.y, -center.z),
          scale: scale,
        });
        
        // Auto fit to view after loading
        setTimeout(() => {
          camera.position.set(4, 3, 4);
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }, 100);
      }
    } else {
      setModelTransform(null);
    }
  }, [geometry, camera]);

  // Center and scale layers (3DM)
  useEffect(() => {
    if (layers.length > 0 && groupRef.current) {
      // Compute combined bounding box
      const combinedBox = new THREE.Box3();
      
      layers.forEach(layer => {
        layer.geometry.computeBoundingBox();
        if (layer.geometry.boundingBox) {
          combinedBox.union(layer.geometry.boundingBox);
        }
      });

      const center = new THREE.Vector3();
      combinedBox.getCenter(center);
      
      const size = new THREE.Vector3();
      combinedBox.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 2 / maxDim : 1;

      // Apply transform to group
      groupRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      groupRef.current.scale.set(scale, scale, scale);

      camera.position.set(4, 3, 4);
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0);
        controlsRef.current.update();
      }
    }
  }, [layers, camera]);

  // Calculate final intensities with global multiplier
  const intensityMultiplier = lightIntensity;

  return (
    <>
      {/* Ambient Light */}
      <ambientLight intensity={lighting.ambient * intensityMultiplier} />
      
      {/* Main Key Light */}
      <directionalLight
        position={lighting.main.position}
        intensity={lighting.main.intensity * intensityMultiplier}
        color={lighting.main.color}
        castShadow
        shadow-mapSize={2048}
      />
      
      {/* Fill Light */}
      <directionalLight
        position={lighting.fill.position}
        intensity={lighting.fill.intensity * intensityMultiplier}
        color={lighting.fill.color}
      />
      
      {/* Back/Rim Light */}
      <directionalLight
        position={lighting.back.position}
        intensity={lighting.back.intensity * intensityMultiplier}
        color={lighting.back.color}
      />
      
      {/* Hemisphere light for better ambient */}
      <hemisphereLight
        color="#ffffff"
        groundColor="#444444"
        intensity={0.4 * intensityMultiplier}
      />

      {/* Environment for reflections - only load if not 'none' */}
      {environment !== 'none' && (
        <Environment preset={environment as Exclude<EnvironmentPreset, 'none'>} />
      )}

      {/* Grid */}
      {showGrid && (
        <Grid
          args={[10, 10]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor="#444"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#666"
          fadeDistance={15}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid
        />
      )}

      {/* STL Model */}
      {geometry && modelTransform && (
        <group rotation={modelRotation}>
          <group
            position={[
              modelTransform.position.x * modelTransform.scale,
              modelTransform.position.y * modelTransform.scale,
              modelTransform.position.z * modelTransform.scale,
            ]}
            scale={[modelTransform.scale, modelTransform.scale, modelTransform.scale]}
          >
            <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
              <meshStandardMaterial
                color={material.color}
                metalness={material.metalness}
                roughness={material.roughness}
                envMapIntensity={material.envMapIntensity}
                wireframe={wireframe}
              />
            </mesh>
          </group>
        </group>
      )}

      {/* 3DM Layers */}
      {layers.length > 0 && (
        <group ref={groupRef}>
          {layers.map(layer => (
            <LayerModel
              key={layer.id}
              layer={layer}
              material={layerMaterials[layer.id] || METAL_PRESETS[0]}
              wireframe={wireframe}
            />
          ))}
        </group>
      )}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        enablePan
        enableZoom
        enableRotate
        autoRotate={autoRotate}
        autoRotateSpeed={2}
        minDistance={0.5}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      
      {/* Axis Gizmo in corner - hide during snapshot */}
      {showGrid && (
        <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
          <GizmoViewport 
            axisColors={['#ff4444', '#44ff44', '#4444ff']} 
            labelColor="white"
          />
        </GizmoHelper>
      )}
    </>
  );
}

// Snapshot component
function SnapshotHelper({ 
  onSnapshot 
}: { 
  onSnapshot: (dataUrl: string) => void;
}) {
  const { gl, scene, camera } = useThree();

  useEffect(() => {
    const handleSnapshot = () => {
      gl.render(scene, camera);
      const dataUrl = gl.domElement.toDataURL('image/png');
      onSnapshot(dataUrl);
    };

    window.addEventListener('take-3d-snapshot', handleSnapshot);
    return () => window.removeEventListener('take-3d-snapshot', handleSnapshot);
  }, [gl, scene, camera, onSnapshot]);

  return null;
}

export default function ThreeDViewContent() {
  // Layout state
  const { leftOpen } = useSidebarStore();
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<any>(null);
  
  // State
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [loadedGeometry, setLoadedGeometry] = useState<THREE.BufferGeometry | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialPreset>(METAL_PRESETS[0]);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [materialType, setMaterialType] = useState<'metal' | 'stone'>('metal');
  const [snapshotPreview, setSnapshotPreview] = useState<string | null>(null);
  const [environment, setEnvironment] = useState<EnvironmentPreset>('none');
  const [backgroundColor, setBackgroundColor] = useState('#0a0a0a');
  const [snapshotScale, setSnapshotScale] = useState<1 | 2 | 4>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [modelInfo, setModelInfo] = useState<{ vertices: number; faces: number } | null>(null);
  const [fitToViewFn, setFitToViewFn] = useState<(() => void) | null>(null);
  const [modelRotation, setModelRotation] = useState<[number, number, number]>([-Math.PI / 2, 0, 0]); // Default Z-up to Y-up
  const [selectedLighting, setSelectedLighting] = useState<LightingPreset>(LIGHTING_PRESETS[0]); // Studio default
  const [lightIntensity, setLightIntensity] = useState(1.0); // Global intensity multiplier
  const [isSnapshotMode, setIsSnapshotMode] = useState(false); // Hide grid during snapshot
  
  // Layer state (for future 3DM support)
  const [layers, setLayers] = useState<ModelLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [layerMaterials, setLayerMaterials] = useState<Record<string, MaterialPreset>>({});

  // Process file (shared between click and drag&drop)
  const processFile = useCallback((file: File) => {
    setIsLoading(true);
    setLoadingStatus('Reading file...');
    setFileName(file.name);
    setLayers([]);
    setLoadedGeometry(null);
    setModelInfo(null);

    const reader = new FileReader();
    
    if (file.name.toLowerCase().endsWith('.stl')) {
      reader.onload = (event) => {
        const contents = event.target?.result;
        if (contents) {
          const loader = new STLLoader();
          try {
            setLoadingStatus('Parsing STL...');
            const geometry = loader.parse(contents as ArrayBuffer);
            setLoadedGeometry(geometry);
            setLayers([]);
            
            // Calculate model info
            const positionAttribute = geometry.getAttribute('position');
            const vertices = positionAttribute ? positionAttribute.count : 0;
            const faces = Math.floor(vertices / 3);
            setModelInfo({ vertices, faces });
          } catch (error) {
            console.error('Error parsing STL:', error);
            alert('Error loading STL file');
          }
        }
        setIsLoading(false);
        setLoadingStatus('');
      };
      reader.readAsArrayBuffer(file);
    } else if (file.name.toLowerCase().endsWith('.3dm')) {
      alert('3DM support coming soon! For now, please export your model as STL.');
      setIsLoading(false);
      setLoadingStatus('');
    } else {
      alert('Unsupported file format. Please use STL files.');
      setIsLoading(false);
      setLoadingStatus('');
    }
  }, []);

  // Handle file input change
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  }, [processFile]);

  // Handle drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, [processFile]);

  // Reset view
  const handleResetView = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  }, []);

  // Zoom controls
  const handleZoomIn = useCallback(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(0.8);
      controlsRef.current.update();
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(1.25);
      controlsRef.current.update();
    }
  }, []);

  // Rotate model 90 degrees
  const handleRotateX = useCallback(() => {
    setModelRotation(prev => [prev[0] + Math.PI / 2, prev[1], prev[2]]);
  }, []);

  const handleRotateY = useCallback(() => {
    setModelRotation(prev => [prev[0], prev[1] + Math.PI / 2, prev[2]]);
  }, []);

  const handleRotateZ = useCallback(() => {
    setModelRotation(prev => [prev[0], prev[1], prev[2] + Math.PI / 2]);
  }, []);

  // Take snapshot
  const handleSnapshot = useCallback(() => {
    // Hide grid and gizmo during snapshot
    setIsSnapshotMode(true);
    
    // Wait for next frame to render without grid, then take snapshot
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.dispatchEvent(new CustomEvent('take-3d-snapshot', { detail: { scale: snapshotScale } }));
        // Restore grid after snapshot
        setTimeout(() => setIsSnapshotMode(false), 100);
      });
    });
  }, [snapshotScale]);

  // Handle snapshot result
  const handleSnapshotResult = useCallback((dataUrl: string) => {
    setSnapshotPreview(dataUrl);
  }, []);

  // Download snapshot
  const handleDownloadSnapshot = useCallback(() => {
    if (snapshotPreview) {
      const link = document.createElement('a');
      link.download = `${fileName?.replace(/\.[^/.]+$/, '') || 'model'}_snapshot.png`;
      link.href = snapshotPreview;
      link.click();
    }
  }, [snapshotPreview, fileName]);

  // Save snapshot to gallery
  const handleSaveToGallery = useCallback(async () => {
    if (!snapshotPreview) return;
    
    try {
      const { saveImageToGallery } = await import('@/lib/gallery-storage');
      await saveImageToGallery(
        snapshotPreview, 
        `3D View: ${fileName || 'Unknown'}`,
        'manual',
        {
          prompt: `3D View snapshot of ${fileName || 'model'}`,
        }
      );
      
      // Dispatch event to update gallery count
      window.dispatchEvent(new Event('gallery-updated'));
      alert('Saved to gallery!');
    } catch (error) {
      console.error('Error saving to gallery:', error);
      alert('Error saving to gallery');
    }
  }, [snapshotPreview, fileName]);

  // Clear model
  const handleClearModel = useCallback(() => {
    setLoadedGeometry(null);
    setFileName(null);
    setLayers([]);
    setLayerMaterials({});
    setSelectedLayerId(null);
    setModelInfo(null);
  }, []);

  // Get current material presets
  const currentPresets = materialType === 'metal' ? METAL_PRESETS : STONE_PRESETS;

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-[#0a0a0a]"
      style={{
        left: leftOpen ? '260px' : '0',
        transition: 'left 500ms ease-in-out',
      }}
    >
      {/* Top Bar */}
      <div className="flex h-12 items-center justify-between border-b border-white/10 bg-black/40 px-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Box className="h-5 w-5 text-white/60" />
          <h1 className="text-sm font-medium text-white/80">3D View</h1>
          {fileName && (
            <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-white/50">
              {fileName}
            </span>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-1">
          {/* Zoom Controls */}
          <button
            onClick={handleZoomIn}
            disabled={!loadedGeometry}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            onClick={handleZoomOut}
            disabled={!loadedGeometry}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* View Toggles */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-all ${
              autoRotate
                ? 'bg-purple-500/20 text-purple-300'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            title="Auto Rotate"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-all ${
              showGrid
                ? 'bg-white/15 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            title="Toggle Grid"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs transition-all ${
              wireframe
                ? 'bg-white/15 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
            title="Toggle Wireframe"
          >
            <Box className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* Rotation Controls */}
          <div className="flex items-center gap-0.5 rounded-md border border-white/10 bg-white/5 px-1">
            <button
              onClick={handleRotateX}
              disabled={!loadedGeometry}
              className="flex h-7 w-7 items-center justify-center rounded text-white/60 hover:bg-white/10 disabled:opacity-30"
              title="Rotate X (90°)"
            >
              <span className="text-[10px] font-medium">X</span>
            </button>
            <button
              onClick={handleRotateY}
              disabled={!loadedGeometry}
              className="flex h-7 w-7 items-center justify-center rounded text-white/60 hover:bg-white/10 disabled:opacity-30"
              title="Rotate Y (90°)"
            >
              <span className="text-[10px] font-medium">Y</span>
            </button>
            <button
              onClick={handleRotateZ}
              disabled={!loadedGeometry}
              className="flex h-7 w-7 items-center justify-center rounded text-white/60 hover:bg-white/10 disabled:opacity-30"
              title="Rotate Z (90°)"
            >
              <span className="text-[10px] font-medium">Z</span>
            </button>
          </div>

          <div className="mx-1 h-4 w-px bg-white/10" />

          <button
            onClick={() => fitToViewFn?.()}
            disabled={!loadedGeometry}
            className="flex h-8 items-center gap-1.5 rounded-md bg-white/5 px-2.5 text-xs text-white/60 hover:bg-white/10 disabled:opacity-30"
            title="Fit to View (Center model)"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleResetView}
            className="flex h-8 items-center gap-1.5 rounded-md bg-white/5 px-2.5 text-xs text-white/60 hover:bg-white/10"
            title="Reset View"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          {/* Snapshot with scale selector */}
          <div className="flex items-center rounded-md border border-white/10 bg-white/5">
            <select
              value={snapshotScale}
              onChange={(e) => setSnapshotScale(Number(e.target.value) as 1 | 2 | 4)}
              className="h-8 appearance-none bg-transparent px-2 text-xs text-white/60 outline-none"
            >
              <option value={1} className="bg-black">1x</option>
              <option value={2} className="bg-black">2x</option>
              <option value={4} className="bg-black">4x</option>
            </select>
          </div>
          
          <button
            onClick={handleSnapshot}
            disabled={!loadedGeometry}
            className="flex h-8 items-center gap-1.5 rounded-md bg-purple-500 px-3 text-xs font-medium text-white hover:bg-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Camera className="h-3.5 w-3.5" />
            Snapshot
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* 3D Canvas */}
        <div 
          className="relative flex-1"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Drag overlay */}
          {isDragging && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-purple-500/20 backdrop-blur-sm">
              <div className="rounded-2xl border-2 border-dashed border-purple-400 bg-purple-500/10 p-12 text-center">
                <Upload className="mx-auto h-12 w-12 text-purple-400" />
                <p className="mt-4 text-lg font-medium text-white">Drop STL file here</p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-purple-400" />
                <p className="mt-2 text-sm text-white/60">{loadingStatus || 'Loading model...'}</p>
              </div>
            </div>
          )}

          {!loadedGeometry && !isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="text-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-4 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-white/5 p-12 transition-colors hover:border-white/30 hover:bg-white/10"
                >
                  <Upload className="h-12 w-12 text-white/30" />
                  <span className="mt-4 text-lg font-medium text-white/60">
                    Upload 3D Model
                  </span>
                  <span className="mt-2 text-sm text-white/40">
                    Supports STL format
                  </span>
                </button>
                <p className="text-xs text-white/30">
                  Or drag and drop a file here
                </p>
              </div>
            </div>
          )}

          <Canvas
            shadows
            camera={{ position: [3, 2, 3], fov: 50 }}
            gl={{ 
              preserveDrawingBuffer: true, 
              antialias: true,
              failIfMajorPerformanceCaveat: false,
              powerPreference: 'default',
            }}
            style={{ background: backgroundColor }}
            onCreated={(state) => {
              // Ensure WebGL context is properly initialized
              state.gl.setClearColor(backgroundColor);
            }}
          >
            <Suspense fallback={null}>
              <SceneContent
                geometry={loadedGeometry}
                material={selectedMaterial}
                layers={layers}
                layerMaterials={layerMaterials}
                autoRotate={autoRotate}
                showGrid={showGrid && !isSnapshotMode}
                wireframe={wireframe}
                environment={environment}
                modelRotation={modelRotation}
                lighting={selectedLighting}
                lightIntensity={lightIntensity}
                onControlsReady={(controls) => { controlsRef.current = controls; }}
                onFitToView={(fn) => setFitToViewFn(() => fn)}
              />
              <SnapshotHelper onSnapshot={handleSnapshotResult} />
            </Suspense>
          </Canvas>

          {/* Controls hint */}
          {(loadedGeometry || layers.length > 0) && (
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 text-xs text-white/40 backdrop-blur-sm">
              <span className="text-white/60">Left click:</span> Rotate &nbsp;
              <span className="text-white/60">Right click:</span> Pan &nbsp;
              <span className="text-white/60">Scroll:</span> Zoom
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div 
          className={`relative flex flex-col border-l border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 ${
            isPanelOpen ? 'w-72' : 'w-0'
          }`}
        >
          <button
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className="absolute -left-3 top-1/2 z-10 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/80 text-white/60 hover:text-white"
          >
            {isPanelOpen ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
          </button>

          {isPanelOpen && (
            <div className="flex flex-1 flex-col overflow-y-auto p-4">
              {/* File Upload */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Model
                </h3>
                {loadedGeometry ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-3">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-white/70 truncate max-w-[120px]">
                          {fileName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-white"
                          title="Replace"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={handleClearModel}
                          className="rounded p-1 text-white/40 hover:bg-white/10 hover:text-red-400"
                          title="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    {/* Model Info */}
                    {modelInfo && (
                      <div className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-[10px] text-white/40">
                        <Info className="h-3 w-3 text-white/30" />
                        <span>{modelInfo.vertices.toLocaleString()} vertices</span>
                        <span>{modelInfo.faces.toLocaleString()} faces</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-white/20 bg-white/5 py-4 text-sm text-white/50 hover:border-white/30 hover:bg-white/10"
                  >
                    <Upload className="h-4 w-4" />
                    Upload STL File
                  </button>
                )}
              </div>

              {/* Lighting */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Lighting
                </h3>
                {/* Lighting Presets */}
                <div className="grid grid-cols-3 gap-1 mb-3">
                  {LIGHTING_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedLighting(preset)}
                      className={`rounded-md py-2 text-xs transition-all ${
                        selectedLighting.id === preset.id
                          ? 'bg-purple-500/30 text-purple-300 ring-1 ring-purple-500/50'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                {/* Intensity Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-white/40">Intensity</span>
                    <span className="text-[10px] text-white/60">{Math.round(lightIntensity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="3"
                    step="0.1"
                    value={lightIntensity}
                    onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                </div>
              </div>

              {/* Environment */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Environment (HDR)
                </h3>
                <div className="grid grid-cols-3 gap-1">
                  {ENVIRONMENT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setEnvironment(preset.id)}
                      className={`rounded-md py-2 text-xs transition-all ${
                        environment === preset.id
                          ? 'bg-white/15 text-white'
                          : 'bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-white/30">
                  HDR environments add reflections. May cause loading delays.
                </p>
              </div>

              {/* Background */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Background
                </h3>
                <div className="flex gap-2">
                  {BACKGROUND_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setBackgroundColor(preset.color)}
                      className={`h-8 flex-1 rounded-md border-2 transition-all ${
                        backgroundColor === preset.color
                          ? 'border-purple-500'
                          : 'border-transparent hover:border-white/20'
                      }`}
                      style={{ background: preset.color }}
                      title={preset.name}
                    />
                  ))}
                </div>
              </div>

              {/* Material Type Toggle */}
              <div className="mb-4">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Material Type
                </h3>
                <div className="flex rounded-lg border border-white/10 bg-white/5 p-1">
                  <button
                    onClick={() => setMaterialType('metal')}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                      materialType === 'metal'
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Metal
                  </button>
                  <button
                    onClick={() => setMaterialType('stone')}
                    className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-all ${
                      materialType === 'stone'
                        ? 'bg-white/15 text-white'
                        : 'text-white/50 hover:text-white/70'
                    }`}
                  >
                    Stone
                  </button>
                </div>
              </div>

              {/* Material Presets */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  {materialType === 'metal' ? 'Metal' : 'Stone'} Presets
                </h3>
                <div className="space-y-2">
                  {currentPresets.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedMaterial(preset)}
                      className={`flex w-full items-center gap-3 rounded-lg border p-3 transition-all ${
                        selectedMaterial.id === preset.id
                          ? 'border-purple-500/50 bg-purple-500/10'
                          : 'border-white/10 bg-white/5 hover:border-white/20'
                      }`}
                    >
                      <div 
                        className="h-6 w-6 rounded-full shadow-inner"
                        style={{ 
                          background: `linear-gradient(135deg, ${preset.color} 0%, ${preset.color}88 100%)`,
                          boxShadow: `inset 0 2px 4px rgba(255,255,255,0.3), inset 0 -2px 4px rgba(0,0,0,0.3)`
                        }}
                      />
                      <span className="text-sm text-white/70">{preset.name}</span>
                      {selectedMaterial.id === preset.id && (
                        <Check className="ml-auto h-4 w-4 text-purple-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layers (for 3DM files) */}
              <div className="mb-6">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Layers {layers.length > 0 && `(${layers.length})`}
                </h3>
                {layers.length > 0 ? (
                  <div className="space-y-2">
                    {layers.map((layer) => (
                      <div
                        key={layer.id}
                        className={`rounded-lg border p-2 transition-all ${
                          selectedLayerId === layer.id
                            ? 'border-purple-500/50 bg-purple-500/10'
                            : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setLayers(prev => prev.map(l => 
                                l.id === layer.id ? { ...l, visible: !l.visible } : l
                              ));
                            }}
                            className={`rounded p-1 transition-colors ${
                              layer.visible 
                                ? 'text-white/70 hover:bg-white/10' 
                                : 'text-white/30 hover:bg-white/10'
                            }`}
                          >
                            {layer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                          </button>
                          <div
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: layerMaterials[layer.id]?.color || layer.color }}
                          />
                          <button
                            onClick={() => setSelectedLayerId(selectedLayerId === layer.id ? null : layer.id)}
                            className="flex-1 text-left text-xs text-white/70 truncate"
                          >
                            {layer.name}
                          </button>
                        </div>
                        
                        {/* Layer Material Selection */}
                        {selectedLayerId === layer.id && (
                          <div className="mt-2 border-t border-white/10 pt-2">
                            <p className="mb-2 text-[10px] text-white/40">Assign Material:</p>
                            <div className="grid grid-cols-5 gap-1">
                              {[...METAL_PRESETS, ...STONE_PRESETS].map((preset) => (
                                <button
                                  key={preset.id}
                                  onClick={() => {
                                    setLayerMaterials(prev => ({
                                      ...prev,
                                      [layer.id]: preset
                                    }));
                                  }}
                                  className={`aspect-square rounded-md border transition-all ${
                                    layerMaterials[layer.id]?.id === preset.id
                                      ? 'border-purple-500 ring-1 ring-purple-500'
                                      : 'border-white/10 hover:border-white/30'
                                  }`}
                                  style={{ 
                                    background: `linear-gradient(135deg, ${preset.color} 0%, ${preset.color}88 100%)`
                                  }}
                                  title={preset.name}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                    <Layers className="mx-auto h-6 w-6 text-white/20" />
                    <p className="mt-2 text-xs text-white/40">
                      {loadedGeometry 
                        ? 'STL files have a single layer'
                        : 'Load a 3DM file to see layers'}
                    </p>
                  </div>
                )}
              </div>

              {/* Snapshot Preview */}
              {snapshotPreview && (
                <div className="mb-6">
                  <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                    Snapshot
                  </h3>
                  <div className="relative overflow-hidden rounded-lg border border-white/10">
                    <img 
                      src={snapshotPreview} 
                      alt="Snapshot" 
                      className="w-full"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/70 opacity-0 transition-opacity hover:opacity-100">
                      <div className="flex flex-wrap justify-center gap-2">
                        <button
                          onClick={handleDownloadSnapshot}
                          className="flex items-center gap-1 rounded-lg bg-purple-500 px-3 py-2 text-xs font-medium text-white hover:bg-purple-600"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </button>
                        <button
                          onClick={handleSaveToGallery}
                          className="flex items-center gap-1 rounded-lg bg-white/15 px-3 py-2 text-xs font-medium text-white hover:bg-white/25"
                        >
                          <Image className="h-3.5 w-3.5" />
                          Gallery
                        </button>
                        <a
                          href={`/studio?image=${encodeURIComponent(snapshotPreview || '')}`}
                          className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-2 text-xs font-medium text-white hover:from-purple-600 hover:to-pink-600"
                        >
                          <Palette className="h-3.5 w-3.5" />
                          Studio
                        </a>
                      </div>
                      <button
                        onClick={() => setSnapshotPreview(null)}
                        className="mt-1 text-[10px] text-white/50 hover:text-white/70"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Guide */}
              <div className="mt-auto">
                <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
                  Supported Formats
                </h3>
                <div className="space-y-2 text-xs text-white/40">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-400" />
                    <span>STL - Single mesh models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 text-yellow-400" />
                    <span>3DM - Coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}


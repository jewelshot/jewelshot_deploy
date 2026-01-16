/**
 * PlaygroundContent Component
 * 
 * 3D STL Viewer with weight calculation:
 * - STL file upload (drag & drop)
 * - Volume calculation using signed volume method
 * - Weight calculation for different metals
 * - Interactive 3D preview
 */

'use client';

import React, { Suspense, useState, useRef, useCallback, useMemo } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, ContactShadows, PerspectiveCamera, Center } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import Link from 'next/link';
import { 
  ArrowLeft, 
  RotateCcw, 
  Maximize2, 
  Upload, 
  Scale, 
  Info,
  ChevronDown,
  FileBox,
  X
} from 'lucide-react';

// ============================================
// TYPES & CONSTANTS
// ============================================

interface MetalType {
  id: string;
  name: string;
  density: number; // g/cm³
  color: string;
  emoji: string;
}

const METALS: MetalType[] = [
  { id: 'gold-24k', name: 'Altın 24K (Saf)', density: 19.32, color: '#FFD700', emoji: '🥇' },
  { id: 'gold-22k', name: 'Altın 22K', density: 17.80, color: '#FFCC00', emoji: '✨' },
  { id: 'gold-18k', name: 'Altın 18K', density: 15.50, color: '#FFB800', emoji: '💛' },
  { id: 'gold-14k', name: 'Altın 14K', density: 13.00, color: '#DAA520', emoji: '🌟' },
  { id: 'gold-9k', name: 'Altın 9K', density: 11.20, color: '#CD853F', emoji: '⭐' },
  { id: 'silver-925', name: 'Gümüş 925', density: 10.36, color: '#C0C0C0', emoji: '🥈' },
  { id: 'silver-pure', name: 'Gümüş (Saf)', density: 10.49, color: '#E8E8E8', emoji: '🤍' },
  { id: 'platinum-950', name: 'Platin 950', density: 21.45, color: '#E5E4E2', emoji: '💎' },
  { id: 'platinum-900', name: 'Platin 900', density: 20.10, color: '#D4D4D4', emoji: '🔘' },
  { id: 'palladium', name: 'Paladyum', density: 12.02, color: '#CED0CE', emoji: '⚪' },
  { id: 'rose-gold-18k', name: 'Rose Gold 18K', density: 15.10, color: '#E8B4B8', emoji: '🌸' },
  { id: 'white-gold-18k', name: 'Beyaz Altın 18K', density: 15.70, color: '#F0F0F0', emoji: '🤍' },
  { id: 'brass', name: 'Pirinç', density: 8.50, color: '#B5A642', emoji: '🔶' },
  { id: 'bronze', name: 'Bronz', density: 8.80, color: '#CD7F32', emoji: '🟤' },
  { id: 'copper', name: 'Bakır', density: 8.96, color: '#B87333', emoji: '🧡' },
];

// ============================================
// VOLUME CALCULATION
// ============================================

/**
 * Calculate volume of a mesh using signed tetrahedron volume method
 * This is the same method used by professional CAD software
 * 
 * For each triangle, calculate the signed volume of the tetrahedron 
 * formed with the origin. Sum all volumes.
 */
function calculateMeshVolume(geometry: THREE.BufferGeometry): number {
  const position = geometry.attributes.position;
  
  if (!position) {
    console.warn('No position attribute found');
    return 0;
  }

  let totalVolume = 0;
  const vertex1 = new THREE.Vector3();
  const vertex2 = new THREE.Vector3();
  const vertex3 = new THREE.Vector3();

  // Check if geometry has indices
  if (geometry.index) {
    const indices = geometry.index.array;
    for (let i = 0; i < indices.length; i += 3) {
      vertex1.fromBufferAttribute(position, indices[i]);
      vertex2.fromBufferAttribute(position, indices[i + 1]);
      vertex3.fromBufferAttribute(position, indices[i + 2]);
      
      // Signed volume of tetrahedron with origin
      totalVolume += signedVolumeOfTriangle(vertex1, vertex2, vertex3);
    }
  } else {
    // Non-indexed geometry
    for (let i = 0; i < position.count; i += 3) {
      vertex1.fromBufferAttribute(position, i);
      vertex2.fromBufferAttribute(position, i + 1);
      vertex3.fromBufferAttribute(position, i + 2);
      
      totalVolume += signedVolumeOfTriangle(vertex1, vertex2, vertex3);
    }
  }

  return Math.abs(totalVolume);
}

/**
 * Signed volume of a tetrahedron formed by triangle and origin
 * V = (v1 · (v2 × v3)) / 6
 */
function signedVolumeOfTriangle(
  v1: THREE.Vector3,
  v2: THREE.Vector3,
  v3: THREE.Vector3
): number {
  return v1.dot(v2.clone().cross(v3)) / 6.0;
}

/**
 * Get mesh bounding box dimensions
 */
function getMeshDimensions(geometry: THREE.BufferGeometry): { x: number; y: number; z: number } {
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  
  if (!box) return { x: 0, y: 0, z: 0 };
  
  return {
    x: box.max.x - box.min.x,
    y: box.max.y - box.min.y,
    z: box.max.z - box.min.z
  };
}

// ============================================
// 3D SCENE COMPONENTS
// ============================================

/**
 * STL Model Component
 */
function STLModel({ 
  url, 
  metalColor 
}: { 
  url: string; 
  metalColor: string;
}) {
  const geometry = useLoader(STLLoader, url);
  
  // Center and scale the geometry
  const centeredGeometry = useMemo(() => {
    const geo = geometry.clone();
    geo.center();
    geo.computeVertexNormals();
    
    // Auto-scale to fit view
    geo.computeBoundingBox();
    const box = geo.boundingBox;
    if (box) {
      const maxDim = Math.max(
        box.max.x - box.min.x,
        box.max.y - box.min.y,
        box.max.z - box.min.z
      );
      const scale = 2 / maxDim; // Normalize to ~2 units
      geo.scale(scale, scale, scale);
    }
    
    return geo;
  }, [geometry]);

  return (
    <mesh geometry={centeredGeometry} castShadow receiveShadow>
      <meshStandardMaterial 
        color={metalColor}
        metalness={0.9}
        roughness={0.15}
        envMapIntensity={1.2}
      />
    </mesh>
  );
}

/**
 * Placeholder Ring (shown when no STL is loaded)
 */
function PlaceholderRing() {
  return (
    <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh>
        <torusGeometry args={[1, 0.15, 32, 100]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          metalness={1} 
          roughness={0.1}
        />
      </mesh>
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.25, 0.2, 0.15, 32]} />
        <meshStandardMaterial 
          color="#e8e8e8" 
          metalness={0.9} 
          roughness={0.15}
        />
      </mesh>
      <mesh position={[0, 0, 0.35]}>
        <octahedronGeometry args={[0.2, 0]} />
        <meshPhysicalMaterial 
          color="#ffffff"
          metalness={0}
          roughness={0}
          transmission={0.9}
          thickness={0.5}
          ior={2.4}
        />
      </mesh>
    </group>
  );
}

/**
 * Scene Setup
 */
function Scene({ 
  stlUrl, 
  metalColor 
}: { 
  stlUrl: string | null;
  metalColor: string;
}) {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={35} />
      
      {/* Lighting setup for jewelry */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.2}
        castShadow
      />
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.5}
      />
      <pointLight position={[0, 5, 0]} intensity={0.3} />
      <hemisphereLight args={['#ffffff', '#444444', 0.5]} />
      
      <Center>
        {stlUrl ? (
          <Suspense fallback={<PlaceholderRing />}>
            <STLModel url={stlUrl} metalColor={metalColor} />
          </Suspense>
        ) : (
          <PlaceholderRing />
        )}
      </Center>
      
      <ContactShadows 
        position={[0, -0.8, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4}
      />
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        dampingFactor={0.05}
        enableDamping={true}
      />
    </>
  );
}

// ============================================
// UI COMPONENTS
// ============================================

/**
 * Metal Selector Dropdown
 */
function MetalSelector({ 
  selectedMetal, 
  onSelect 
}: { 
  selectedMetal: MetalType;
  onSelect: (metal: MetalType) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>{selectedMetal.emoji}</span>
          <span className="text-sm text-white/90">{selectedMetal.name}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-white/40 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 py-1 bg-[#1a1a2e] border border-white/10 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {METALS.map((metal) => (
            <button
              key={metal.id}
              onClick={() => {
                onSelect(metal);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                metal.id === selectedMetal.id ? 'bg-white/5' : ''
              }`}
            >
              <span>{metal.emoji}</span>
              <span className="text-sm text-white/80">{metal.name}</span>
              <span className="ml-auto text-xs text-white/40">{metal.density} g/cm³</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Weight Results Panel
 */
function WeightPanel({
  volume,
  dimensions,
  selectedMetal,
  triangleCount
}: {
  volume: number | null;
  dimensions: { x: number; y: number; z: number } | null;
  selectedMetal: MetalType;
  triangleCount: number;
}) {
  if (volume === null) return null;

  // Convert mm³ to cm³ (assuming STL is in mm)
  const volumeCm3 = volume / 1000;
  
  // Calculate weight in grams
  const weightGrams = volumeCm3 * selectedMetal.density;

  return (
    <div className="space-y-3">
      {/* Weight Result */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="h-4 w-4 text-purple-400" />
          <span className="text-xs text-purple-300 uppercase tracking-wide">Teorik Ağırlık</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-light text-white">{weightGrams.toFixed(2)}</span>
          <span className="text-lg text-white/60">gram</span>
        </div>
        <p className="text-[10px] text-white/40 mt-2">
          {selectedMetal.name} • {selectedMetal.density} g/cm³
        </p>
      </div>

      {/* Volume & Dimensions */}
      <div className="grid grid-cols-2 gap-2">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-[10px] text-white/40 uppercase mb-1">Hacim</p>
          <p className="text-sm text-white/90">{volumeCm3.toFixed(4)} cm³</p>
        </div>
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-[10px] text-white/40 uppercase mb-1">Üçgen</p>
          <p className="text-sm text-white/90">{triangleCount.toLocaleString()}</p>
        </div>
      </div>

      {/* Dimensions */}
      {dimensions && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <p className="text-[10px] text-white/40 uppercase mb-2">Boyutlar (mm)</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-xs text-white/50">X</p>
              <p className="text-sm text-white/90">{dimensions.x.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Y</p>
              <p className="text-sm text-white/90">{dimensions.y.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-white/50">Z</p>
              <p className="text-sm text-white/90">{dimensions.z.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <Info className="h-3 w-3 text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-amber-200/80 leading-relaxed">
          Hesaplama STL dosyasının mm biriminde olduğunu varsayar. 
          Döküm sonrası ağırlık %1-3 farklılık gösterebilir.
        </p>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function PlaygroundContent() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [stlFile, setStlFile] = useState<File | null>(null);
  const [stlUrl, setStlUrl] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<MetalType>(METALS[2]); // Default: 18K Gold
  const [volume, setVolume] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState<{ x: number; y: number; z: number } | null>(null);
  const [triangleCount, setTriangleCount] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.stl')) {
      setError('Lütfen bir STL dosyası seçin');
      return;
    }

    setIsLoading(true);
    setError(null);
    setStlFile(file);

    try {
      // Create object URL for Three.js
      const url = URL.createObjectURL(file);
      setStlUrl(url);

      // Parse STL for volume calculation
      const arrayBuffer = await file.arrayBuffer();
      const loader = new STLLoader();
      const geometry = loader.parse(arrayBuffer);

      // Calculate volume
      const meshVolume = calculateMeshVolume(geometry);
      setVolume(meshVolume);

      // Get dimensions
      const dims = getMeshDimensions(geometry);
      setDimensions(dims);

      // Get triangle count
      const triangles = geometry.attributes.position.count / 3;
      setTriangleCount(triangles);

    } catch (err) {
      console.error('STL parsing error:', err);
      setError('STL dosyası işlenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Drag & Drop handlers
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
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleClearFile = useCallback(() => {
    if (stlUrl) {
      URL.revokeObjectURL(stlUrl);
    }
    setStlFile(null);
    setStlUrl(null);
    setVolume(null);
    setDimensions(null);
    setTriangleCount(0);
    setError(null);
  }, [stlUrl]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-[#0a0a0a] overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".stl"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* ==================== DRAG OVERLAY ==================== */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-purple-900/50 backdrop-blur-sm">
          <div className="text-center">
            <Upload className="h-16 w-16 text-purple-300 mx-auto mb-4 animate-bounce" />
            <p className="text-xl text-white">STL dosyasını bırakın</p>
          </div>
        </div>
      )}

      {/* ==================== HEADER ==================== */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/studio"
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back</span>
          </Link>
          
          <div className="h-6 w-px bg-white/10" />
          
          <h1 className="text-xl font-light tracking-wide">
            <span className="text-purple-400">jewel</span>
            <span className="text-white/80">Playground</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleFullscreen}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ==================== 3D CANVAS ==================== */}
      <div className="absolute inset-0">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{ 
            antialias: true,
            alpha: true,
            preserveDrawingBuffer: true
          }}
          style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0a 100%)' }}
        >
          <Suspense fallback={null}>
            <Scene stlUrl={stlUrl} metalColor={selectedMetal.color} />
          </Suspense>
        </Canvas>
      </div>

      {/* ==================== RIGHT SIDEBAR ==================== */}
      <div className="absolute top-20 right-6 bottom-20 w-72 z-10 flex flex-col gap-4">
        {/* Upload Section */}
        <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <FileBox className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-medium text-white/90">STL Dosyası</h3>
          </div>

          {stlFile ? (
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileBox className="h-4 w-4 text-green-400 flex-shrink-0" />
                <span className="text-xs text-white/80 truncate">{stlFile.name}</span>
              </div>
              <button
                onClick={handleClearFile}
                className="p-1 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-full p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-colors text-center"
            >
              <Upload className="h-6 w-6 text-white/40 mx-auto mb-2" />
              <p className="text-xs text-white/60">
                {isLoading ? 'Yükleniyor...' : 'STL dosyası seçin veya sürükleyin'}
              </p>
            </button>
          )}

          {error && (
            <p className="mt-2 text-xs text-red-400">{error}</p>
          )}
        </div>

        {/* Metal Selector */}
        <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-medium text-white/90">Maden Türü</h3>
          </div>
          
          <MetalSelector
            selectedMetal={selectedMetal}
            onSelect={setSelectedMetal}
          />
        </div>

        {/* Weight Results */}
        {volume !== null && (
          <div className="p-4 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex-1 overflow-y-auto">
            <WeightPanel
              volume={volume}
              dimensions={dimensions}
              selectedMetal={selectedMetal}
              triangleCount={triangleCount}
            />
          </div>
        )}
      </div>

      {/* ==================== WATERMARK ==================== */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-light text-white/40">ijewel</span>
          <span className="text-xs text-white/30 bg-white/10 px-1.5 py-0.5 rounded">3d</span>
        </div>
      </div>

      {/* ==================== CONTROLS HINT ==================== */}
      <div className="absolute bottom-6 right-6 z-10 text-right">
        <p className="text-xs text-white/30">
          Döndür: Sürükle • Yakınlaştır: Scroll • Kaydır: Shift+Sürükle
        </p>
      </div>
    </div>
  );
}

export default PlaygroundContent;

/**
 * PlaygroundContent Component
 * 
 * Main 3D viewer with:
 * - Three.js canvas
 * - Orbit controls
 * - Basic lighting
 * - Test geometry
 */

'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera } from '@react-three/drei';
import Link from 'next/link';
import { ArrowLeft, RotateCcw, Maximize2, Share2 } from 'lucide-react';

// ============================================
// 3D SCENE COMPONENTS
// ============================================

/**
 * Test Ring Geometry
 * Simple placeholder ring using Three.js primitives
 */
function TestRing() {
  return (
    <group position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {/* Ring band */}
      <mesh>
        <torusGeometry args={[1, 0.15, 32, 100]} />
        <meshStandardMaterial 
          color="#c0c0c0" 
          metalness={1} 
          roughness={0.1}
        />
      </mesh>
      
      {/* Center stone mount */}
      <mesh position={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.25, 0.2, 0.15, 32]} />
        <meshStandardMaterial 
          color="#e8e8e8" 
          metalness={0.9} 
          roughness={0.15}
        />
      </mesh>
      
      {/* Center diamond */}
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
      
      {/* Side stones */}
      {[-0.4, -0.25, 0.25, 0.4].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.12]} rotation={[0, 0, Math.PI / 4]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshPhysicalMaterial 
            color="#f8f8f8"
            metalness={0}
            roughness={0}
            transmission={0.8}
            ior={2.2}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Scene Setup
 * Lighting, environment, and shadows
 */
function Scene() {
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={35} />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <spotLight 
        position={[10, 10, 10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={1}
        castShadow
      />
      <spotLight 
        position={[-10, 10, -10]} 
        angle={0.15} 
        penumbra={1} 
        intensity={0.5}
      />
      
      {/* Environment for reflections */}
      <Environment preset="studio" />
      
      {/* The Ring */}
      <TestRing />
      
      {/* Contact shadows */}
      <ContactShadows 
        position={[0, -0.8, 0]} 
        opacity={0.4} 
        scale={10} 
        blur={2} 
        far={4}
      />
      
      {/* Orbit Controls */}
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
// MAIN COMPONENT
// ============================================

export function PlaygroundContent() {
  const [isFullscreen, setIsFullscreen] = useState(false);

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
    // Will reset camera position - implemented later
    window.location.reload();
  };

  return (
    <div className="relative h-screen w-full bg-[#0a0a0a] overflow-hidden">
      {/* ==================== HEADER ==================== */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        {/* Left - Logo & Back */}
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

        {/* Right - Actions */}
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
          
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-colors"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-sm">Share</span>
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
            <Scene />
          </Suspense>
        </Canvas>
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
          Drag to rotate • Scroll to zoom • Shift+drag to pan
        </p>
      </div>
    </div>
  );
}

export default PlaygroundContent;

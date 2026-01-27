/**
 * OrientationModal - Model orientation adjustment modal
 * 
 * Atomic Architecture: Molecule component
 * Opens when a model is loaded to help correct orientation/axis
 */

'use client';

import React, { useState, useCallback, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';
import {
  X,
  RotateCcw,
  RotateCw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Crosshair,
  Maximize2,
  FlipHorizontal,
  FlipVertical,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface OrientationConfig {
  upAxis: 'y' | 'z' | '-y' | '-z';
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
  centered: boolean;
}

interface OrientationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (config: OrientationConfig) => void;
  geometry?: THREE.BufferGeometry;
  scene?: THREE.Group;
  fileName: string;
}

// ============================================
// PREVIEW MESH COMPONENT
// ============================================

interface PreviewMeshProps {
  geometry?: THREE.BufferGeometry;
  scene?: THREE.Group;
  config: OrientationConfig;
  autoRotate: boolean;
}

function PreviewMesh({ geometry, scene, config, autoRotate }: PreviewMeshProps) {
  const meshRef = useRef<THREE.Mesh | THREE.Group>(null);
  const { camera } = useThree();

  // Apply orientation
  useEffect(() => {
    if (!meshRef.current) return;

    // Reset
    meshRef.current.rotation.set(0, 0, 0);
    meshRef.current.scale.setScalar(config.scale);

    // Apply up axis rotation
    switch (config.upAxis) {
      case 'z':
        meshRef.current.rotation.x = -Math.PI / 2;
        break;
      case '-y':
        meshRef.current.rotation.x = Math.PI;
        break;
      case '-z':
        meshRef.current.rotation.x = Math.PI / 2;
        break;
      default: // 'y' - no rotation needed
        break;
    }

    // Apply additional rotations (in degrees)
    meshRef.current.rotation.x += THREE.MathUtils.degToRad(config.rotationX);
    meshRef.current.rotation.y += THREE.MathUtils.degToRad(config.rotationY);
    meshRef.current.rotation.z += THREE.MathUtils.degToRad(config.rotationZ);
  }, [config]);

  // Auto-rotate for preview
  useFrame((_, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Fit camera to model
  useEffect(() => {
    if (!meshRef.current) return;

    const box = new THREE.Box3().setFromObject(meshRef.current);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const distance = maxDim / (2 * Math.tan(fov / 2)) * 1.5;

    camera.position.set(distance * 0.8, distance * 0.5, distance * 0.8);
    camera.lookAt(0, 0, 0);
  }, [camera, geometry, scene]);

  if (scene) {
    return (
      <primitive 
        ref={meshRef as React.Ref<THREE.Group>} 
        object={scene.clone()} 
      />
    );
  }

  if (geometry) {
    return (
      <mesh ref={meshRef as React.Ref<THREE.Mesh>} geometry={geometry}>
        <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.2} />
      </mesh>
    );
  }

  return null;
}

// ============================================
// MAIN MODAL COMPONENT
// ============================================

export function OrientationModal({
  isOpen,
  onClose,
  onConfirm,
  geometry,
  scene,
  fileName,
}: OrientationModalProps) {
  const [config, setConfig] = useState<OrientationConfig>({
    upAxis: 'y',
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0,
    scale: 1,
    centered: true,
  });
  const [autoRotate, setAutoRotate] = useState(true);

  // Quick rotation handler
  const rotateQuick = useCallback((axis: 'x' | 'y' | 'z', degrees: number) => {
    setConfig(prev => ({
      ...prev,
      [`rotation${axis.toUpperCase()}`]: (prev[`rotation${axis.toUpperCase()}` as keyof OrientationConfig] as number + degrees) % 360,
    }));
  }, []);

  // Reset handler
  const handleReset = useCallback(() => {
    setConfig({
      upAxis: 'y',
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      centered: true,
    });
  }, []);

  // Confirm handler
  const handleConfirm = useCallback(() => {
    onConfirm(config);
    onClose();
  }, [config, onConfirm, onClose]);

  // Skip handler (use defaults)
  const handleSkip = useCallback(() => {
    onConfirm({
      upAxis: 'y',
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
      centered: true,
    });
    onClose();
  }, [onConfirm, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="mx-4 w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a]/95 shadow-2xl backdrop-blur-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <div>
              <h2 className="text-lg font-medium text-white">Model Yönelimi</h2>
              <p className="mt-1 text-sm text-white/50">
                {fileName} - Modelin doğru yönde görünmesini sağlayın
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex">
            {/* 3D Preview */}
            <div className="flex-1 border-r border-white/10">
              <div className="relative aspect-square bg-gradient-to-b from-black/50 to-black/20">
                <Canvas camera={{ fov: 50 }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[5, 10, 5]} intensity={1} />
                    <directionalLight position={[-5, 5, -5]} intensity={0.5} />
                    <Environment preset="studio" />
                    <Center>
                      <PreviewMesh
                        geometry={geometry}
                        scene={scene}
                        config={config}
                        autoRotate={autoRotate}
                      />
                    </Center>
                    <OrbitControls enablePan={false} />
                  </Suspense>
                </Canvas>

                {/* Auto-rotate toggle */}
                <button
                  onClick={() => setAutoRotate(!autoRotate)}
                  className={`absolute bottom-3 left-3 rounded-lg px-3 py-1.5 text-xs transition-colors ${
                    autoRotate
                      ? 'bg-purple-500/30 text-purple-300'
                      : 'bg-white/10 text-white/50'
                  }`}
                >
                  <RotateCw className={`mr-1.5 inline h-3 w-3 ${autoRotate ? 'animate-spin' : ''}`} />
                  Otomatik Döndür
                </button>

                {/* Axis indicator */}
                <div className="absolute bottom-3 right-3 rounded-lg bg-black/50 px-3 py-1.5 text-xs text-white/60">
                  <span className="text-red-400">X</span>
                  <span className="mx-1">/</span>
                  <span className="text-green-400">Y</span>
                  <span className="mx-1">/</span>
                  <span className="text-blue-400">Z</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="w-72 p-4">
              {/* Up Axis */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-white/70">
                  Yukarı Eksen (Up Axis)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['y', 'z', '-y', '-z'] as const).map((axis) => (
                    <button
                      key={axis}
                      onClick={() => setConfig(prev => ({ ...prev, upAxis: axis }))}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        config.upAxis === axis
                          ? 'border-purple-500/50 bg-purple-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                      }`}
                    >
                      {axis.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Rotations */}
              <div className="mb-4">
                <label className="mb-2 block text-xs font-medium text-white/70">
                  Hızlı Döndürme
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* X axis */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-red-400">X</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => rotateQuick('x', -90)}
                        className="flex-1 rounded bg-white/10 p-1 text-xs hover:bg-white/20"
                      >
                        <ArrowDown className="mx-auto h-3 w-3" />
                      </button>
                      <button
                        onClick={() => rotateQuick('x', 90)}
                        className="flex-1 rounded bg-white/10 p-1 text-xs hover:bg-white/20"
                      >
                        <ArrowUp className="mx-auto h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Y axis */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-green-400">Y</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => rotateQuick('y', -90)}
                        className="flex-1 rounded bg-white/10 p-1 text-xs hover:bg-white/20"
                      >
                        <ArrowLeft className="mx-auto h-3 w-3" />
                      </button>
                      <button
                        onClick={() => rotateQuick('y', 90)}
                        className="flex-1 rounded bg-white/10 p-1 text-xs hover:bg-white/20"
                      >
                        <ArrowRight className="mx-auto h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Z axis */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-medium text-blue-400">Z</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => rotateQuick('z', -90)}
                        className="flex-1 rounded bg-white/10 p-1 text-xs hover:bg-white/20"
                      >
                        <RotateCcw className="mx-auto h-3 w-3" />
                      </button>
                      <button
                        onClick={() => rotateQuick('z', 90)}
                        className="flex-1 rounded bg-white/10 p-1 text-xs hover:bg-white/20"
                      >
                        <RotateCw className="mx-auto h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Rotation Values */}
              <div className="mb-4 rounded-lg border border-white/10 bg-white/5 p-3">
                <label className="mb-2 block text-xs font-medium text-white/70">
                  Mevcut Döndürme
                </label>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-red-400">X</span>
                    <p className="text-xs text-white">{config.rotationX}°</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-green-400">Y</span>
                    <p className="text-xs text-white">{config.rotationY}°</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-blue-400">Z</span>
                    <p className="text-xs text-white">{config.rotationZ}°</p>
                  </div>
                </div>
              </div>

              {/* Scale */}
              <div className="mb-4">
                <label className="mb-2 flex items-center justify-between text-xs font-medium text-white/70">
                  <span>Ölçek</span>
                  <span className="text-white/40">{config.scale.toFixed(2)}x</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={config.scale}
                  onChange={(e) => setConfig(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                  className="w-full accent-purple-500"
                />
              </div>

              {/* Center toggle */}
              <div className="mb-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="center-model"
                  checked={config.centered}
                  onChange={(e) => setConfig(prev => ({ ...prev, centered: e.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 bg-white/10"
                />
                <label htmlFor="center-model" className="text-xs text-white/70">
                  <Crosshair className="mr-1.5 inline h-3 w-3" />
                  Modeli Ortala
                </label>
              </div>

              {/* Reset button */}
              <button
                onClick={handleReset}
                className="mb-4 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs text-white/60 transition-colors hover:bg-white/10"
              >
                <RotateCcw className="mr-1.5 inline h-3 w-3" />
                Sıfırla
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <button
              onClick={handleSkip}
              className="rounded-lg px-4 py-2 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              Atla (Varsayılan Kullan)
            </button>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition-colors hover:bg-white/10"
              >
                İptal
              </button>
              <button
                onClick={handleConfirm}
                className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-500"
              >
                <Check className="h-4 w-4" />
                Uygula
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OrientationModal;

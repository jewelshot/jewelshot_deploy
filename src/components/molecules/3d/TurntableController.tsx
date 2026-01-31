/**
 * TurntableController - Automatic rotation animation for 3D objects
 * 
 * Features:
 * - 360° rotation animation
 * - Configurable speed and direction
 * - Multi-axis support
 * - Easing options
 * - Start/Stop/Reset controls
 */

'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ThrottledRangeInput } from '@/components/atoms/ThrottledRangeInput';
import { useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw, Play, Pause, RotateCcw, RefreshCw } from 'lucide-react';
import * as THREE from 'three';

// ============================================
// TYPES
// ============================================

export type RotationAxis = 'x' | 'y' | 'z';
export type RotationDirection = 'cw' | 'ccw';
export type EasingType = 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';

export interface TurntableConfig {
  enabled: boolean;
  axis: RotationAxis;
  direction: RotationDirection;
  speed: number; // Rotations per second
  easing: EasingType;
  pauseOnHover: boolean;
  autoStart: boolean;
}

export const DEFAULT_TURNTABLE_CONFIG: TurntableConfig = {
  enabled: false,
  axis: 'y',
  direction: 'cw',
  speed: 0.5,
  easing: 'linear',
  pauseOnHover: true,
  autoStart: false,
};

// ============================================
// EASING FUNCTIONS
// ============================================

const easingFunctions: Record<EasingType, (t: number) => number> = {
  linear: (t) => t,
  'ease-in': (t) => t * t,
  'ease-out': (t) => t * (2 - t),
  'ease-in-out': (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

// ============================================
// TURNTABLE R3F COMPONENT
// ============================================

interface TurntableAnimatorProps {
  config: TurntableConfig;
  isPlaying: boolean;
  onRotationChange?: (rotation: { x: number; y: number; z: number }) => void;
  groupRef: React.RefObject<THREE.Group>;
}

export function TurntableAnimator({
  config,
  isPlaying,
  onRotationChange,
  groupRef,
}: TurntableAnimatorProps) {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!config.enabled || !isPlaying || !groupRef.current) return;

    // Calculate rotation speed (radians per second)
    const radiansPerSecond = config.speed * Math.PI * 2;
    const direction = config.direction === 'cw' ? 1 : -1;
    const rotationDelta = radiansPerSecond * delta * direction;

    // Apply rotation based on axis
    switch (config.axis) {
      case 'x':
        groupRef.current.rotation.x += rotationDelta;
        break;
      case 'y':
        groupRef.current.rotation.y += rotationDelta;
        break;
      case 'z':
        groupRef.current.rotation.z += rotationDelta;
        break;
    }

    // Notify parent of rotation change
    if (onRotationChange) {
      onRotationChange({
        x: groupRef.current.rotation.x,
        y: groupRef.current.rotation.y,
        z: groupRef.current.rotation.z,
      });
    }

    timeRef.current += delta;
  });

  return null;
}

// ============================================
// TURNTABLE CONTROLS PANEL
// ============================================

interface TurntableControlsProps {
  config: TurntableConfig;
  onChange: (config: Partial<TurntableConfig>) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export function TurntableControls({
  config,
  onChange,
  isPlaying,
  onTogglePlay,
  onReset,
}: TurntableControlsProps) {
  return (
    <div className="space-y-4">
      {/* Enable Toggle */}
      <label className="flex cursor-pointer items-center justify-between">
        <span className="text-xs text-white/70">Otomatik Döndürme</span>
        <button
          onClick={() => onChange({ enabled: !config.enabled })}
          className={`relative h-5 w-9 rounded-full transition-colors ${
            config.enabled ? 'bg-white/40' : 'bg-white/20'
          }`}
        >
          <span
            className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
              config.enabled ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </label>

      {config.enabled && (
        <>
          {/* Play/Pause/Reset Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onTogglePlay}
              className={`flex flex-1 items-center justify-center gap-1 rounded-lg py-2 text-xs font-medium transition-all ${
                isPlaying
                  ? 'bg-yellow-500/20 text-yellow-300'
                  : 'bg-green-500/20 text-green-300'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  Duraklat
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Oynat
                </>
              )}
            </button>
            <button
              onClick={onReset}
              className="flex items-center justify-center rounded-lg bg-white/10 px-3 py-2 text-white/60 hover:bg-white/15"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Axis Selection */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Dönüş Ekseni</span>
            <div className="flex gap-1">
              {(['x', 'y', 'z'] as RotationAxis[]).map((axis) => (
                <button
                  key={axis}
                  onClick={() => onChange({ axis })}
                  className={`flex-1 rounded-md py-2 text-xs font-mono transition-all ${
                    config.axis === axis
                      ? 'bg-white/40/20 text-white/90 ring-1 ring-white/25'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {axis.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Direction */}
          <div className="space-y-2">
            <span className="text-[10px] text-white/50">Yön</span>
            <div className="flex gap-1">
              <button
                onClick={() => onChange({ direction: 'cw' })}
                className={`flex flex-1 items-center justify-center gap-1 rounded-md py-2 text-xs transition-all ${
                  config.direction === 'cw'
                    ? 'bg-white/40/20 text-white/90 ring-1 ring-white/25'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                <RotateCw className="h-3.5 w-3.5" />
                Saat Yönü
              </button>
              <button
                onClick={() => onChange({ direction: 'ccw' })}
                className={`flex flex-1 items-center justify-center gap-1 rounded-md py-2 text-xs transition-all ${
                  config.direction === 'ccw'
                    ? 'bg-white/40/20 text-white/90 ring-1 ring-white/25'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Tersine
              </button>
            </div>
          </div>

          {/* Speed */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-white/50">Hız</span>
              <span className="text-[10px] font-mono text-white/60">
                {config.speed.toFixed(2)} r/s
              </span>
            </div>
            <ThrottledRangeInput
              
              min={0.1}
              max={2}
              step={0.1}
              value={config.speed}
              onChange={(v) => onChange({ speed: v })}
              
            />
            <div className="flex justify-between text-[9px] text-white/30">
              <span>Yavaş</span>
              <span>Normal</span>
              <span>Hızlı</span>
            </div>
          </div>

          {/* Quick Speed Presets */}
          <div className="flex gap-1">
            {[
              { label: '0.25x', value: 0.25 },
              { label: '0.5x', value: 0.5 },
              { label: '1x', value: 1 },
              { label: '2x', value: 2 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => onChange({ speed: preset.value })}
                className={`flex-1 rounded-md py-1.5 text-[10px] transition-all ${
                  Math.abs(config.speed - preset.value) < 0.01
                    ? 'bg-white/40/20 text-white/90'
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Pause on Hover */}
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-[10px] text-white/50">Hover'da Duraklat</span>
            <button
              onClick={() => onChange({ pauseOnHover: !config.pauseOnHover })}
              className={`relative h-4 w-7 rounded-full transition-colors ${
                config.pauseOnHover ? 'bg-white/40' : 'bg-white/20'
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-3 w-3 rounded-full bg-white transition-transform ${
                  config.pauseOnHover ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </label>
        </>
      )}
    </div>
  );
}

// ============================================
// COMPACT TURNTABLE BUTTON (for toolbar)
// ============================================

interface TurntableButtonProps {
  isEnabled: boolean;
  isPlaying: boolean;
  onToggle: () => void;
}

export function TurntableButton({ isEnabled, isPlaying, onToggle }: TurntableButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
        isEnabled
          ? isPlaying
            ? 'bg-white/40 text-white'
            : 'bg-white/40/20 text-white/70'
          : 'bg-white/10 text-white/50 hover:bg-white/15'
      }`}
      title={isEnabled ? (isPlaying ? 'Durdur' : 'Başlat') : 'Turntable'}
    >
      <RotateCw className={`h-4 w-4 ${isPlaying ? 'animate-spin' : ''}`} />
    </button>
  );
}

export default TurntableControls;

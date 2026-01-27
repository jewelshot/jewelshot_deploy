/**
 * ColorPicker Component
 * A modern color picker with HEX, RGB, and HSL support
 */

'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pipette, Copy, Check } from 'lucide-react';
import { hexToRgb, rgbToHsl, rgbToHex, hslToRgb } from '@/lib/color-extractor';

interface ColorPickerProps {
  color: string; // HEX format
  onChange: (color: string) => void;
  className?: string;
  showInput?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ColorPicker({
  color,
  onChange,
  className = '',
  showInput = true,
  size = 'md',
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tempColor, setTempColor] = useState(color);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync temp color with prop
  useEffect(() => {
    setTempColor(color);
  }, [color]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const rgb = hexToRgb(tempColor) || { r: 0, g: 0, b: 0 };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const handleHexChange = useCallback((value: string) => {
    let hex = value.startsWith('#') ? value : '#' + value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      setTempColor(hex);
      onChange(hex);
    } else {
      setTempColor(hex);
    }
  }, [onChange]);

  const handleRgbChange = useCallback((channel: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...rgb, [channel]: Math.max(0, Math.min(255, value)) };
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setTempColor(hex);
    onChange(hex);
  }, [rgb, onChange]);

  const handleHslChange = useCallback((channel: 'h' | 's' | 'l', value: number) => {
    let newHsl = { ...hsl };
    if (channel === 'h') newHsl.h = Math.max(0, Math.min(360, value));
    else if (channel === 's') newHsl.s = Math.max(0, Math.min(100, value));
    else if (channel === 'l') newHsl.l = Math.max(0, Math.min(100, value));
    
    const newRgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    setTempColor(hex);
    onChange(hex);
  }, [hsl, onChange]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(tempColor);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [tempColor]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Color Swatch Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${sizeClasses[size]} overflow-hidden rounded-lg border border-white/20 shadow-md transition-all hover:border-white/40 hover:shadow-lg`}
        style={{ backgroundColor: tempColor }}
        title={tempColor}
      />

      {/* Picker Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-white/10 bg-[#1a1a1a]/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Color Preview */}
            <div
              className="h-24 w-full"
              style={{ backgroundColor: tempColor }}
            />

            <div className="p-4 space-y-4">
              {/* Hue Slider */}
              <div>
                <label className="mb-1 block text-[10px] text-white/50">Hue</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(0, ${hsl.s}%, ${hsl.l}%), 
                      hsl(60, ${hsl.s}%, ${hsl.l}%), 
                      hsl(120, ${hsl.s}%, ${hsl.l}%), 
                      hsl(180, ${hsl.s}%, ${hsl.l}%), 
                      hsl(240, ${hsl.s}%, ${hsl.l}%), 
                      hsl(300, ${hsl.s}%, ${hsl.l}%), 
                      hsl(360, ${hsl.s}%, ${hsl.l}%)
                    )`,
                  }}
                />
              </div>

              {/* Saturation Slider */}
              <div>
                <label className="mb-1 block text-[10px] text-white/50">Saturation</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) => handleHslChange('s', parseInt(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(${hsl.h}, 0%, ${hsl.l}%), 
                      hsl(${hsl.h}, 100%, ${hsl.l}%)
                    )`,
                  }}
                />
              </div>

              {/* Lightness Slider */}
              <div>
                <label className="mb-1 block text-[10px] text-white/50">Lightness</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) => handleHslChange('l', parseInt(e.target.value))}
                  className="w-full h-3 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      hsl(${hsl.h}, ${hsl.s}%, 0%), 
                      hsl(${hsl.h}, ${hsl.s}%, 50%), 
                      hsl(${hsl.h}, ${hsl.s}%, 100%)
                    )`,
                  }}
                />
              </div>

              {/* HEX Input */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-[10px] text-white/50">HEX</label>
                  <input
                    type="text"
                    value={tempColor}
                    onChange={(e) => handleHexChange(e.target.value)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-xs text-white focus:border-purple-500/50 focus:outline-none"
                    maxLength={7}
                  />
                </div>
                <button
                  onClick={copyToClipboard}
                  className="mt-4 flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
                  title="Copy HEX"
                >
                  {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              {/* RGB Values */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="mb-1 block text-[10px] text-white/50">R</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.r}
                    onChange={(e) => handleRgbChange('r', parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-center text-xs text-white focus:border-red-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-white/50">G</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.g}
                    onChange={(e) => handleRgbChange('g', parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-center text-xs text-white focus:border-green-500/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] text-white/50">B</label>
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb.b}
                    onChange={(e) => handleRgbChange('b', parseInt(e.target.value) || 0)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-center text-xs text-white focus:border-blue-500/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Native Color Picker Fallback */}
              <div className="flex items-center gap-2 border-t border-white/10 pt-3">
                <input
                  type="color"
                  value={tempColor}
                  onChange={(e) => {
                    setTempColor(e.target.value);
                    onChange(e.target.value);
                  }}
                  className="h-8 w-8 cursor-pointer overflow-hidden rounded-lg border border-white/10"
                />
                <span className="text-xs text-white/40">Gelişmiş Seçici</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ColorPicker;

/**
 * ShowcaseSection - Before/After Gallery
 * Demonstrates AI transformation capabilities
 */

'use client';

import React, { useState } from 'react';
import { ArrowRight, Sparkles, Zap, Wand2 } from 'lucide-react';

const showcaseItems = [
  {
    id: 1,
    title: 'Professional Background',
    before: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
    category: 'Background Removal',
  },
  {
    id: 2,
    title: 'Color Enhancement',
    before: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80',
    category: 'Color Correction',
  },
  {
    id: 3,
    title: 'Lifestyle Shot',
    before: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80',
    after: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80',
    category: 'AI Scene Generation',
  },
];

export function ShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, x)));
  };

  return (
    <section className="relative overflow-hidden px-6 py-24" id="showcase">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-4 py-2">
            <Wand2 className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-300">See the Magic</span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
            Before & After <span className="bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">Transformations</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Witness the power of AI-driven jewelry photography enhancement
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {showcaseItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(index)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeIndex === index
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg shadow-amber-500/25'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>

        {/* Comparison Slider */}
        <div className="mx-auto max-w-4xl">
          <div
            className="relative aspect-[4/3] cursor-ew-resize overflow-hidden rounded-2xl border border-white/10 bg-black/50"
            onMouseMove={handleSliderMove}
          >
            {/* After Image (Full) */}
            <img
              src={showcaseItems[activeIndex].after}
              alt="After"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={showcaseItems[activeIndex].before}
                alt="Before"
                className="h-full w-full object-cover"
                style={{ width: `${100 / (sliderPosition / 100)}%`, maxWidth: 'none' }}
              />
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-xl">
                <ArrowRight className="h-4 w-4 -rotate-180 text-gray-800" />
                <ArrowRight className="h-4 w-4 text-gray-800" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 rounded-lg bg-black/70 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
              Before
            </div>
            <div className="absolute top-4 right-4 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-3 py-1.5 text-sm font-medium text-white">
              After
            </div>
          </div>

          {/* Title */}
          <div className="mt-6 text-center">
            <h3 className="text-xl font-semibold text-white">{showcaseItems[activeIndex].title}</h3>
            <p className="mt-1 text-white/60">Drag the slider to compare</p>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            { value: '2M+', label: 'Images Processed' },
            { value: '98%', label: 'Customer Satisfaction' },
            { value: '<3s', label: 'Average Processing' },
            { value: '50+', label: 'AI Presets' },
          ].map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-center backdrop-blur-sm"
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-white/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


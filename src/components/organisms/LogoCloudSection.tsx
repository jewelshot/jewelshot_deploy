'use client';

import React from 'react';

/**
 * LogoCloudSection - Trusted by leading brands
 * Social proof through brand logos
 */
export function LogoCloudSection() {
  // Placeholder brand names (replace with actual logos later)
  const brands = [
    { name: 'Cartier', style: 'font-serif text-2xl tracking-widest' },
    { name: 'TIFFANY & CO', style: 'font-sans text-xl tracking-wider' },
    { name: 'Bulgari', style: 'font-serif text-2xl italic' },
    { name: 'Van Cleef', style: 'font-serif text-xl tracking-wide' },
    { name: 'Chopard', style: 'font-sans text-xl tracking-wider' },
    { name: 'Graff', style: 'font-serif text-2xl tracking-widest' },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-white/40">
            Trusted by Leading Jewelry Brands
          </p>
        </div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className="animate-in fade-in flex items-center justify-center"
              style={{
                animationDelay: `${index * 80}ms`,
              }}
            >
              <div className="group relative">
                {/* Logo (using text as placeholder) */}
                <div
                  className={`${brand.style} text-white/30 transition-all duration-300 group-hover:text-white/60`}
                >
                  {brand.name}
                </div>

                {/* Hover underline */}
                <div className="absolute -bottom-2 left-0 h-0.5 w-0 bg-gradient-to-r from-purple-500 to-transparent transition-all duration-300 group-hover:w-full" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Text */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/40">
            And 10,000+ jewelry businesses worldwide
          </p>
        </div>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent" />
      <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent" />
    </section>
  );
}

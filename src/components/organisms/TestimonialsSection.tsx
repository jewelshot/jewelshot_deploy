'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';

/**
 * TestimonialsSection - Customer testimonials
 * Builds trust and credibility
 */
export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Jewelry Designer',
      company: 'Luxe Jewelry Co.',
      image: 'LJ',
      rating: 5,
      content:
        'Jewelshot has transformed how we present our products online. The AI-powered editing saves us hours of work, and the quality is simply outstanding. Our conversion rates have increased by 40%!',
    },
    {
      name: 'Michael Chen',
      role: 'E-commerce Manager',
      company: 'Diamond & Gold',
      image: 'DG',
      rating: 5,
      content:
        'We used to spend $500 per photoshoot. Now we create stunning product images in minutes. The ROI is incredible. This tool is a game-changer for any jewelry business.',
    },
    {
      name: 'Emma Rodriguez',
      role: 'Marketing Director',
      company: 'Artisan Jewels',
      image: 'AJ',
      rating: 5,
      content:
        'The quality rivals professional studio photography. Our customers can&apos;t tell the difference. It&apos;s made our social media presence so much more polished and professional.',
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white lg:text-5xl">
            Loved by{' '}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Jewelry Professionals
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/60">
            Join thousands of jewelers who trust Jewelshot for their product
            photography needs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="animate-in fade-in slide-in-from-bottom-4 group relative"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Card */}
              <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-amber-500/30 hover:bg-white/10">
                {/* Quote Icon */}
                <Quote className="mb-4 h-8 w-8 text-amber-400/30" />

                {/* Rating */}
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="mb-6 leading-relaxed text-white/80">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-amber-600/20 text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-white/60">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-500/0 to-amber-500/0 opacity-0 blur-xl transition-opacity duration-300 group-hover:from-amber-500/20 group-hover:to-transparent group-hover:opacity-100" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/5 px-6 py-3 backdrop-blur-xl">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium text-white">
              4.9/5 rating from 1,000+ reviews
            </span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
    </section>
  );
}

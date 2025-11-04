import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

/**
 * FeatureCard - Glassmorphic card for feature display
 * Includes hover effects and animations
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  delay = 0,
}: FeatureCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 backdrop-blur-xl transition-all duration-500 hover:border-purple-500/30 hover:bg-white/[0.05]"
      style={{
        animation: `fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) ${delay}ms backwards`,
      }}
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-6 inline-flex rounded-xl bg-purple-500/10 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-purple-500/20">
          <Icon className="h-6 w-6 text-purple-400 transition-colors duration-300 group-hover:text-purple-300" />
        </div>

        {/* Title */}
        <h3 className="mb-3 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-purple-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm leading-relaxed text-white/60 transition-colors duration-300 group-hover:text-white/80">
          {description}
        </p>
      </div>

      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}







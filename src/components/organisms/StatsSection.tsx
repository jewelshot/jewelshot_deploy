'use client';

import React from 'react';
import { TrendingUp, Users, Image, Zap } from 'lucide-react';

/**
 * StatsSection - Display impressive metrics
 * Shows credibility and social proof
 */
export function StatsSection() {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Active Users',
      suffix: '',
    },
    {
      icon: Image,
      value: '500K+',
      label: 'Images Enhanced',
      suffix: '',
    },
    {
      icon: Zap,
      value: '99.9%',
      label: 'Uptime',
      suffix: '',
    },
    {
      icon: TrendingUp,
      value: '4.9',
      label: 'User Rating',
      suffix: '/5',
    },
  ];

  return (
    <section className="relative overflow-hidden px-6 py-16 lg:py-20">
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative"
                style={{
                  animation: `fadeInUp 600ms cubic-bezier(0.4, 0, 0.2, 1) ${index * 100}ms backwards`,
                }}
              >
                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:border-purple-500/30 hover:bg-white/10">
                  {/* Icon */}
                  <div className="mb-4 inline-flex rounded-xl bg-purple-500/10 p-3">
                    <Icon className="h-6 w-6 text-purple-400" />
                  </div>

                  {/* Value */}
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">
                      {stat.value}
                    </span>
                    {stat.suffix && (
                      <span className="text-2xl text-white/60">
                        {stat.suffix}
                      </span>
                    )}
                  </div>

                  {/* Label */}
                  <p className="text-sm font-medium text-white/60">
                    {stat.label}
                  </p>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-purple-500/0 to-purple-500/0 opacity-0 blur-xl transition-opacity duration-300 group-hover:from-purple-500/20 group-hover:to-transparent group-hover:opacity-100" />
                </div>
              </div>
            );
          })}
        </div>
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
    </section>
  );
}

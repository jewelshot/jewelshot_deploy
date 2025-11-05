import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

/**
 * AuthCard - Glassmorphic container for auth forms
 * Consistent with landing page design
 */
export function AuthCard({ children, title, subtitle }: AuthCardProps) {
  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="animate-in fade-in slide-in-from-bottom-4 relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur-xl duration-500">
        {/* Background Glow */}
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-sm text-white/60">{subtitle}</p>}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>
    </div>
  );
}

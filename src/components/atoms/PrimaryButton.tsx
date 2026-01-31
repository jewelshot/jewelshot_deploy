import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

/**
 * PrimaryButton - Main CTA button for landing page
 * Glassmorphic with smooth hover effects
 */
export function PrimaryButton({
  children,
  onClick,
  href,
  icon = false,
  size = 'md',
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
}: PrimaryButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]',
    secondary:
      'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-amber-500/50 text-white',
    ghost: 'bg-transparent hover:bg-white/5 text-white/80 hover:text-white',
  };

  const baseClasses = `
    group relative inline-flex items-center justify-center gap-2
    rounded-xl font-medium transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `;

  const content = (
    <>
      {children}
      {icon && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} type={type} disabled={disabled} className={baseClasses}>
      {content}
    </button>
  );
}







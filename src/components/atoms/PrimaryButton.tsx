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
 * PrimaryButton - Elegant CTA button with shine sweep effect
 * Features subtle glow and animated light sweep
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
    primary: 'primary-btn text-white',
    secondary:
      'bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 hover:border-purple-500/50 text-white',
    ghost: 'bg-transparent hover:bg-white/5 text-white/80 hover:text-white',
  };

  const baseClasses = `
    group relative inline-flex items-center justify-center gap-2
    rounded-xl font-medium transition-all duration-300
    disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden
    ${sizeClasses[size]} ${variantClasses[variant]} ${className}
  `;

  const content = (
    <>
      {/* Shine sweep overlay - only for primary variant */}
      {variant === 'primary' && (
        <span className="absolute inset-0 shine-sweep" />
      )}
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {icon && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
      <style jsx>{`
        .primary-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #9333ea 100%);
          box-shadow: 
            0 0 20px rgba(139, 92, 246, 0.3),
            0 0 40px rgba(139, 92, 246, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(139, 92, 246, 0.3);
        }
        .primary-btn:hover {
          box-shadow: 
            0 0 30px rgba(139, 92, 246, 0.5),
            0 0 60px rgba(139, 92, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }
        .shine-sweep {
          background: linear-gradient(
            105deg,
            transparent 20%,
            rgba(255, 255, 255, 0) 40%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 60%,
            transparent 80%
          );
          transform: translateX(-100%);
          animation: shineSweep 3s ease-in-out infinite;
        }
        @keyframes shineSweep {
          0% {
            transform: translateX(-100%);
          }
          50%, 100% {
            transform: translateX(100%);
          }
        }
      `}</style>
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







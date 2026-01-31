import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'apple' | 'shine';
  style?: React.CSSProperties;
}

/**
 * GradientText - Apple-style animated gradient text effect
 * Used for hero headings and emphasis
 */
export function GradientText({ children, className = '', variant = 'apple', style }: GradientTextProps) {
  if (variant === 'shine') {
    // Shine/glint effect that sweeps across
    return (
      <span className={`relative inline-block ${className}`}>
        <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
          {children}
        </span>
        <span 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent bg-clip-text text-transparent animate-shine"
          style={{ backgroundSize: '200% 100%' }}
        >
          {children}
        </span>
        <style jsx>{`
          @keyframes shine {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .animate-shine {
            animation: shine 3s ease-in-out infinite;
          }
        `}</style>
      </span>
    );
  }

  // Apple-style flowing multi-color gradient - continuous right movement
  // Combine space animation with gradient animation
  const combinedAnimation = style?.animation 
    ? `${style.animation}, appleGradient 4s linear infinite`
    : 'appleGradient 4s linear infinite';

  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #a855f7, #ec4899, #6366f1, #06b6d4, #a855f7, #ec4899, #6366f1, #06b6d4, #a855f7)',
        backgroundSize: '200% 100%',
        paddingBottom: '0.1em', // Prevent descender clipping on letters like g, y, p
        ...style,
        animation: combinedAnimation,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes appleGradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: -200% 50%;
          }
        }
      `}</style>
    </span>
  );
}

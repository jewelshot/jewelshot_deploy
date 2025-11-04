import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * GradientText - Animated gradient text effect
 * Used for hero headings and emphasis
 */
export function GradientText({ children, className = '' }: GradientTextProps) {
  return (
    <span
      className={`animate-gradient bg-gradient-to-r from-purple-300 via-purple-400 to-purple-300 bg-clip-text text-transparent ${className}`}
      style={{
        backgroundSize: '200% auto',
      }}
    >
      {children}
      <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
          100% {
            background-position: 0% center;
          }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}</style>
    </span>
  );
}







/**
 * Premium Mobile Design System
 * Native app-inspired design tokens
 */

export const premiumTheme = {
  // Premium Dark Colors
  colors: {
    // Backgrounds
    bg: {
      primary: '#0A0A0F', // Deep space black
      secondary: '#151520', // Elevated surface
      tertiary: '#1C1C28', // Card background
      glass: 'rgba(20, 20, 30, 0.7)', // Glass morphism
      overlay: 'rgba(0, 0, 0, 0.85)', // Modal overlay
    },

    // Brand Gradients
    gradient: {
      primary: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', // Purple-blue
      accent: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)', // Pink-red
      success: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)', // Cyan
      premium: 'linear-gradient(135deg, #FFD89B 0%, #19547B 100%)', // Gold-navy
      glow: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
    },

    // Accent Colors
    accent: {
      primary: '#667EEA', // Primary purple
      secondary: '#764BA2', // Deep purple
      tertiary: '#F093FB', // Pink
      gold: '#FFD89B', // Premium gold
    },

    // Text Colors
    text: {
      primary: '#FFFFFF', // Pure white
      secondary: '#A0A0B0', // Muted gray
      tertiary: '#6B6B80', // Darker gray
      disabled: '#404050', // Very dark gray
    },

    // Border Colors
    border: {
      default: 'rgba(255, 255, 255, 0.1)',
      focus: 'rgba(102, 126, 234, 0.5)',
      glass: 'rgba(255, 255, 255, 0.15)',
    },

    // Status Colors
    status: {
      success: '#4FACFE',
      error: '#F5576C',
      warning: '#FFD89B',
      info: '#667EEA',
    },
  },

  // Spacing (8px grid)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  // Border Radius
  radius: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
    full: '9999px',
  },

  // Shadows & Glows
  shadow: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
    md: '0 4px 16px rgba(0, 0, 0, 0.5)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.6)',
    xl: '0 16px 64px rgba(0, 0, 0, 0.7)',
    glow: '0 0 20px rgba(102, 126, 234, 0.4)',
    glowStrong: '0 0 40px rgba(102, 126, 234, 0.6)',
  },

  // Typography
  typography: {
    fontFamily: {
      primary:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'SF Mono, Monaco, monospace',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
      display: '48px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Animations
  animation: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
      slower: '500ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      sharp: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
    },
  },

  // Blur Effects
  blur: {
    sm: 'blur(8px)',
    md: 'blur(16px)',
    lg: 'blur(24px)',
    xl: 'blur(40px)',
  },

  // Z-index Layers
  zIndex: {
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    toast: 1400,
  },
} as const;

// Premium Glass Morphism Style
export const glassStyle = {
  background: premiumTheme.colors.bg.glass,
  backdropFilter: premiumTheme.blur.md,
  border: `1px solid ${premiumTheme.colors.border.glass}`,
  boxShadow: premiumTheme.shadow.md,
};

// Premium Button Styles
export const buttonStyles = {
  primary: {
    background: premiumTheme.colors.gradient.primary,
    color: premiumTheme.colors.text.primary,
    boxShadow: premiumTheme.shadow.glow,
  },
  secondary: {
    background: premiumTheme.colors.bg.tertiary,
    border: `1px solid ${premiumTheme.colors.border.default}`,
    color: premiumTheme.colors.text.primary,
  },
  ghost: {
    background: 'transparent',
    color: premiumTheme.colors.text.secondary,
  },
};

// Animation Keyframes
export const animations = {
  slideUp: `
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  slideDown: `
    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `,
  fadeIn: `
    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `,
  scaleIn: `
    @keyframes scaleIn {
      from {
        transform: scale(0.9);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,
  pulse: `
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }
  `,
  shimmer: `
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `,
};

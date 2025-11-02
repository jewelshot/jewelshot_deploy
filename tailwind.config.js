/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      colors: {
        theme: {
          primary: 'rgb(var(--theme-primary) / <alpha-value>)',
          'primary-dark': 'rgb(var(--theme-primary-dark) / <alpha-value>)',
          'primary-light': 'rgb(var(--theme-primary-light) / <alpha-value>)',
        },
      },
      animation: {
        fadeInSlide: 'fadeInSlide 500ms ease-out forwards',
        shimmer: 'shimmer 2s infinite',
        fadeInScale: 'fadeInScale 300ms ease-out forwards',
        'spin-slow': 'spin 3s linear infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'bounce-horizontal': 'bounce-horizontal 2s ease-in-out infinite',
        'fade-in': 'fade-in 400ms ease-in forwards',
        'fade-out': 'fade-out 300ms ease-out forwards',
      },
      keyframes: {
        fadeInSlide: {
          from: {
            opacity: '0',
            transform: 'translateX(-10px)',
          },
          to: {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        shimmer: {
          '0%': {
            transform: 'translateX(-100%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        fadeInScale: {
          from: {
            opacity: '0',
            transform: 'scale(0.95) translateY(10px)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1) translateY(0)',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(139, 92, 246, 0)',
          },
          '50%': {
            boxShadow: '0 0 20px 0 rgba(139, 92, 246, 0.4)',
          },
        },
        'bounce-horizontal': {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '50%': {
            transform: 'translateX(-12px)',
          },
        },
        'fade-in': {
          from: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          to: {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        'fade-out': {
          from: {
            opacity: '1',
            transform: 'scale(1)',
          },
          to: {
            opacity: '0',
            transform: 'scale(0.95)',
          },
        },
      },
    },
  },
  plugins: [],
};

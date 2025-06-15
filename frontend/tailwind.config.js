/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nasa-blue': '#0B3D91',
        'nasa-red': '#FC3D21',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      keyframes: {
        'slow-zoom': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'bounce-in-lg': {
          '0%, 20%, 40%, 60%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '10%': {
            transform: 'translateY(-10px)',
          },
          '30%': {
            transform: 'translateY(-5px)',
          },
          '50%': {
            transform: 'translateY(-2px)',
          },
        },
        'space-travel': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '0.7', filter: 'blur(0px)' },
          '25%': { transform: 'translateY(-30px) scale(1.1)', opacity: '0.8', filter: 'blur(5px)' },
          '50%': { transform: 'translateY(0) scale(1)', opacity: '0.7', filter: 'blur(0px)' },
          '75%': { transform: 'translateY(-15px) scale(1.05)', opacity: '0.75', filter: 'blur(2px)' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '0.7', filter: 'blur(0px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'button-glow': {
          '0%, 100%': { boxShadow: '0 0 0px rgba(11, 61, 145, 0)' },
          '50%': { boxShadow: '0 0 15px rgba(11, 61, 145, 0.6)' },
        },
        'scroll-down': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(20px)' },
        },
      },
      animation: {
        'slow-zoom': 'slow-zoom 10s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'bounce-in-lg': 'bounce-in-lg 1s ease-out',
        'space-travel': 'space-travel 30s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'button-glow': 'button-glow 2s infinite alternate',
        'scroll-down': 'scroll-down 2s ease-in-out infinite',
      },
      animationDelay: { // Custom utility for animation delays
        200: '200ms',
      }
    },
  },
  plugins: [
    plugin(function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '0 4px 8px rgba(0, 0, 0, 0.7)',
        },
        '.text-shadow-glow': {
          textShadow: '0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.6), 0 0 35px rgba(255, 255, 255, 0.4)',
        },
        '.drop-shadow-2xl': {
          filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.75))',
        },
        '.drop-shadow-3xl': {
          filter: 'drop-shadow(0 35px 35px rgba(0, 0, 0, 0.85))',
        },
      };
      addUtilities(newUtilities);
    }),
  ],
} 
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Arami Design System Colors
        surface: {
          900: '#0E062A', // Deep background (main app BG)
          800: '#130C3C', // Inner background / hero gradient center
        },
        primary: {
          600: '#6556B9', // Primary action, badge base
          400: '#846FDA', // Hover states, active buttons
        },
        accent: {
          300: '#BA9BE6', // Glyph accents, subtle borders
        },
        neutral: {
          0: '#F5EFE8', // Text on dark, base neutral
        },
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
      height: {
        'screen-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      maxWidth: {
        'mobile': '393px', // iPhone 16 Pro width
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'arami-gradient': 'radial-gradient(circle at 50% 45%, #23143e 0%, #1c1433 40%, #130c3c 70%, #0e062a 100%)',
        'badge-gradient': 'linear-gradient(135deg, #846fda 0%, #6556b9 100%)',
      },
      boxShadow: {
        'arami-glow': '0 0 20px rgba(101, 86, 185, 0.3)',
        'badge-rim': 'inset 0 0 10px rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
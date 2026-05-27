/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: '#0A0A0A',      // Matte Obsidian: Primary depth mapping
          charcoal: '#1A1A1A',   // Deep Charcoal: Containers, drawers
          accent: '#D4AF37',     // Pure Gold: Focal typography, links
          goldHover: '#F3E5AB',  // Muted Champagne: Hover state
          cream: '#F4F4F0',      // Ivory White: Editorial body texts
          neutralGray: '#8E8E8E',// Platinum Muted: Meta details, outlines
          amberHighlight: 'rgba(212, 175, 55, 0.15)', // Sensory glows
          darkGray: '#121212',   // Premium intermediate dark
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Playfair Display', 'Cinzel', 'Georgia', 'serif'],
        sans: ['Inter', 'Outfit', 'Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.15em',
        editorial: '0.25em',
      },
      boxShadow: {
        goldGlow: '0 0 15px rgba(212, 175, 55, 0.15)',
        goldGlowStrong: '0 0 25px rgba(212, 175, 55, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'slide-up': 'slideUp 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards',
        'scale-up': 'scaleUp 1.5s cubic-bezier(0.25, 1, 0.5, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}

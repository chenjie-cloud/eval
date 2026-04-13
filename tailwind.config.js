/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        retro: {
          bg: '#0a0a0a',
          cyan: '#0ff',
          pink: '#f0f',
          green: '#0f0',
          yellow: '#ff0',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      keyframes: {
        'food-glow': {
          '0%, 100%': { 
            'box-shadow': '0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(255, 0, 255, 0.3)',
            transform: 'scale(0.85)'
          },
          '50%': { 
            'box-shadow': '0 0 20px rgba(255, 0, 255, 0.9), 0 0 30px rgba(255, 0, 255, 0.6)',
            transform: 'scale(1.15)'
          },
        },
        'score-bump': {
          '0%': { transform: 'scale(1)', 'text-shadow': '0 0 5px rgba(0,255,255,0.8)' },
          '50%': { transform: 'scale(1.5)', 'text-shadow': '0 0 20px rgba(0,255,0,1)', color: '#0f0' },
          '100%': { transform: 'scale(1)', 'text-shadow': '0 0 5px rgba(0,255,255,0.8)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(15px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
      animation: {
        'food-glow': 'food-glow 1.5s ease-in-out infinite',
        'score-bump': 'score-bump 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.4s ease-out forwards',
      }
    },
  },
  plugins: [],
}


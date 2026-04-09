/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-pink': '#ff00ff',
        'cyber-blue': '#00ffff',
        'cyber-yellow': '#ffff00',
        'cyber-black': '#050505',
        'cyber-gray': '#1a1a1a',
        'cyber-green': '#00ff00',
        'cyber-purple': '#bf00ff',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        }
      },
      animation: {
        'glitch': 'glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite',
        'scanline': 'scanline 8s linear infinite'
      }
    },
  },
  plugins: [],
}
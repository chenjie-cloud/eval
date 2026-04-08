/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        neon: {
          green: "#39ff14",
          purple: "#b026ff",
          pink: "#ff007f",
          dark: "#0a0a10"
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      boxShadow: {
        'neon-green': '0 0 5px theme("colors.neon.green"), 0 0 20px theme("colors.neon.green")',
        'neon-purple': '0 0 5px theme("colors.neon.purple"), 0 0 20px theme("colors.neon.purple")',
        'neon-pink': '0 0 5px theme("colors.neon.pink"), 0 0 20px theme("colors.neon.pink")',
        'neon-green-lg': '0 0 10px theme("colors.neon.green"), 0 0 40px theme("colors.neon.green"), 0 0 80px theme("colors.neon.green")',
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 1.5s infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: 1 },
          '20%, 24%, 55%': { opacity: 0.5 },
        }
      }
    },
  },
  plugins: [],
};

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
          pink: '#ff0080',
          blue: '#00f3ff',
          green: '#39ff14'
        }
      }
    },
  },
  plugins: [],
};
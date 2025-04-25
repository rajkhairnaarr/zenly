/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F2F7ED',
          100: '#E9F0DB',
          200: '#D2E2B8',
          300: '#ACCB84',
          400: '#8FB05A',
          500: '#5A8F3F',
          600: '#497233',
          700: '#396028',
          800: '#2A481E',
          900: '#1A3012',
        },
        earth: {
          light: '#E9DFCA',
          DEFAULT: '#D3BC8D',
          dark: '#A8835B',
        },
        moss: {
          light: '#A4CCD4',
          DEFAULT: '#60A3A9',
          dark: '#396028',
        },
        clay: {
          light: '#D8B4A9',
          DEFAULT: '#BC6C50',
          dark: '#5A2F25',
        },
      },
      backgroundColor: {
        'warm-white': '#F5F2ED',
      },
    },
  },
  plugins: [],
} 
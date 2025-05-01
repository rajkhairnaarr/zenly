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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
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
        brown: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          300: '#e0cec7',
          400: '#d2bab0',
          500: '#bfa094',
          600: '#8B4513',
          700: '#7B3C11',
          800: '#6B330F',
          900: '#5B2A0D',
        },
      },
      backgroundColor: {
        'warm-white': '#F5F2ED',
      },
      spacing: {
        '96': '24rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 
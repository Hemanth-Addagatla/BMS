/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#e50914',
          dark: '#b20710',
          light: '#ff1a25',
        },
        accent: {
          DEFAULT: '#7c3aed',
          dark: '#5b21b6',
        },
        surface: {
          DEFAULT: '#141414',
          light: '#1a1a1a',
          lighter: '#252525',
          glass: 'rgba(20, 20, 20, 0.75)',
        },
        gold: '#fbbf24',
        success: '#22c55e',
        warning: '#f59e0b',
        'text-primary': '#ffffff',
        'text-secondary': '#a3a3a3',
        'text-muted': '#666666',
      },
      borderColor: {
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.06)',
          light: 'rgba(255, 255, 255, 0.12)',
        },
      },
      animation: {
        'shimmer': 'shimmer 1.8s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}

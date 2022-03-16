const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.35rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      backgroundImage: {
        'footer-wave': "url('/images/diagonalWaves.svg')",
      },
      fontFamily: {
        sans: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      width: {
        95: '21rem',
        100: '25rem',
        110: '28rem',
        115: '30rem',
      },
      colors: {
        primary: '#5A57D9',
        secondary: '#160A41',
        'scrt-background': '#2E3558',
        'input-bg': '#292929',
        gray: {
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
        black: '#0C0E10',
        darkgray: '#1B2025',
        navy: '#1F1F33',
        purple: '#5728AA',
        blue: '#2258A3',
        lightblue: '#0790C0',
        mint: '#66CED1',
        pink: '#E6074E',
      },
    },
  },
  variants: {},
  plugins: [],
};

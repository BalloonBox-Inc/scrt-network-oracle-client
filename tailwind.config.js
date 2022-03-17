const defaultTheme = require('tailwindcss/defaultTheme'); // eslint-disable-line global-require

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '0px',

      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
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
      linearBorderGradients: {
        directions: {
          // defaults to these values
          t: 'to top',
          tr: 'to top right',
          r: 'to right',
          br: 'to bottom right',
          b: 'to bottom',
          bl: 'to bottom left',
          l: 'to left',
          tl: 'to top left',
        },
        colors: {
          'purple-blue': ['#5728AA', '#2258A3'],
        },
      },
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
        black: '#191819',
        darkgray: '#1B2025',
        lightgray: '#C4C4C4',
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
  plugins: [
    require('tailwindcss-border-gradient-radius'), // eslint-disable-line global-require
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#5bb45b',
          500: '#359535',
          600: '#267926',
          700: '#1f5f1f',
          800: '#1a4d1a',
          900: '#164016',
        },
        earth: {
          50: '#faf7f2',
          100: '#f4ede0',
          200: '#e8d9c0',
          300: '#d9c097',
          400: '#c8a06d',
          500: '#bc8b4f',
          600: '#a67443',
          700: '#8a5d39',
          800: '#6f4a33',
          900: '#5a3e2c',
        },
        sky: {
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
        }
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #359535 0%, #267926 100%)',
        'gradient-earth': 'linear-gradient(135deg, #bc8b4f 0%, #8a5d39 100%)',
        'gradient-sky': 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
        'hero-pattern': 'linear-gradient(135deg, rgba(53, 149, 53, 0.9) 0%, rgba(38, 121, 38, 0.9) 100%)',
      }
    },
  },
  plugins: [],
};

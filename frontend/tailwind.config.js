/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFDFB',
          100: '#F8F8F2',
          200: '#F1EFE6',
          300: '#E6E2D4',
        },
        forest: {
          950: '#0F3024',
          900: '#174B38',
          800: '#1F5E47',
          700: '#2A7359',
          600: '#3A8C6E',
        },
        leaf: {
          600: '#4F8A5B',
          500: '#5F9E6C',
          400: '#7CB588',
          300: '#A4D1AE',
        },
        sage: {
          50: '#F2F7F2',
          100: '#DDEBDD',
          200: '#C7DEC7',
          300: '#A8CCA8',
        },
        charcoal: {
          900: '#161B16',
          800: '#202821',
          700: '#344035',
          600: '#4A5B4C',
          500: '#677D69',
          400: '#8E9F90',
        },
        warmorange: {
          500: '#E07A5F',
          600: '#C86349',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(23, 75, 56, 0.05), 0 1px 2px -1px rgba(23, 75, 56, 0.05)',
        'card': '0 4px 6px -1px rgba(23, 75, 56, 0.07), 0 2px 4px -2px rgba(23, 75, 56, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(23, 75, 56, 0.1), 0 4px 6px -4px rgba(23, 75, 56, 0.05)',
      }
    },
  },
  plugins: [],
}

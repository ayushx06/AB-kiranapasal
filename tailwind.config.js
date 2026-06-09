export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12'
        },
        nepal: {
          red: '#dc143c',
          blue: '#003893'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        nepali: ['Noto Sans Devanagari', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 12px 34px rgba(15, 23, 42, 0.08)'
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },

      backgroundImage: {
        app: 'url("/app-bg.png")',
      },

      colors: {
        gray: {
          100: '#E1E1E6',
          600: '#323238',
          800: '#202024',
          900: '#1a202c',
        },

        ignite: {
          500: '#129E57',
        },

        yellow: {
          500: '#F7DD43',
        }
      }
    },
  },
  plugins: [],
}

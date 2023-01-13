/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './scripts/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        primary_light: '#fefefe',
      },
    },
  },
  plugins: [],
}

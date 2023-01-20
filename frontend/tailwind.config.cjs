/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './scripts/**/*.{js,ts}'],
  theme: {
    extend: {
      colors: {
        primary_light: '#FEFEFE',
        primary_neutral: '#CCD7D6',
        primary_dark: '#0B132B',
        secondary: '#6066D6',
      },
      fontFamily: {
        roboto: ['Roboto', 'system-ui'],
      },
    },
  },
  plugins: [],
}

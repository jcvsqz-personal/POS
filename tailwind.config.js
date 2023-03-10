/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  safelist: [
    'bg-blue-400',
    'bg-green-400',
    'bg-red-400'
  ],
  theme: {
    extend: {
      screens: {
        'mb-s': '320px',
        'mb-m': '375px',
        'mb-l': '425px',
      },
    },
  },
  plugins: [],
}

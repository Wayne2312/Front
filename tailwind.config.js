/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Must include all files using Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
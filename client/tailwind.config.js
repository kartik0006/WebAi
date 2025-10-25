// tailwind.config.js (Your new file)

import typography from '@tailwindcss/typography'; // <-- 1. Import it

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography, // <-- 2. Use the variable here
  ],
}
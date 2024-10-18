/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    './public/**/*.html',
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};

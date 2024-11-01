import colors from 'tailwindcss/colors.js';

const aspectRatio = require('tailwindcss-aspect-ratio');

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
        extend: {
            colors: {},
        },
    },
    plugins: [colors, aspectRatio],
};

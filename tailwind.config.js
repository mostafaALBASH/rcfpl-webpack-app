/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,ts}",
    "./src/index.html"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Production optimizations
  corePlugins: {
    // Disable unused plugins for smaller CSS
    preflight: true,
  },
  // Aggressive PurgeCSS for production
  safelist: [
    // Add any dynamic classes that might be removed
    'opacity-0',
    'opacity-1',
    'ready'
  ]
};

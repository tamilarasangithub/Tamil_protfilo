export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

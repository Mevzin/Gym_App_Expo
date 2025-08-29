module.exports = {

  content: [
    "./App.tsx",
    "./src/screens/**/*.{js,jsx,ts,tsx}",
    "./src/routes/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset"), require('./nativecn-preset')],
  theme: {
    extend: {
      colors: {
        primary: "#111828",
        secondary: "#222b38",
        tertiary: "#22d3ee"
      }
    },
  },
  plugins: [],
}
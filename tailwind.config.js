/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          maroon: "#7B1113",
          maroonDark: "#520A0B",
          gold: "#F59E0B",
          goldLight: "#FDE68A",
          navy: "#0F172A",
          surface: "#F8FAFC",
        }
      },
      borderRadius: {
        'curv-xl': '2.5rem',
        'curv-2xl': '3.5rem',
      }
    },
  },
  plugins: [],
}
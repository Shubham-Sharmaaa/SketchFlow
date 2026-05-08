/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./_components/**/*.{js,ts,jsx,tsx}", // 👈 VERY IMPORTANT (your case)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

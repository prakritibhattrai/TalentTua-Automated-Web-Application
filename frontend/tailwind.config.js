/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Use 'class' strategy for toggling dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',  // This will create a custom `xs` breakpoint at 480px
      },
    },
  },
  plugins: [],
}


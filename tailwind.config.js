/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bgDark: '#12100e', // Elegant charcoal brown-black
          bgNavy: '#0c1017', // Elegant deep navy dark
          brownLight: '#dfc0a5',
          brownMedium: '#c89666',
          brownDark: '#a3704c',
          blueLight: '#a3c2de',
          blueMedium: '#4f7cac',
          blueDark: '#3a6073',
          cardBg: 'rgba(30, 26, 24, 0.4)', // Warm charcoal translucent
          cardBgBlue: 'rgba(12, 16, 23, 0.4)', // Navy translucent
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2.5s infinite',
      }
    },
  },
  plugins: [],
}

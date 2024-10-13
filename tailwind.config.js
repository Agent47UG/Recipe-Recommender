/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['"Roboto Condensed"']
      },

      colors: {
        primary: '#EBE9E1',
        darkprimary: '#E8E6D0',
        secondary: '#E43D12',
        ternary: '#FFA2B6',
        onprimary: '#EFB11D',
        grey: '#999999'
      }
    },
  },
  plugins: [],
}


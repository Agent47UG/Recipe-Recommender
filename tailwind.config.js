/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1320px',

      '2xl': '1660px',
    },

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
      },
    },
  },
  plugins: [],
}


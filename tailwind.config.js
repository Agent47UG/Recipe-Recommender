/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1320px',
      '2xl': '1660px',
    },
    extend: {
      fontFamily: {
        display: ['"Anton"', 'Impact', 'sans-serif'],
        serif: ['"Anton"', 'Impact', 'sans-serif'],
        editorial: ['"Anton"', 'Impact', 'sans-serif'],
        hand: ['"Caveat"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        roboto: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#FBEAD2',
        surface: '#FFF6E8',
        darkprimary: '#F2DEC1',
        secondary: '#EE3E31',
        sunny: '#F9C835',
        herb: '#23A455',
        peach: '#FDE0C2',
        ink: '#221C18',
        umber: '#52453C',
        stone: '#7E6F63',
        sage: '#23A455',
        ternary: '#FFA2B6',
        onprimary: '#F9C835',
        grey: '#7E6F63',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
   content: ['./src/**/*.{js,jsx,ts,tsx}'],
   theme: {
      fontSize: {
         '2xs': '0.70rem',
         xs: '0.75rem',
         sm: '0.85rem',
         md: '0.95rem',
         lg: '1.1rem',
         xl: '1.2rem',
         '2xl': '1.563rem',
         '3xl': '1.953rem',
         '4xl': '2.441rem',
         '5xl': '3.052rem',
      },
      extend: {
         backgroundImage: {
            main: "url('background.jpeg')",
         },
         colors: {
            'dark-blue': '#002255',
            blue: '#0078BC',
            'ultra-light-blue': '#e0f2fe',
            yellow: '#f5c014',
         },
         animation: {
            'fade-in': 'fade-in 500ms',
            'fade-out': 'fade-out 100ms',
         },
         keyframes: {
            'fade-in': {
               '0%': { opacity: 0 },
               '100%': { opacity: 1 },
            },
            'fade-out': {
               '0%': { opacity: 1 },
               '100%': { opacity: 0 },
            },
         },
         screens: {},
      },
   },
   plugins: [],
};

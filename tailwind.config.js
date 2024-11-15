/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'tech-dark': '#0A0B0E',
        'tech-gray': {
          50: '#F4F6FB',
          100: '#E9ECF6',
          200: '#D3D9E9',
          300: '#B8C1D9',
          400: '#9BA6C6',
          500: '#7D8BB2',
          600: '#636E96',
          700: '#4B5474',
          800: '#343B52',
          900: '#1D2231',
        },
        'tech-indigo': {
          50: '#F2F0FF',
          100: '#E6E1FF',
          200: '#CCC3FF',
          300: '#B3A4FF',
          400: '#9985FF',
          500: '#8066FF',
          600: '#6647FF',
          700: '#4D28FF',
          800: '#3309FF',
          900: '#2600DB',
        },
      },
      backgroundImage: {
        'tech-gradient': 'linear-gradient(135deg, rgba(67, 56, 202, 0.1) 0%, rgba(87, 13, 248, 0.1) 100%)',
        'camo-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h60v60H0z' fill='none'/%3E%3Cpath d='M30 30L15 15M45 45L30 30M15 45L30 30M45 15L30 30' stroke='rgba(99, 102, 241, 0.05)' stroke-width='2'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'tech': '0 0 20px rgba(99, 102, 241, 0.1)',
        'tech-lg': '0 0 30px rgba(99, 102, 241, 0.15)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx,css}',
    './pages/**/*.{js,ts,jsx,tsx,mdx,css}',
    './components/**/*.{js,ts,jsx,tsx,mdx,css}',
    './app/**/*.{js,ts,jsx,tsx,mdx,css}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: '#F8F5F0',
        espresso: '#3A2E2B',
        sand: '#D6CFC6',
        brass: '#BFA07A',
        clay: '#A28E7D',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 4px rgba(0,0,0,0.05)',
      },
      borderRadius: {
        card: '6px',
        button: '4px',
      },
    },
  },
  plugins: [],
}


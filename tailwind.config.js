/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'devanagari': ['var(--font-noto-sans-devanagari)', 'var(--font-noto-serif-devanagari)', 'serif'],
        'devanagari-serif': ['var(--font-noto-serif-devanagari)', 'serif'],
        'iast': ['Charis SIL', 'Gentium', 'Gentium Plus', 'serif'],
      },
      colors: {
        'sanskrit': {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
      },
    },
  },
  plugins: [],
}

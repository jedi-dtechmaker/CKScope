/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // CKScope dark explorer palette
        ink: '#0a0a0a',
        card: '#111111',
        cardborder: '#1f1f1f',
      },
    },
  },
  plugins: [],
};

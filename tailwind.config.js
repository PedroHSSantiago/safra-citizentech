/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safra: {
          bg: '#F7F6F1',
          card: '#FFFFFF',
          primary: '#3B6D11',
          primaryDark: '#1F3B1D',
          primaryLight: '#EAF2E2',
          accent: '#689F28',
          amber: '#EF9F27',
          amberDark: '#854F0B',
          amberBg: '#FAECD8',
          danger: '#E24B4A',
          dangerBg: '#FCE8E8',
          agro: '#534AB7',
          agroBg: '#EEEDFE',
          text: '#1A1A1A',
          muted: '#5F5E5A',
          border: '#E5E3DC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

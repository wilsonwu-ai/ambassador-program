/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#B02990',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#EECFE3',
          foreground: '#B02990',
        },
        background: '#FFFFFF',
        foreground: '#1A1A1A',
        muted: {
          DEFAULT: '#F5F5F5',
          foreground: '#6B7280',
        },
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#B02990',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
        xl: '1rem',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // The Intelligent Investor Palette
        emerald: {
          // Deep Emerald as primary
          950: '#064E3B',
          900: '#134E4A',
          800: '#155E75',
          700: '#047857',
          600: '#059669',
          500: '#10B981',
          400: '#6EE7B7',
          300: '#A7F3D0',
          200: '#D1FAE5',
          100: '#ECFDF5',
          50: '#F0FDF4',
        },
        // Neutral palette
        bone: '#FBFBFB',
        charcoal: '#1F2937',
        slate: {
          500: '#64748B',
          600: '#475569',
          700: '#334155',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 20px 50px rgba(0, 0, 0, 0.05)',
        'elegant': '0 25px 60px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
}

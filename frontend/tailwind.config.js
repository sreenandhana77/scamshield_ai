/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0a0d14', // Deep space dark background
          card: '#121824', // Card dark background
          border: '#1e293b', // Subdued border color
          accent: '#38bdf8', // Neon blue primary
          success: '#10b981', // Neon green (Safe)
          warning: '#f59e0b', // Neon yellow-orange (Suspicious)
          danger: '#ef4444', // Neon red (Dangerous)
          text: '#f8fafc', // Primary text
          textMuted: '#94a3b8' // Secondary text
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'cyber-glow': '0 0 15px rgba(56, 189, 248, 0.15)',
        'success-glow': '0 0 15px rgba(16, 185, 129, 0.2)',
        'warning-glow': '0 0 15px rgba(245, 158, 11, 0.2)',
        'danger-glow': '0 0 15px rgba(239, 68, 68, 0.2)'
      }
    },
  },
  plugins: [],
}

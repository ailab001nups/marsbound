/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#03050c',
          900: '#070b16',
          850: '#0b1122',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
        },
        mars: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        hud: {
          cyan: '#22d3ee',
          cyanGlow: '#06b6d4',
          green: '#22c55e',
          yellow: '#eab308',
          orange: '#f97316',
          red: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.45)',
        'neon-orange': '0 0 15px rgba(249, 115, 22, 0.45)',
        'neon-green': '0 0 15px rgba(34, 197, 94, 0.45)',
        'neon-red': '0 0 15px rgba(239, 68, 68, 0.45)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}

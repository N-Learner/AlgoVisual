/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ide-bg': '#1e1e2e',
        'ide-sidebar': '#181825',
        'ide-panel': '#11111b',
        'ide-border': '#313244',
        'ide-text': '#cdd6f4',
        'ide-text-muted': '#6c7086',
        'ide-accent': '#89b4fa',
        'ide-accent2': '#a6e3a1',
        'ide-warning': '#f9e2af',
        'ide-error': '#f38ba8',
        'canvas-bg': '#1a1a2e',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-highlight': 'pulseHighlight 0.6s ease-in-out infinite',
        'swap-jump': 'swapJump 0.5s ease-in-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        pulseHighlight: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.08)' },
        },
        swapJump: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-24px)' },
          '70%': { transform: 'translateY(-24px)' },
          '100%': { transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

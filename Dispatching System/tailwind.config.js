/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        // Custom colors for control room layout (High contrast)
        background: '#0a0a0a',
        surface: '#1a1a1a',
        surfaceHighlight: '#2a2a2a',
        border: '#333333',
        primary: '#3b82f6', // Bright Blue for active elements
        danger: '#ef4444', // Red for alerts
        success: '#22c55e', // Green for valid states
        warning: '#eab308', // Yellow for caution
        textMain: '#ffffff',
        textMuted: '#a3a3a3',
      },
    },
  },
  plugins: [],
}

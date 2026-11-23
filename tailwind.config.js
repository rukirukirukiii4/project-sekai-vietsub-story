/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        accent: "var(--accent)",
        "accent-fill": "var(--accent-fill)",
        "accent-ink": "var(--accent-ink)",
        "accent-text": "var(--accent-text)",
        "accent-soft": "var(--accent-soft)",
        surface: "var(--surface)",
        "surface-alt": "var(--surface-alt)",
        border: "var(--border)",
        muted: "var(--text-muted)",
      },
    },
  },
  plugins: [],
};

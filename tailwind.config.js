/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Colores del tema Canva
        primary: {
          DEFAULT: "#FF8C00", // Naranja
          light: "#FFB347",
          dark: "#CC7000",
        },
        secondary: {
          DEFAULT: "#7FFF00", // Verde neón
          light: "#A6FF4D",
          dark: "#65CC00",
        },
        accent: {
          DEFAULT: "#FF00FF", // Magenta
          light: "#FF69FF",
          dark: "#CC00CC",
        },
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F4E5B1",
          dark: "#B8941F",
        },
        // Sistema de colores adaptativos
        background: "rgb(var(--color-background) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        card: "rgb(var(--color-card) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};

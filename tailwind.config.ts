import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import containerQueries from "@tailwindcss/container-queries";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary: "#ec5b13",
        "background-light": "#f8f6f6",
        "background-dark": "#0a0a0c",
      },
      fontFamily: {
        display: ["Public Sans", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
    },
  },
  plugins: [forms, containerQueries],
} satisfies Config;

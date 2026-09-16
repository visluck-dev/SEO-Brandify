import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // shadcn semantic tokens
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },

        // Brand scales (DESIGN.md section 2)
        navy: {
          50: "#EEF2F8",
          100: "#DCE4F0",
          700: "#1B3A6B",
          800: "#112A4E",
          900: "#0B1F3A",
          950: "#081426",
        },
        teal: {
          50: "#E8F6F6",
          100: "#CCEDEE",
          500: "#14A3A5",
          600: "#14898B",
          700: "#0F7274",
        },
        ink: "#0B1F3A",
        body: "#3B4A5E",
        mist: "#F6F8FB",
        fog: "#EEF2F6",
        hairline: {
          DEFAULT: "#E3E8EF",
          strong: "#CBD5E1",
        },
        status: {
          progressing: { DEFAULT: "#0E8A5F", tint: "#E6F4EE" },
          waiting: { DEFAULT: "#B45309", tint: "#FDF1E3" },
          scheduled: { DEFAULT: "#1D4ED8", tint: "#E8EEFC" },
          neutral: { DEFAULT: "#64748B", tint: "#EEF2F6" },
        },
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        display: ["var(--font-display)"],
      },
      borderRadius: {
        sm: "0.375rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 1px 2px rgb(11 31 58 / 0.04), 0 10px 30px -12px rgb(11 31 58 / 0.10)",
        hover: "0 18px 40px -16px rgb(11 31 58 / 0.18)",
        panel: "0 20px 50px -20px rgb(11 31 58 / 0.20)",
        dashboard: "0 30px 80px -30px rgb(11 31 58 / 0.35)",
        toast: "0 12px 32px -10px rgb(11 31 58 / 0.25)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      animationTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
        drawer: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        "accordion-up": "accordion-up 0.2s cubic-bezier(0.22, 1, 0.36, 1)",
        "fade-up": "fade-up 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.22, 1, 0.36, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          150: "#f1f5f9",
          250: "#cbd5e1",
          350: "#cbd5e1",
          450: "#94a3b8",
          550: "#64748b",
          655: "#475569",
          650: "#475569",
          850: "#1e293b",
          950: "#020617",
        },
        indigo: {
          150: "#e0e7ff",
          250: "#c7d2fe",
          650: "#4f46e5",
          750: "#4338ca",
        },
        rose: {
          150: "#ffe4e6",
          250: "#fecdd3",
          450: "#fb7185",
          455: "#f43f5e",
        },
        emerald: {
          250: "#a7f3d0",
          750: "#047857",
        },
        purple: {
          750: "#7e22ce",
        }
      }
    },
  },
  plugins: [],
};

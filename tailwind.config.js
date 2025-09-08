/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        poppins: "var(--font-poppins)",
        nunito: "var(--font-nunito)",
        manrope: "var(--font-manrope)",
      },
    },
    screens: {
      //   sm: "640px",
      //   md: "768px",
      //   lg: "1024px",
      //   xl: "1280px",
      "2xl": "1440px",
    },
  },
  plugins: [],
};

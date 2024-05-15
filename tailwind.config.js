/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      colors: {
        zinc: {
          925: "#101013",
          850: "#202023",
        },
      },
      transitionTimingFunction: {
        custom: "cubic-bezier(0.39, 0.21, 0.12, 0.96)",
      },
      screens: {
        xs: "360px",
      },
      fontSize: {
        xss: ["0.70rem", "0.95rem"],
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      ggsans: ["ggsans", "sans-serif"],
      ggsansmed: ["ggsansmed", "sans-serif"],
      ggsanssemi: ["ggsanssemi", "sans-serif"],
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwind-scrollbar")],
};

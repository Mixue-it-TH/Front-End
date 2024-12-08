import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    screens: {
      mobile: { max: "320px" },
      "mobile-M": { max: "376px" },
      "mobile-L": { max: "426px" },
      tablet: { max: "768px" },
      laptop: { max: "1024px" },
      "laptop-L": { max: "1440px" },
    },
    extend: {
      fontFamily: {
        inter: "'Inter', sans-serif",
        istok: "'Istok Web', sans-serif",
        permenent: "'Permanent Marker', cursive",
        nonto: "'Noto Sans JP', 'Noto Sans Thai'",
      },
    },
  },
  plugins: [daisyui],
};

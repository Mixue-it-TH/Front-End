/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				inter: "'Inter', sans-serif",
				istok: "'Istok Web', sans-serif",
				permenent: "'Permanent Marker', cursive",
				nonto: "'Noto Sans JP', 'Noto Sans Thai'"
			}
		},
	},

	plugins: [require('daisyui')],
}

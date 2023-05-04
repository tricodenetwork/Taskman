/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Apps.{js,jsx,ts,tsx}",
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myGray: "#D9D9D9",
        myBlue: "rgba(33,46,82,.99 )",
        myRed: "#A1000E",
        Blue: "#0D037A",
        primary: "#004343",
        primary_light: "rgba(119, 230, 182, .99)",
        primary_lights: "#2DCED6",
        darkBlue: "rgba(6,1,64,.99 )",
      },
    },
  },
  plugins: [],
};

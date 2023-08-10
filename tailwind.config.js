/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./Apps.{js,jsx,ts,tsx}",
    "./index.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        myGray: "#D9D9D9",
        myBlue: "rgba(33,46,82,.99 )",
        myRed: "#A1000E",
        Blue: "#0D037A",
        primary: "#1F271B",
        primary_light: "#8AD0AB",
        primary_lights: "#2DCED6",
        darkBlue: "rgba(6,1,64,.99 )",
        Admin: "rgba(45, 206, 214, 0.15)",
        Admin2: "rgba(45, 206, 214, 0.7)",
        Admin3: "rgba(45, 206, 214, 1)",
        Supervisor: "rgba(108, 93, 211, 0.15)",
        Supervisor2: "rgba(108, 93, 211, 0.7)",
        Supervisor3: "rgba(108, 93, 211, 1)",
        Handler: "rgba(242, 153, 74, 0.15)",
        Handler2: "rgba(242, 153, 74, 0.7)",
        Handler3: "#E57310",
        Secondary: "#FEFAE0",
        Gold: "#F3C969",
        tertiary: "#40aaf4ff",
      },
    },
  },
  plugins: [],
};

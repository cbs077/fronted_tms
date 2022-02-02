module.exports = {
  content: ["./src/**/*.{html,js,ts,vue}"],
  theme: {
    extend: {
      colors: {
        "sk-orange": "#F47725",
        "sk-gray": "#7F7F7F",
        "sk-lightgray": "#BFBFBF",
        "sk-red": "#EA002C",
        "sk-teal": "#009A93",
        "option-background": "#F2F2F2",
      },
      borderWidth: {
        half: "0.5px",
      },
      minWidth: {
        sidebar: "200px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

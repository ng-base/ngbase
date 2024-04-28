/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}", "./projects/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: withOpacity("--primary"),
        muted: withOpacity("--muted"),
        gy: withOpacity("--color-gray"),
        background: withOpacity("--background"),
        foreground: withOpacity("--foreground"),
        border: withOpacity("--border"),
        lighter: withOpacity("--lighter"),
        text: withOpacity("--text"),
        input: withOpacity("--input"),
        secondary: {
          100: "#E2E2D5",
          200: "#888883",
        },
      },
      fontFamily: {
        body: ["Nunito"],
      },
    },
  },
  plugins: [],
};

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

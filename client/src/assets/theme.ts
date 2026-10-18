import { createTheme } from "@mui/material";

export const appTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "class",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#f3f2f1" },
        secondary: { main: "#2f2f2e" },

        background: {
          default: "#f1f1f9",
        },
        text: {
          primary: "#2f2f2e",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: "#2f2f2e" },
        secondary: { main: "#f3f2f1" },
        background: {
          default: "#262627",
        },
        text: {
          primary: "#fff",
        },
      },
    },
  },
  typography: {
    fontFamily: "Noto Sans, Poppins, sans-serif",
  },
});

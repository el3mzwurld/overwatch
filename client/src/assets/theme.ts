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
          default: "#262627",
          paper: "#e4e4e8",
        },
        text: {
          primary: "#fff",
        },
      },
    },
    dark: {
      palette: {
        primary: { main: "#2f2f2e" },
        secondary: { main: "#f3f2f1" },
        background: {
          default: "#f1f1f9",
          paper: "#e4e4e8",
        },
        text: {
          primary: "#fff",
        },
      },
    },
  },
});

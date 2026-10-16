import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { queryClient } from "./assets/lib/lib.ts";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { appTheme } from "./assets/theme.ts";
import { UserProvider } from "./context/user.tsx";
import { BrowserRouter } from "react-router-dom";

// render
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ThemeProvider theme={appTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
);

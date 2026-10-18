import { Box, useTheme } from "@mui/material";
import type React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
        boxSizing: "border-box",
        [theme.breakpoints.down("md")]: {
          paddingBottom: 12,
        },
      }}
    >
      {children}
    </Box>
  );
};

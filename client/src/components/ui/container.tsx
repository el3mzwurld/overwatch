import { Box } from "@mui/material";
import type React from "react";

export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflow: "auto",
        boxSizing: "border-box",
      }}
    >
      {children}
    </Box>
  );
};

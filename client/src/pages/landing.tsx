import { Box, useColorScheme, useTheme } from "@mui/material";
import { Logo } from "../components/ui/logo/logo";
import { useState } from "react";
import { MotionButton } from "../components/motioncomps";
import { DarkMode, LightMode } from "@mui/icons-material";
import { InfiniteGrid } from "../components/ui/InfiniteGrid";

const Landing = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "background.main",
      }}
    >
      {/* header */}
      <Header />

      {/* infinite grid */}
      <Box component={"main"} sx={{ width: "100%", height: "auto" }}>
        <InfiniteGrid />
      </Box>
    </Box>
  );
};

export const Header = () => {
  const { mode, setMode } = useColorScheme();
  const theme = useTheme();
  return (
    <Box
      component={"header"}
      sx={{
        width: "100%",
        px: { xs: 2 },
        minHeight: { xs: 75 },
        py: { xs: 2 },
        [theme.breakpoints.down("md")]: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        position: "relative",
      }}
    >
      <Logo />

      <MotionButton
        variant="outlined"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeIn" }}
        sx={{
          color: "text.primary",
          position: "absolute",
          right: "5%",
          top: "50%",
          transform: `translate(5%, -50%)`,
          width: { xs: 55 },
          height: { xs: 55 },
          borderRadius: "100px",
          border: "1.5px",
          borderColor: "secondary.main",
          borderStyle: "dashed",
        }}
        onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      >
        {mode === "dark" ? (
          <LightMode
            sx={{
              width: "50%",
              color: "secondary.main",
              transition: "all ease-in 0.4s",
            }}
          />
        ) : (
          <DarkMode
            sx={{
              width: "50%",
              color: "secondary.main",
              transition: "all ease-in 0.4s",
            }}
          />
        )}
      </MotionButton>
    </Box>
  );
};
export default Landing;

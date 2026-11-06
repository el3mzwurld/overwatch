import { Box, useColorScheme, useTheme } from "@mui/material";
import { Logo } from "../components/ui/logo/logo";
import { useState } from "react";
import { MotionButton } from "../components/motioncomps";
import { DarkMode, LightMode } from "@mui/icons-material";
import { InfiniteGrid } from "../components/ui/InfiniteGrid";
import { Nav } from "../components/ui/nav";

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
        px: { xs: 2, md: 10 },
        minHeight: { xs: 75, md: "3rem" },
        height: { md: "5rem" },
        py: { xs: 2 },
        [theme.breakpoints.down("md")]: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <div style={{ height: "100%", flex: 1 }}>
        <Logo />
      </div>
      <Box
        sx={{
          height: "100%",
          flex: 2,
          display: { xs: "none", md: "block" },
        }}
      >
        <Nav />
      </Box>
      <div
        style={{
          height: "auto",
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MotionButton
          variant="outlined"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
          sx={{
            color: "text.primary",
            width: { xs: 55, md: 40 },
            height: { xs: 55, md: 40 },
            borderRadius: { xs: "100px", md: "5rem" },
            border: "1.5px",
            borderColor: "secondary.main",
            borderStyle: "dashed",
            [theme.breakpoints.down("md")]: {
              position: "absolute",
              right: "5%",
              top: "50%",
              transform: `translate(5%, -50%)`,
            },
          }}
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
          {mode === "dark" ? (
            <LightMode
              sx={{
                width: { xs: "50%", md: "35%" },
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
      </div>
    </Box>
  );
};
export default Landing;

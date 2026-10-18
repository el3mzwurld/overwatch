import { Box, useColorScheme } from "@mui/material";
import logo from "/img/logo.png";
import logoAlt from "/img/logo-alt.png";
export const Logo = () => {
  const { mode } = useColorScheme();
  return (
    <Box
      sx={{ width: { xs: 50 }, height: { xs: 50 } }}
      aria-description="overwatch logo"
    >
      <img
        src={mode === "light" ? logo : logoAlt}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 100,
          transition: "1.5s ease-out",
        }}
      ></img>
    </Box>
  );
};

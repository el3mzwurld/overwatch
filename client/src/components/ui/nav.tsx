import {
  HouseRounded,
  LibraryBooksRounded,
  SearchRounded,
} from "@mui/icons-material";
import { Box, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Nav = () => {
  const theme = useTheme();
  const navigator = useNavigate();
  return (
    <Box
      role="navigation"
      sx={{
        width: "100%",
        px: { xs: 5 },
        position: { xs: "fixed" },
        [theme.breakpoints.down("md")]: {
          bottom: 0,
          left: 0,
          pb: 2.5,
          zIndex: 100000000,
          borderTop: "1px solid",
          borderTopColor: "secondary.main",
          backgroundColor: "primary.main",
        },
        minHeight: { xs: 80 },
        py: { xs: 1.5 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-evenly",
      }}
    >
      {/* icon */}
      <Box
        className="nav-ico"
        title="Home"
        onClick={() => {
          navigator("/");
        }}
      >
        <HouseRounded
          sx={{
            width: { xs: 35 },
            height: { xs: 35 },
            color: "secondary.main",
          }}
        />
      </Box>
      <Box
        className="nav-ico"
        title="Search"
        onClick={() => {
          navigator("/search");
        }}
      >
        <SearchRounded
          sx={{
            width: { xs: 35 },
            height: { xs: 35 },
            color: "secondary.main",
          }}
        />
      </Box>{" "}
      <Box
        className="nav-ico"
        title="My Library"
        onClick={() => {
          navigator("/library");
        }}
      >
        <LibraryBooksRounded
          sx={{
            width: { xs: 35 },
            height: { xs: 35 },
            color: "secondary.main",
          }}
        />
      </Box>
    </Box>
  );
};

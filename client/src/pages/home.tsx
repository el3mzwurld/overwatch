import { Outlet } from "react-router-dom";
import { Nav } from "../components/ui/nav";
import { Box } from "@mui/material";
import { Container } from "./../components/ui/container";

export const Home = () => {
  return (
    <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
      <Container>
        <Outlet />
      </Container>

      <Nav />
    </Box>
  );
};

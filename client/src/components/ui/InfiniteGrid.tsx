import { Box, Grid } from "@mui/material";
import { MotionBox } from "../motioncomps";
import { useRef, useState } from "react";
import { Book, Movie, Gamepad } from "@mui/icons-material";
import { DiscoveryCard } from "./Card";

export type Category = "films" | "books" | "games";
export const InfiniteGrid = () => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [cat, setCat] = useState<Category>("films");
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
      sx={{ width: "100%", backgroundColor: "inherit", px: { xs: 2.5 } }}
      role="grid"
    >
      {/* header */}
      <MotionBox
        className="ig-header"
        sx={{
          height: 65,
          width: "100%",
          overflow: "hidden",
          py: 0.8,
          display: "flex",
          gap: 2.5,
          justifyContent: "space-evenly",
        }}
      >
        <Box
          className={`ig-header-ico ${cat === "books" ? "active" : ""}`}
          onClick={() => setCat("books")}
          sx={{
            ":after": {
              backgroundColor: "secondary.main",
              transition: "all 0.25s ease-in",
            },
          }}
        >
          <Book />
        </Box>
        <Box
          className={`ig-header-ico ${cat === "films" ? "active" : ""}`}
          onClick={() => setCat("films")}
          sx={{
            ":after": {
              backgroundColor: "secondary.main",
              transition: "all 0.25s ease-in",
            },
          }}
        >
          <Movie />
        </Box>
        <Box
          className={`ig-header-ico ${cat === "games" ? "active" : ""}`}
          onClick={() => setCat("games")}
          sx={{
            ":after": {
              backgroundColor: "secondary.main",
              transition: "all 0.25s ease-in",
            },
          }}
        >
          <Gamepad />
        </Box>
      </MotionBox>
      {/* grid */}
      <Grid
        container
        spacing={{ xs: 1.5 }}
        sx={{ minHeight: { xs: "100vh" }, backgroundColor: "inherit", mt: 2 }}
      >
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <Grid size={{ xs: 6, sm: 4, lg: 3 }}>
              <DiscoveryCard key={index} />
            </Grid>
          ))}
      </Grid>
    </MotionBox>
  );
};

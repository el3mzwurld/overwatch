import { Box, CircularProgress, useTheme } from "@mui/material";
import { MotionBox, MotionInput, MotionStack } from "../components/motioncomps";
import { Header } from "./landing";
import { useState } from "react";
import type { Category } from "../components/ui/InfiniteGrid";

export const Search = () => {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | null>(null);
  return (
    <Box sx={{ width: "100%", minHeight: "100dvh", overflow: "hidden" }}>
      {/* header */}
      <Box
        component={"header"}
        sx={{
          width: "100%",
          minHeight: 60,
          display: "flex",
          [theme.breakpoints.down("md")]: {
            padding: 1.5,
          },
          flexDirection: "column",
          gap: 1.2,
        }}
      >
        <Header />
        <MotionInput
          placeholder="Let's find what you're looking for..."
          variant="outlined"
          type="text"
          sx={{
            input: {
              boxSizing: "border-box",
              height: { xs: 65 },
              padding: { xs: 1.25 },
              fontSize: { xs: 16, md: 18 },
              outline: "1px solid",
              outlineColor: "secondary.main",

              ":focus": {
                outline: "0.5px solid",
                transition: "all ease-in",
                transitionDuration: 0.5,
                outlineColor: "secondary.main",
              },
            },
          }}
          fullWidth
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
      </Box>
      <Box component={"main"}>
        {/* data flow => type in search query => bring up results catalogue <*xx results in category*> => click on category to filter search results */}
      </Box>
    </Box>
  );
};

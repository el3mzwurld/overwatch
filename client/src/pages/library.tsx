import { Box, Typography } from "@mui/material";
import type { Item } from "../assets/lib/types";
import { LibraryTray } from "../components/ui/LibraryTray";

const placeholderItems: Item[] = [
  {
    userId: "placeholder",
    category: "book",
    title: "The Left Hand of Darkness",
    status: "want",
    rating: 0,
    notes: "A classic science fiction novel to read next.",
    externalId: "left-hand-of-darkness",
    link: "",
  },
  {
    userId: "placeholder",
    category: "movie",
    title: "In the Mood for Love",
    status: "finished",
    rating: 9,
    notes: "A favorite rewatch.",
    externalId: "in-the-mood-for-love",
    link: "",
  },
  {
    userId: "placeholder",
    category: "game",
    title: "Journey",
    status: "in progress",
    rating: 0,
    notes: "Pick this up again soon.",
    externalId: "journey",
    link: "",
  },
];

export const Library = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 4,
      }}
    >
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: "0.16em" }}
      >
        YOUR SPACE
      </Typography>
      <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Library
      </Typography>
      <LibraryTray items={placeholderItems} />
    </Box>
  );
};

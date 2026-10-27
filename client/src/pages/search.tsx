import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { MotionInput } from "../components/motioncomps";
import { Header } from "./landing";
import { useState } from "react";
import type { Category } from "../components/ui/InfiniteGrid";
import { SearchCard } from "../components/ui/Card";
import { UseBookSearch } from "../hooks/useBookSearch";
import { useFilmSearch } from "../hooks/useFilmSearch";
import { useGameSearch } from "../hooks/useGameSearch";

export const Search = () => {
  const theme = useTheme();
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | null>(null);
  const books = UseBookSearch(query);
  const films = useFilmSearch(query);
  const games = useGameSearch(query);
  const hasQuery = query.trim().length > 1;
  const isSearching =
    hasQuery && (books.isPending || films.isPending || games.isPending);

  const categories: { category: Category; count: number }[] = [
    { category: "films", count: films.items.length },
    { category: "books", count: books.books.length },
    { category: "games", count: games.gameSearchResults.length },
  ];

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
        <div>
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
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </Box>
      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 2, sm: 3 },
          pb: { xs: 12, md: 4 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: isSearching || !hasQuery ? "center" : "flex-start",
            py: { xs: 3, sm: 4 },
          }}
        >
          {!hasQuery ? (
            <Typography color="text.secondary" sx={{ textAlign: "center" }}>
              Enter at least two characters to search.
            </Typography>
          ) : isSearching ? (
            <Box sx={{ display: "grid", placeItems: "center", flex: 1 }}>
              <CircularProgress color="secondary" aria-label="Searching" />
            </Box>
          ) : cat === null ? (
            <Stack spacing={2}>
              <Typography component="h1" variant="h5" sx={{ fontWeight: 600 }}>
                Results by category
              </Typography>
              <Grid container spacing={1.5}>
                {categories.map(({ category, count }) => (
                  <Grid key={category} size={{ xs: 12, sm: 4 }}>
                    <SearchCard
                      mode="category"
                      resultNumber={count}
                      caegory={category}
                      onClick={setCat}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography
                  component="h1"
                  variant="h5"
                  sx={{ fontWeight: 600 }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Typography>
                <Button
                  onClick={() => setCat(null)}
                  sx={{ textTransform: "none", color: "error.main" }}
                >
                  All categories
                </Button>
              </Stack>
              {cat === "films" && films.items.length > 0 && (
                <Grid container spacing={1.5}>
                  {films.items.map((film) => (
                    <Grid key={film.externalId} size={{ xs: 12, sm: 6, md: 4 }}>
                      <SearchCard mode="result" cardData={film} />
                    </Grid>
                  ))}
                </Grid>
              )}
              {cat === "books" && books.books.length > 0 && (
                <Grid container spacing={1.5}>
                  {books.books.map((book) => (
                    <Grid key={book.externalId} size={{ xs: 12, sm: 6, md: 4 }}>
                      <SearchCard mode="result" cardData={book} />
                    </Grid>
                  ))}
                </Grid>
              )}
              {cat === "games" && games.gameSearchResults.length > 0 && (
                <Grid container spacing={1.5}>
                  {games.gameSearchResults.map((game) => (
                    <Grid key={game.externalId} size={{ xs: 12, sm: 6, md: 4 }}>
                      <SearchCard mode="result" cardData={game} />
                    </Grid>
                  ))}
                </Grid>
              )}
              {((cat === "films" && films.error) ||
                (cat === "books" && books.error) ||
                (cat === "games" && games.error)) && (
                <Alert severity="error">Search failed. Please try again.</Alert>
              )}
              {((cat === "films" && films.items.length === 0 && !films.error) ||
                (cat === "books" && books.books.length === 0 && !books.error) ||
                (cat === "games" &&
                  games.gameSearchResults.length === 0 &&
                  !games.error)) && (
                <Typography color="text.secondary">
                  No results found in this category.
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Box>
  );
};

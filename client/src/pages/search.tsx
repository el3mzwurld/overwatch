import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowBackRounded, SearchRounded } from "@mui/icons-material";
import { MotionInput } from "../components/motioncomps";
import { Header } from "./landing";
import { useState } from "react";
import type { Category } from "../components/ui/InfiniteGrid";
import { SearchCard } from "../components/ui/Card";
import { UseBookSearch } from "../hooks/useBookSearch";
import { useFilmSearch } from "../hooks/useFilmSearch";
import { useGameSearch } from "../hooks/useGameSearch";
export const Search = () => {
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
    <Box
      sx={{
        width: "100%",
        minHeight: "100dvh",
        bgcolor: "background.default",
        pb: { xs: 12, md: 5 },
      }}
    >
      <Header />

      <Box
        component="section"
        aria-labelledby="search-title"
        sx={{
          maxWidth: 1120,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 3, sm: 5, md: 7 },
          pb: { xs: 3, sm: 5 },
        }}
      >
        <Stack spacing={{ xs: 2.5, sm: 3 }} sx={{ maxWidth: 760 }}>
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "text.secondary", letterSpacing: "0.14em" }}
            >
              DISCOVER SOMETHING NEW
            </Typography>
            <Typography
              id="search-title"
              component="h1"
              variant="h3"
              sx={{
                mt: 0.5,
                fontSize: { xs: "2rem", sm: "2.75rem", md: "3.25rem" },
                fontWeight: 700,
                lineHeight: 1.12,
                letterSpacing: "-0.04em",
              }}
            >
              What are you looking for?
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mt: 1, fontSize: { xs: "0.95rem", sm: "1.05rem" } }}
            >
              Search films, books, and games all in one place.
            </Typography>
          </Box>
          <MotionInput
            placeholder="Let's find what you're looking for..."
            variant="outlined"
            type="text"
            slotProps={{
              htmlInput: { "aria-label": "Search films, books, and games" },
            }}
            sx={{
              width: "100%",
              maxWidth: 700,
              "& .MuiOutlinedInput-root": {
                minHeight: { xs: 56, sm: 64 },
                borderRadius: 3,
                bgcolor: "background.paper",
                boxShadow: "0 8px 28px rgba(0, 0, 0, 0.06)",
                "& fieldset": { borderColor: "divider" },
                "&:hover fieldset": { borderColor: "text.secondary" },
                "&.Mui-focused fieldset": { borderColor: "secondary.main" },
              },
              "& input": {
                fontSize: { xs: "0.95rem", sm: "1.05rem" },
                py: 1.75,
              },
            }}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Stack>
      </Box>

      <Box
        component="main"
        sx={{
          width: "100%",
          maxWidth: 1120,
          mx: "auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            minHeight: { xs: 180, sm: 220 },
            py: { xs: 2, sm: 3 },
          }}
        >
          {!hasQuery ? (
            <Box
              sx={{
                p: { xs: 2.5, sm: 3.5 },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                bgcolor: "background.paper",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Your next favorite is a search away
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                Enter at least two characters to explore matching films, books,
                and games.
              </Typography>
            </Box>
          ) : isSearching ? (
            <Box
              role="status"
              sx={{
                minHeight: 220,
                display: "grid",
                placeContent: "center",
                justifyItems: "center",
                gap: 1.5,
              }}
            >
              <CircularProgress color="secondary" aria-label="Searching" />
              <Typography color="text.secondary">Searching...</Typography>
            </Box>
          ) : cat === null ? (
            <Stack spacing={{ xs: 1.5, sm: 2 }}>
              <Typography component="h2" variant="h5" sx={{ fontWeight: 600 }}>
                Browse results by category
              </Typography>
              <Grid container spacing={{ xs: 1.25, sm: 2 }}>
                {categories.map(({ category, count }) => (
                  <Grid key={category} size={{ xs: 12, sm: 6, md: 4 }}>
                    <SearchCard
                      mode="category"
                      resultNumber={count}
                      category={category}
                      onClick={setCat}
                    />
                  </Grid>
                ))}
              </Grid>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 1, sm: 2 }}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <Typography
                  component="h2"
                  variant="h5"
                  sx={{ fontWeight: 600 }}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Typography>
                <Button
                  onClick={() => setCat(null)}
                  startIcon={<ArrowBackRounded />}
                  sx={{
                    textTransform: "none",
                    px: 0,
                    color: "text.secondary",
                    "&:hover": {
                      color: "text.primary",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  All categories
                </Button>
              </Stack>
              {cat === "films" && films.items.length > 0 && (
                <Grid container spacing={{ xs: 1.25, sm: 2 }}>
                  {films.items.map((film) => (
                    <Grid key={film.externalId} size={{ xs: 12, sm: 6, md: 4 }}>
                      <SearchCard mode="result" cardData={film} />
                    </Grid>
                  ))}
                </Grid>
              )}
              {cat === "books" && books.books.length > 0 && (
                <Grid container spacing={{ xs: 1.25, sm: 2 }}>
                  {books.books.map((book) => (
                    <Grid key={book.externalId} size={{ xs: 12, sm: 6, md: 4 }}>
                      <SearchCard mode="result" cardData={book} />
                    </Grid>
                  ))}
                </Grid>
              )}
              {cat === "games" && games.gameSearchResults.length > 0 && (
                <Grid container spacing={{ xs: 1.25, sm: 2 }}>
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

import {
  ArrowBackRounded,
  OpenInNewRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { Book, Film, Game } from "../../assets/lib/types";
import placeholder from "/img/logo-alt.png";

type ContentData = Book | Film | Game;

type ContentPageProps = {
  content: ContentData;
  onBack?: () => void;
};

const getTitle = (content: ContentData) =>
  content.category === "game" ? content.name : content.title;

const getImage = (content: ContentData) => {
  if (content.category === "game") {
    return content.image || placeholder;
  }
  if (content.category === "book") {
    if (Array.isArray(content.images)) {
      return content.images[0] || placeholder;
    }
    if (typeof content.images === "string") {
      return content.images || placeholder;
    }
    return content.images?.thumbnail || placeholder;
  }
  return content.posterUrl || placeholder;
};

const getReleaseDate = (content: ContentData) =>
  content.category === "book" ? content.publishDate : content.releaseDate;

const getDescription = (content: ContentData) => {
  if (content.category === "book") return content.bookDesc;
  if (content.category === "game") return "";
  return content.overview;
};

const getRating = (content: ContentData) => {
  if (content.category === "game") {
    return content.analytics.averageRating
      ? `${content.analytics.averageRating.toFixed(1)} / 5`
      : null;
  }
  if (content.category === "book") {
    return content.metadata.averageRating
      ? `${content.metadata.averageRating.toFixed(1)} / 5`
      : null;
  }
  return content.metadata.voteAverage
    ? `${content.metadata.voteAverage.toFixed(1)} / 10`
    : null;
};

const getGenres = (content: ContentData) => {
  if (content.category === "game") {
    return content.genres.map((genre) => genre.name);
  }
  if (content.category === "book") {
    return content.genres;
  }
  return content.metadata.genreIds.map((id) => `Genre ${id}`);
};

export const ContentPage = ({ content, onBack }: ContentPageProps) => {
  const title = getTitle(content);
  const description = getDescription(content);
  const rating = getRating(content);
  const genres = getGenres(content);
  const externalUrl =
    content.category === "book" || content.category === "movie" || content.category === "tv"
      ? content.externalUrl
      : undefined;

  return (
    <Box component="main" sx={{ width: "100%", maxWidth: 1000, mx: "auto", p: { xs: 2, sm: 3, md: 4 } }}>
      {onBack && (
        <Button
          onClick={onBack}
          startIcon={<ArrowBackRounded />}
          sx={{ mb: 2, px: 0, textTransform: "none" }}
        >
          Back
        </Button>
      )}

      <Paper
        variant="outlined"
        sx={{ overflow: "hidden", borderRadius: 0, bgcolor: "background.default" }}
      >
        <Stack direction={{ xs: "column", md: "row" }}>
          <Box
            component="img"
            src={getImage(content)}
            alt={`${title} cover`}
            sx={{
              display: "block",
              width: { xs: "100%", md: 320 },
              height: { xs: 280, sm: 360, md: 440 },
              objectFit: "cover",
              bgcolor: "action.hover",
            }}
          />

          <Stack spacing={2.5} sx={{ flex: 1, minWidth: 0, p: { xs: 2.5, sm: 4 } }}>
            <Box>
              <Chip
                size="small"
                variant="outlined"
                label={content.category === "tv" ? "TV" : content.category}
                sx={{ mb: 1.5, textTransform: "capitalize" }}
              />
              <Typography
                component="h1"
                variant="h4"
                sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
              >
                {title}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 0.75 }}>
                {getReleaseDate(content) || "Release date unavailable"}
              </Typography>
            </Box>

            {rating && (
              <Typography variant="body2" color="text.secondary">
                Rating · {rating}
              </Typography>
            )}

            {genres.length > 0 && (
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
                {genres.map((genre) => (
                  <Chip key={genre} label={genre} size="small" />
                ))}
              </Stack>
            )}

            <Divider />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                About
              </Typography>
              <Typography
                color={description ? "text.primary" : "text.secondary"}
                sx={{ whiteSpace: "pre-line", lineHeight: 1.75 }}
              >
                {description || "No description available yet."}
              </Typography>
            </Box>

            {externalUrl && (
              <Button
                href={externalUrl}
                target="_blank"
                rel="noreferrer"
                variant="outlined"
                endIcon={<OpenInNewRounded />}
                sx={{ alignSelf: "flex-start", borderRadius: 0, mt: "auto" }}
              >
                More information
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

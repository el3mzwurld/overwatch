import {
  AddRounded,
  ArrowBackRounded,
  CalendarMonthRounded,
  OpenInNewRounded,
  StarRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import type { Book, FullMovie, FullTvShow, Game } from "../../assets/lib/types";
import placeholder from "/img/logo-alt.png";
import useLibrary from "../../hooks/useLibrary";
import { BookContent } from "./BookContent";
import { FilmContent } from "./FilmContent";
import { GameContent } from "./GameContent";
import { Navigate, useNavigate } from "react-router-dom";

type ContentData = Book | FullMovie | FullTvShow | Game;
type LibraryStatus = "want" | "in progress" | "finished";

type ContentPageProps = {
  content: ContentData;
  onBack?: () => void;
};

const getTitle = (content: ContentData) =>
  content.category === "game" ? content.name : content.title;

const getImage = (content: ContentData) => {
  if (content.category === "game") return content.image || placeholder;
  if (content.category === "book") {
    if (Array.isArray(content.images)) return content.images[0] || placeholder;
    if (typeof content.images === "string") {
      return content.images.includes("undefined")
        ? placeholder
        : content.images;
    }
    if (content.images?.thumbnail) {
      return content.images.thumbnail.includes("undefined")
        ? placeholder
        : content.images.thumbnail;
    }
    return placeholder;
  }
  return content.posterUrl || placeholder;
};

const getReleaseDate = (content: ContentData) =>
  content.category === "book" ? content.publishDate : content.releaseDate;

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
  const metadata =
    (content as FullMovie & { metadata?: FullMovie["metaData"] }).metadata ??
    content.metaData;
  return metadata?.voteAverage
    ? `${metadata.voteAverage.toFixed(1)} / 10`
    : null;
};

const getGenres = (content: ContentData): string[] => {
  if (content.category === "game") {
    return content.genres.map((genre) => genre.name);
  }
  if (content.category === "book") return content.genres.slice(0, 4);
  const metadata =
    (content as FullMovie & { metadata?: FullMovie["metaData"] }).metadata ??
    content.metaData;
  return metadata?.genres?.map((genre) => genre.name) ?? [];
};

const getLibraryId = (content: ContentData) =>
  content.category === "game" ? content.slug : content.externalId;

const getExternalUrl = (content: ContentData) =>
  content.category === "game"
    ? `https://rawg.io/games/${content.slug}`
    : content.externalUrl;

export const ContentPage = ({ content, onBack }: ContentPageProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [status, setStatus] = useState<LibraryStatus>("want");
  const title = getTitle(content);
  const image = getImage(content);
  const rating = getRating(content);
  const genres = getGenres(content);
  const { isInLibrary, addToLibrary } = useLibrary();
  const alreadyInLibrary = isInLibrary(title, getLibraryId(content));
  console.log(content);
  const nav = useNavigate();

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        maxWidth: 1320,
        mx: "auto",
        px: { xs: 1.5, sm: 3, lg: 4 },
        pb: { xs: 4, md: 6 },
      }}
    >
      {onBack && (
        <Button
          onClick={onBack}
          startIcon={<ArrowBackRounded />}
          sx={{ mb: { xs: 1.5, sm: 2 }, px: 0, textTransform: "none" }}
        >
          Back
        </Button>
      )}

      <Paper
        elevation={0}
        sx={{
          position: "relative",
          isolation: "isolate",
          overflow: "hidden",
          minHeight: { xs: 290, sm: 350, md: 410 },
          borderRadius: { xs: 2.5, sm: 4 },
          color: "#fff",
          bgcolor: "#242321",
          backgroundImage: `linear-gradient(90deg, rgba(20,19,18,.96) 0%, rgba(20,19,18,.82) 52%, rgba(20,19,18,.42) 100%), url("${image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            zIndex: -1,
            backdropFilter: "blur(2px)",
          },
        }}
      >
        <Stack
          direction={{ xs: "row", sm: "row" }}
          spacing={{ xs: 2, sm: 3, md: 4 }}
          sx={{
            minHeight: { xs: 290, sm: 350, md: 410 },
            p: { xs: 2, sm: 3.5, md: 5 },
            background:
              "linear-gradient(0deg, rgba(20,19,18,.56), transparent 70%)",
            alignItems: "center",
          }}
        >
          <Box
            component="img"
            src={image}
            alt={`${title} cover`}
            onError={(event) => {
              event.currentTarget.src = placeholder;
            }}
            sx={{
              display: "block",
              flexShrink: 0,
              width: { xs: 104, sm: 170, md: 225 },
              height: { xs: 156, sm: 255, md: 338 },
              objectFit: "cover",
              borderRadius: { xs: 1.5, sm: 2 },
              bgcolor: "rgba(255,255,255,.1)",
              boxShadow: "0 16px 42px rgba(0,0,0,.4)",
            }}
          />
          <Stack
            spacing={{ xs: 1.25, sm: 2 }}
            sx={{ minWidth: 0, maxWidth: 760 }}
          >
            <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap" }}>
              <Chip
                size="small"
                label={
                  content.category === "tv" ? "TV series" : content.category
                }
                sx={{
                  bgcolor: "rgba(255,255,255,.14)",
                  color: "inherit",
                  textTransform: "capitalize",
                }}
              />
              {content.category === "game" && content.esrbRating?.name && (
                <Chip
                  size="small"
                  label={`ESRB ${content.esrbRating.name}`}
                  sx={{ bgcolor: "rgba(255,255,255,.14)", color: "inherit" }}
                />
              )}
            </Stack>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.55rem", sm: "2.5rem", md: "3.25rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                overflowWrap: "anywhere",
                textWrap: "balance",
              }}
            >
              {title}
            </Typography>
            {content.category === "book" && content.authors.length > 0 && (
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: "0.95rem", sm: "1.2rem" },
                  opacity: 0.88,
                }}
              >
                by {content.authors}
              </Typography>
            )}
            <Stack
              direction="row"
              spacing={{ xs: 0.75, sm: 1.25 }}
              sx={{
                color: "rgba(255,255,255,.82)",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              {getReleaseDate(content) && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: "center" }}
                >
                  <CalendarMonthRounded sx={{ fontSize: 18 }} />
                  <Typography variant="body2">
                    {getReleaseDate(content)}
                  </Typography>
                </Stack>
              )}
              {rating && (
                <Stack
                  direction="row"
                  spacing={0.5}
                  sx={{ alignItems: "center" }}
                >
                  <StarRounded sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{rating}</Typography>
                </Stack>
              )}
            </Stack>
            {genres.length > 0 && (
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ pt: 0.25, flexWrap: "wrap" }}
              >
                {genres.map((genre) => (
                  <Chip
                    key={genre}
                    label={genre}
                    size="small"
                    variant="outlined"
                    sx={{
                      color: "inherit",
                      borderColor: "rgba(255,255,255,.32)",
                      bgcolor: "rgba(0,0,0,.12)",
                    }}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Paper>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1.25}
        sx={{ my: 2.5 }}
      >
        {alreadyInLibrary ? (
          <Button
            variant="contained"
            sx={{ borderRadius: 2, textTransform: "none", py: 1.25 }}
            onClick={() => {
              nav("/library");
            }}
          >
            View in library
          </Button>
        ) : (
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            variant="contained"
            startIcon={<AddRounded />}
            sx={{ borderRadius: 2, textTransform: "none", py: 1.25 }}
          >
            Add to library
          </Button>
        )}
        <Button
          href={getExternalUrl(content)}
          target="_blank"
          rel="noreferrer"
          variant="outlined"
          endIcon={<OpenInNewRounded />}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            color: "text.primary",
            borderColor: "divider",
            py: 1.25,
          }}
        >
          More information
        </Button>
      </Stack>

      {content.category === "book" ? (
        <BookContent content={content} />
      ) : content.category === "game" ? (
        <GameContent content={content} />
      ) : (
        <FilmContent content={content} />
      )}

      <Dialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="add-to-library-title"
      >
        <DialogTitle id="add-to-library-title">Add to your library</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Let&apos;s know where you&apos;re on with {title}.
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="library-status-label">Status</InputLabel>
            <Select<LibraryStatus>
              labelId="library-status-label"
              id="library-status"
              value={status}
              label="Status"
              onChange={(event) => setStatus(event.target.value)}
            >
              <MenuItem value="want">Want</MenuItem>
              <MenuItem value="in progress">In progress</MenuItem>
              <MenuItem value="finished">Finished</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setIsAddDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              addToLibrary(content, status);
              setIsAddDialogOpen(false);
            }}
            sx={{ textTransform: "none" }}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

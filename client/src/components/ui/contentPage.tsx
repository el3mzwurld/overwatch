import {
  AddRounded,
  ArrowBackRounded,
  OpenInNewRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Divider,
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
import { MovieGenreMapper, TVGenreMapper } from "../../assets/lib/utils";
import useLibrary from "../../hooks/useLibrary";
import { useUser } from "../../context/user";

type ContentData = Book | FullMovie | FullTvShow | Game;
type LibraryStatus = "want" | "in progress" | "finished";

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
      return content.images[0] ?? placeholder;
    }
    if (typeof content.images === "string") {
      return content.images ?? placeholder;
    }
    return content.images?.thumbnail ?? placeholder;
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
  return content.metaData?.genres.map((gen) => gen.name);
};

const getId = (content: ContentData) => {
  if (content.category === "game") return content.slug;

  return content.externalId;
};

export const ContentPage = ({ content, onBack }: ContentPageProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [status, setStatus] = useState<LibraryStatus>("want");
  const title = getTitle(content);
  const description = getDescription(content);
  const rating = getRating(content);
  const genres = getGenres(content) ?? [];
  const externalUrl =
    content.category === "book"
      ? content.externalUrl
      : content.category === "game"
        ? undefined
        : content.externalUrl;
  console.log(title);
  const { isInLibrary, addToLibrary } = useLibrary();
  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        maxWidth: 1120,
        mx: "auto",
        p: { xs: 1.5, sm: 3, md: 4 },
      }}
    >
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
        sx={{
          overflow: "hidden",
          borderRadius: { xs: 2, sm: 3 },
          bgcolor: "background.paper",
        }}
      >
        <Stack direction={{ xs: "column", md: "row" }}>
          <Box
            component="img"
            src={getImage(content)}
            alt={`${title} cover`}
            sx={{
              display: "block",
              width: { xs: "100%", md: 320 },
              height: { xs: 240, sm: 340, md: 460 },
              objectFit: "cover",
              bgcolor: "action.hover",
            }}
          />

          <Stack
            spacing={{ xs: 2, sm: 2.5 }}
            sx={{ flex: 1, minWidth: 0, p: { xs: 2, sm: 3, md: 4 } }}
          >
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
                sx={{
                  fontSize: { xs: "1.75rem", sm: "2.125rem" },
                  fontWeight: 600,
                  overflowWrap: "anywhere",
                }}
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

            {genres && genres.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{ flexWrap: "wrap" }}
              >
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

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              useFlexGap
              sx={{ mt: "auto", pt: 1, flexWrap: "wrap" }}
            >
              {isInLibrary(title, getId(content)) ? (
                <Button
                  variant="contained"
                  startIcon={<AddRounded />}
                  sx={{
                    alignSelf: { sm: "flex-start" },
                    borderRadius: 2,
                    textTransform: "none",
                    py: 1.5,
                  }}
                >
                  View In Library
                </Button>
              ) : (
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  variant="contained"
                  startIcon={<AddRounded />}
                  sx={{
                    alignSelf: { sm: "flex-start" },
                    borderRadius: 2,
                    textTransform: "none",
                    py: 1.5,
                  }}
                >
                  Add to library
                </Button>
              )}
              {externalUrl && (
                <Button
                  href={externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlined"
                  endIcon={<OpenInNewRounded />}
                  sx={{
                    alignSelf: { sm: "flex-start" },
                    borderRadius: 2,
                    textTransform: "none",
                    color: "text.primary",
                    borderColor: "divider",
                    py: 1.5,
                  }}
                >
                  More information
                </Button>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Paper>

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
            Let's know where you're on with {title}.
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

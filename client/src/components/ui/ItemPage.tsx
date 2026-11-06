import type { ReactNode } from "react";
import {
  ArrowBackRounded,
  AutoStoriesRounded,
  CheckCircleRounded,
  GamepadRounded,
  LocalMoviesRounded,
  OpenInNewRounded,
  PauseCircleRounded,
  RemoveCircleRounded,
  TvRounded,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Item } from "../../assets/lib/types";
import useLibrary from "../../hooks/useLibrary";
import { Header } from "../../pages/landing";

type ItemPageProps = {
  item?: Item;
};

const categoryDetails = {
  book: { label: "Book", icon: <AutoStoriesRounded />, color: "#7b61a8" },
  game: { label: "Game", icon: <GamepadRounded />, color: "#397d74" },
  movie: { label: "Film", icon: <LocalMoviesRounded />, color: "#a75b48" },
  tv: { label: "TV series", icon: <TvRounded />, color: "#5275a2" },
} satisfies Record<
  Item["category"],
  { label: string; icon: ReactNode; color: string }
>;

const statusDetails = {
  want: {
    label: "Want to explore",
    color: "#5275a2",
    background: "rgba(82, 117, 162, 0.12)",
    icon: <PauseCircleRounded />,
  },
  "in progress": {
    label: "In progress",
    color: "#a77825",
    background: "rgba(167, 120, 37, 0.14)",
    icon: <PauseCircleRounded />,
  },
  finished: {
    label: "Finished",
    color: "#4b8061",
    background: "rgba(75, 128, 97, 0.14)",
    icon: <CheckCircleRounded />,
  },
  dropped: {
    label: "Dropped",
    color: "#a95858",
    background: "rgba(169, 88, 88, 0.13)",
    icon: <RemoveCircleRounded />,
  },
} satisfies Record<
  Item["status"],
  { label: string; color: string; background: string; icon: ReactNode }
>;

export const ItemPage = ({ item: providedItem }: ItemPageProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { library, isPending, isLoading } = useLibrary();
  const item =
    providedItem ?? library.find((entry) => entry.externalId === (id ?? ""));
  const [isNotesEditable, setIsNotesEditable] = useState(false);
  const [notes, setNotes] = useState(item?.notes ?? "");
  const [rating, setRating] = useState(item?.rating ? String(item.rating) : "");

  useEffect(() => {
    setNotes(item?.notes ?? "");
    setRating(item?.rating ? String(item.rating) : "");
    setIsNotesEditable(false);
  }, [item?.externalId, item?.notes, item?.rating]);

  const goToLibrary = () => navigate("/library");

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 1200,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 3,
      }}
    >
      <Header />
      <Box component="main" sx={{ mt: { xs: 2.5, sm: 4 } }}>
        <Button
          onClick={goToLibrary}
          startIcon={<ArrowBackRounded />}
          sx={{ mb: 2, px: 0, textTransform: "none", color: "text.primary" }}
        >
          Back to library
        </Button>

        {isPending || isLoading ? (
          <Stack alignItems="center" spacing={2} sx={{ py: 10 }}>
            <CircularProgress />
            <Typography color="text.secondary">
              Loading your library item…
            </Typography>
          </Stack>
        ) : !item ? (
          <Paper
            variant="outlined"
            sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", borderRadius: 3 }}
          >
            <Typography
              component="h1"
              variant="h5"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              Item not found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5 }}>
              This item may have been removed from your library.
            </Typography>
            <Button variant="contained" onClick={goToLibrary}>
              Return to library
            </Button>
          </Paper>
        ) : (
          <Stack spacing={2.5}>
            <Paper
              variant="outlined"
              sx={{ overflow: "hidden", borderRadius: { xs: 3, sm: 4 } }}
            >
              <Stack direction={{ xs: "column", sm: "row" }}>
                <Box
                  sx={{
                    width: { xs: "100%", sm: 190, md: 240 },
                    minHeight: { xs: 100, sm: 270 },
                    flexShrink: 0,
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    bgcolor: categoryDetails[item.category].color,
                    "& svg": { fontSize: { xs: 44, sm: 64 } },
                  }}
                  aria-hidden="true"
                >
                  {categoryDetails[item.category].icon}
                </Box>
                <Stack
                  spacing={2}
                  sx={{ p: { xs: 2.5, sm: 3.5 }, minWidth: 0, flex: 1 }}
                >
                  <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
                    <Chip
                      label={categoryDetails[item.category].label}
                      variant="outlined"
                    />
                    <Chip
                      icon={statusDetails[item.status].icon}
                      label={statusDetails[item.status].label}
                      sx={{
                        color: statusDetails[item.status].color,
                        bgcolor: statusDetails[item.status].background,
                        "& .MuiChip-icon": { color: "inherit" },
                      }}
                    />
                  </Stack>
                  <Typography
                    component="h1"
                    variant="h3"
                    sx={{
                      fontSize: { xs: "1.75rem", sm: "2.5rem" },
                      fontWeight: 800,
                      lineHeight: 1.15,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={{ xs: 0.5, sm: 2 }}
                  >
                    <Typography color="text.secondary">
                      {item.rating > 0
                        ? `Your rating · ${item.rating}/10`
                        : "You haven't rated this item yet"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Library ID · {item.externalId}
                    </Typography>
                  </Stack>
                  {item.link && (
                    <Button
                      component="a"
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      variant="contained"
                      endIcon={<OpenInNewRounded />}
                      sx={{
                        alignSelf: { sm: "flex-start" },
                        mt: 0.5,
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      Open external page
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Paper>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "minmax(0, 1.5fr) minmax(260px, 1fr)",
                },
                gap: 2.5,
              }}
            >
              <Paper
                variant="outlined"
                sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3 }}
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    mb: 1.5,
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: { xs: 1.5 },
                  }}
                >
                  <Typography
                    component="h2"
                    variant="h6"
                    sx={{ fontWeight: 600 }}
                  >
                    Your notes
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => setIsNotesEditable((editable) => !editable)}
                    sx={{
                      textTransform: "none",
                      flexShrink: 0,
                      backgroundColor: isNotesEditable
                        ? "lightgreen"
                        : "orange",
                    }}
                  >
                    {isNotesEditable ? "Done" : "Edit"}
                  </Button>
                </Stack>
                <TextField
                  fullWidth
                  multiline
                  minRows={5}
                  maxRows={14}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Add your thoughts about this item..."
                  aria-label="Item notes"
                  slotProps={{
                    htmlInput: {
                      readOnly: !isNotesEditable,
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": { alignItems: "flex-start" },
                    "& .MuiInputBase-input.Mui-readOnly": {
                      cursor: "default",
                      color: "text.secondary",
                    },
                  }}
                />
              </Paper>

              <Paper
                variant="outlined"
                sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3 }}
              >
                <Typography
                  component="h2"
                  variant="h6"
                  fontWeight={700}
                  sx={{ mb: 1.5 }}
                >
                  Item information
                </Typography>
                <FormControl fullWidth sx={{ mb: 2.5 }}>
                  <InputLabel id="item-rating-label">Your rating</InputLabel>
                  <Select
                    labelId="item-rating-label"
                    id="item-rating"
                    value={rating}
                    label="Your rating"
                    onChange={(event) => setRating(event.target.value)}
                  >
                    <MenuItem value="">Not rated</MenuItem>
                    {Array.from({ length: 10 }, (_, index) => index + 1).map(
                      (value) => (
                        <MenuItem key={value} value={String(value)}>
                          {value} / 10
                        </MenuItem>
                      ),
                    )}
                  </Select>
                </FormControl>
                <Typography
                  component="h3"
                  variant="subtitle2"
                  fontWeight={700}
                  sx={{ mb: 1 }}
                >
                  Item actions
                </Typography>
                <Alert severity="info" sx={{ mb: 2 }}>
                  Changes are for display only and aren&apos;t saved yet.
                </Alert>
                <Stack spacing={1} sx={{ color: "text.primary" }}>
                  <Button disabled variant="outlined" fullWidth>
                    Change status
                  </Button>
                  <Button disabled color="error" variant="outlined" fullWidth>
                    Remove from library
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Stack>
        )}
      </Box>
    </Box>
  );
};

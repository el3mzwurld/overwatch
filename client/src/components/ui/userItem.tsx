import type { ReactNode } from "react";
import {
  ArrowForwardRounded,
  AutoStoriesRounded,
  CheckCircleRounded,
  GamepadRounded,
  LocalMoviesRounded,
  OpenInNewRounded,
  PauseCircleRounded,
  PlaylistAddRounded,
  RemoveCircleRounded,
  TvRounded,
} from "@mui/icons-material";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { Item } from "../../assets/lib/types";

type UserItemProps = {
  item: Item;
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
    icon: <PlaylistAddRounded />,
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

export const UserItem = ({ item }: UserItemProps) => {
  const category = categoryDetails[item.category];
  const status = statusDetails[item.status];
  const itemPath = `/library/${encodeURIComponent(item.externalId)}`;

  return (
    <Paper
      component="article"
      variant="outlined"
      sx={{
        height: "100%",
        minHeight: 230,
        overflow: "hidden",
        borderRadius: 3,
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: 4,
        },
      }}
    >
      <Stack direction="row" sx={{ height: "100%", minHeight: 230 }}>
        <Box
          aria-hidden="true"
          sx={{
            width: { xs: 68, sm: 82 },
            flexShrink: 0,
            display: "grid",
            placeItems: "center",
            color: "#fff",
            bgcolor: category.color,
            "& svg": { fontSize: { xs: 30, sm: 36 } },
          }}
        >
          {category.icon}
        </Box>

        <Stack
          spacing={1.5}
          sx={{
            flex: 1,
            minWidth: 0,
            p: { xs: 1.75, sm: 2.25 },
            alignItems: "stretch",
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <Chip
              size="small"
              label={category.label}
              variant="outlined"
              sx={{ maxWidth: "48%", borderRadius: 1.5 }}
            />
            <Chip
              size="small"
              icon={status.icon}
              label={status.label}
              sx={{
                maxWidth: "70%",
                color: status.color,
                bgcolor: status.background,
                borderRadius: 1.5,
                "& .MuiChip-icon": { color: "inherit" },
                "& .MuiChip-label": {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                },
              }}
            />
          </Stack>

          <Box sx={{ minWidth: 0 }}>
            <Typography
              component={RouterLink}
              to={itemPath}
              variant="h6"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                color: "text.primary",
                fontWeight: 700,
                lineHeight: 1.3,
                textDecoration: "none",
                overflowWrap: "anywhere",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {item.title}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              {item.rating > 0
                ? `Your rating · ${item.rating}/10`
                : "Not rated yet"}
            </Typography>
          </Box>

          {item.notes ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
                lineHeight: 1.5,
              }}
            >
              {item.notes}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.disabled">
              No notes added
            </Typography>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={0.75}
            sx={{ mt: "auto", pt: 0.5 }}
          >
            <Button
              component={RouterLink}
              to={itemPath}
              size="small"
              variant="contained"
              endIcon={<ArrowForwardRounded />}
              sx={{ flex: 1, textTransform: "none", borderRadius: 2 }}
            >
              Manage item
            </Button>
            {item.link && (
              <Button
                component="a"
                href={item.link}
                target="_blank"
                rel="noreferrer"
                size="small"
                variant="outlined"
                endIcon={<OpenInNewRounded />}
                sx={{
                  flex: 1,
                  textTransform: "none",
                  borderRadius: 2,
                  whiteSpace: "nowrap",
                }}
              >
                External page
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

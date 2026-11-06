import type { ReactNode } from "react";
import {
  AutoStoriesRounded,
  MenuBookRounded,
  StarRounded,
} from "@mui/icons-material";
import { Box, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import type { Book } from "../../assets/lib/types";

type BookContentProps = {
  content: Book;
};

const InfoTile = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) => (
  <Paper variant="outlined" sx={{ p: 2, minWidth: 0, height: "100%" }}>
    <Stack direction="row" spacing={1.25} alignItems="center">
      {icon}
      <Box minWidth={0}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography fontWeight={600} sx={{ overflowWrap: "anywhere" }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

export const BookContent = ({ content }: BookContentProps) => {
  const { averageRating, ratingsCount } = content.metadata;
  const subjects = [...new Set(content.genres.filter(Boolean))];
  const publishDate = content.publishDate
    ? String(content.publishDate)
    : "Not listed";

  console.log(content.authors);

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(4, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        <InfoTile
          label="Author"
          value={content.authors || "Not listed"}
          icon={<AutoStoriesRounded color="action" />}
        />
        <InfoTile
          label="First published"
          value={publishDate}
          icon={<MenuBookRounded color="action" />}
        />
        <InfoTile
          label="Length"
          value={
            content.pageCount ? `${content.pageCount} pages` : "Not listed"
          }
          icon={<MenuBookRounded color="action" />}
        />
        <InfoTile
          label="Reader rating"
          value={
            averageRating
              ? `${averageRating.toFixed(1)} / 5${ratingsCount ? ` · ${ratingsCount.toLocaleString()} ratings` : ""}`
              : "Not rated"
          }
          icon={<StarRounded color="action" />}
        />
      </Box>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: 1.25, fontWeight: 700 }}>
          About this book
        </Typography>
        <Typography
          color={content.bookDesc ? "text.primary" : "text.secondary"}
          sx={{ whiteSpace: "pre-line", lineHeight: 1.85 }}
        >
          {content.bookDesc ||
            "A description has not been added to the catalog yet."}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 0.5, sm: 3 }}
        >
          <Typography variant="body2">
            <Box component="span" color="text.secondary">
              Author{content.authors.length === 1 ? "" : "s"}{" "}
            </Box>
            {content.authors || "Not listed"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Open Library ID · {content.externalId}
          </Typography>
        </Stack>
      </Paper>

      {subjects.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 1.25, fontWeight: 600 }}>
            Subjects
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {subjects.map((subject) => (
              <Chip key={subject} label={subject} variant="outlined" />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

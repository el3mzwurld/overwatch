import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import type { FullMovie, FullTvShow } from "../../assets/lib/types";

type FilmContentProps = {
  content: FullMovie | FullTvShow;
};

const InfoTile = ({ label, value }: { label: string; value: string }) => (
  <Paper variant="outlined" sx={{ p: 2, minWidth: 0 }}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography fontWeight={600} sx={{ overflowWrap: "anywhere" }}>
      {value}
    </Typography>
  </Paper>
);

export const FilmContent = ({ content }: FilmContentProps) => {
  const isTv = content.category === "tv";
  const runtime = content.runtime ? `${content.runtime} min` : "Not listed";
  const metadata =
    (content as FullMovie & { metadata?: FullMovie["metaData"] }).metadata ??
    content.metaData;
  const genres = metadata?.genres ?? [];

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
          label="Release date"
          value={content.releaseDate || "Not listed"}
        />
        <InfoTile
          label="Release status"
          value={content.releaseStatus || "Not listed"}
        />
        <InfoTile
          label={isTv ? "Episode runtime" : "Runtime"}
          value={runtime}
        />
        <InfoTile
          label={isTv ? "Seasons" : "TMDB rating"}
          value={
            isTv
              ? `${content.seasonCount} seasons`
              : `${metadata?.voteAverage?.toFixed(1) ?? "—"} / 10`
          }
        />
      </Box>

      {isTv && content.networks.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.25 }}>
            Networks
          </Typography>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
            {content.networks.map((network) => (
              <Chip
                key={network.id}
                label={`${network.name}${network.origin_country ? ` · ${network.origin_country}` : ""}`}
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}

      {genres.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.25 }}>
            Genres
          </Typography>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
            {genres.map((genre) => (
              <Chip key={genre.id} label={genre.name} variant="outlined" />
            ))}
          </Stack>
        </Box>
      )}

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.25 }}>
          Synopsis
        </Typography>
        <Typography
          color={content.overview ? "text.primary" : "text.secondary"}
          sx={{ whiteSpace: "pre-line", lineHeight: 1.85 }}
        >
          {content.overview || "No synopsis is available for this title yet."}
        </Typography>
      </Paper>
    </Stack>
  );
};
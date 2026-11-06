import type { ReactNode } from "react";
import {
  EmojiEventsRounded,
  GamepadRounded,
  StarRounded,
  StorefrontRounded,
} from "@mui/icons-material";
import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { Game } from "../../assets/lib/types";

type GameContentProps = {
  content: Game;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const linkEntries = (value: unknown, nestedKey: string) => {
  const entries = Array.isArray(value) ? value : value ? [value] : [];
  return entries.flatMap((entry) => {
    if (!isRecord(entry)) return [];
    const nested = entry[nestedKey];
    const item = isRecord(nested) ? nested : entry;
    return typeof item.name === "string"
      ? [
          {
            id: typeof item.id === "number" ? item.id : item.name,
            name: item.name,
            releasedAt:
              typeof entry.released_at === "string" ? entry.released_at : null,
            url: typeof entry.url === "string" ? entry.url : null,
            requirements: isRecord(entry.requirements)
              ? entry.requirements
              : null,
          },
        ]
      : [];
  });
};

const getTags = (tags: unknown): string[] => {
  const entries = Array.isArray(tags) ? tags : tags ? [tags] : [];
  return entries.flatMap((tag) =>
    isRecord(tag) && typeof tag.name === "string" ? [tag.name] : [],
  );
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
        <Typography sx={{ overflowWrap: "anywhere", fontWeight: 700 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  </Paper>
);

export const GameContent = ({ content }: GameContentProps) => {
  const platforms = linkEntries(content.availablePlatforms, "platform");
  const stores = linkEntries(content.availableStores, "store");
  const tags = getTags(content.tags);
  const ratingAnalysis = content.analytics.ratingsAnalysis ?? [];
  const metacritic = content.analytics.metacriticRating;
  const rating = content.analytics.averageRating;
  const esrb = content.esrbRating?.name;
  const genres = content.genres.map((genre) => genre.name);

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
          label="RAWG rating"
          value={rating ? `${rating.toFixed(2)} / 5` : "Not rated"}
          icon={<StarRounded color="action" />}
        />
        <InfoTile
          label="Metacritic"
          value={metacritic ? `${metacritic} / 100` : "Not rated"}
          icon={<EmojiEventsRounded color="action" />}
        />
        <InfoTile
          label="Release date"
          value={content.releaseDate || "Not listed"}
          icon={<GamepadRounded color="action" />}
        />
        <InfoTile
          label="Age rating"
          value={esrb || "Not rated"}
          icon={<GamepadRounded color="action" />}
        />
      </Box>

      {genres.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.25 }}>
            Genres
          </Typography>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
            {genres.map((genre) => (
              <Chip key={genre} label={genre} variant="outlined" />
            ))}
          </Stack>
        </Box>
      )}

      {platforms.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.25 }}>
            Platforms
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(3, minmax(0, 1fr))",
              },
              gap: 1.25,
            }}
          >
            {platforms.map((platform) => (
              <Paper key={platform.id} variant="outlined" sx={{ p: 1.75 }}>
                <Typography fontWeight={700}>{platform.name}</Typography>
                {platform.releasedAt && (
                  <Typography variant="caption" color="text.secondary">
                    Platform release · {platform.releasedAt}
                  </Typography>
                )}
                {platform.requirements &&
                  (typeof platform.requirements.minimum === "string" ||
                    typeof platform.requirements.recommended === "string") && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 0.75,
                        whiteSpace: "pre-line",
                      }}
                    >
                      {[
                        typeof platform.requirements.minimum === "string"
                          ? `Minimum: ${platform.requirements.minimum}`
                          : "",
                        typeof platform.requirements.recommended === "string"
                          ? `Recommended: ${platform.requirements.recommended}`
                          : "",
                      ]
                        .filter(Boolean)
                        .join("\n")}
                    </Typography>
                  )}
              </Paper>
            ))}
          </Box>
        </Box>
      )}

      {ratingAnalysis.length > 0 && (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            spacing={0.5}
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" fontWeight={700}>
              Player sentiment
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {content.analytics.ratingsCount.toLocaleString()} ratings
            </Typography>
          </Stack>
          <Stack spacing={1.5}>
            {ratingAnalysis.map((entry) => (
              <Box key={entry.id}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    sx={{ textTransform: "capitalize" }}
                  >
                    {entry.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.percent}% · {entry.count.toLocaleString()}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, entry.percent))}
                  sx={{ height: 7, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Stack>
        </Paper>
      )}

      {stores.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.25 }}>
            Where to play
          </Typography>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
            {stores.map((store) => (
              <Chip
                key={store.id}
                icon={<StorefrontRounded />}
                label={store.name}
                component={store.url ? "a" : "div"}
                href={store.url ?? undefined}
                target={store.url ? "_blank" : undefined}
                rel={store.url ? "noreferrer" : undefined}
                clickable={Boolean(store.url)}
                variant="outlined"
              />
            ))}
          </Stack>
        </Box>
      )}

      {tags.length > 0 && (
        <Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1.25 }}>
            Tags
          </Typography>
          <Stack direction="row" useFlexGap flexWrap="wrap" gap={1}>
            {tags.slice(0, 24).map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>
        </Box>
      )}
    </Stack>
  );
};

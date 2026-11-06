import { useMemo, useState } from "react";
import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";
import type { Item } from "../../assets/lib/types";
import { UserItem } from "./userItem";

type LibraryFilter = "all" | Item["status"];

type LibraryTrayProps = {
  items: Item[];
};

const filters: LibraryFilter[] = [
  "all",
  "want",
  "in progress",
  "finished",
  "dropped",
];

const filterCounts = (items: Item[], filter: LibraryFilter) =>
  filter === "all"
    ? items.length
    : items.filter((item) => item.status === filter).length;

export const LibraryTray = ({ items }: LibraryTrayProps) => {
  const [filter, setFilter] = useState<LibraryFilter>("all");
  const visibleItems = useMemo(
    () =>
      filter === "all" ? items : items.filter((item) => item.status === filter),
    [filter, items],
  );

  return (
    <Box component="section" aria-label="Your library" sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 2 }}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
            Your collection
          </Typography>
          <Chip
            size="small"
            label={`${items.length} ${items.length === 1 ? "item" : "items"}`}
            variant="outlined"
          />
        </Stack>
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            overflowX: "auto",
            pb: 0.5,
            maxWidth: { xs: "100%", sm: "70%" },
          }}
        >
          {filters.map((option) => (
            <Button
              key={option}
              size="small"
              variant={filter === option ? "contained" : "outlined"}
              onClick={() => setFilter(option)}
              sx={{
                flexShrink: 0,
                borderRadius: 5,
                textTransform: "capitalize",
                whiteSpace: "nowrap",
                px: 1.5,
                minHeight: 36,
                borderColor: "secondary.main",
                color: filter !== option ? "secondary.main" : "primary.main",
                backgroundColor:
                  filter === option ? "lightgreen" : "transparent",
              }}
            >
              {option === "all" ? "All" : option}
              <Box
                component="span"
                sx={{
                  ml: 0.75,
                  opacity: filter === option ? 0.8 : 0.65,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {filterCounts(items, option)}
              </Box>
            </Button>
          ))}
        </Stack>
      </Stack>

      {visibleItems.length > 0 ? (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {visibleItems.map((item) => (
            <Grid
              key={`${item.category}-${item.externalId}`}
              size={{ xs: 12, md: 6, xl: 4 }}
            >
              <UserItem item={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">
            {items.length === 0
              ? "Your library is empty for now."
              : `No items marked “${filter}” yet.`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

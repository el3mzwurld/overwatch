import { useMemo, useState } from "react";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
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
        spacing={2}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Typography component="h2" variant="h5" sx={{ fontWeight: 600 }}>
          Your collection
        </Typography>
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
                borderRadius: 0,
                textTransform: "capitalize",
                whiteSpace: "nowrap",
              }}
            >
              {option}
            </Button>
          ))}
        </Stack>
      </Stack>

      {visibleItems.length > 0 ? (
        <Grid container spacing={{ xs: 1.5, sm: 2 }}>
          {visibleItems.map((item) => (
            <Grid key={`${item.category}-${item.externalId}`} size={{ xs: 12, sm: 6, lg: 4 }}>
              <UserItem item={item} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "divider",
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

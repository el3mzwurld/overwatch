import { OpenInNewRounded } from "@mui/icons-material";
import {
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { Item } from "../../assets/lib/types";

type UserItemProps = {
  item: Item;
};

const formatCategory = (category: Item["category"]) =>
  category === "tv" ? "TV" : category.charAt(0).toUpperCase() + category.slice(1);

export const UserItem = ({ item }: UserItemProps) => (
  <Paper
    component="article"
    variant="outlined"
    sx={{
      height: "100%",
      p: { xs: 2, sm: 2.5 },
      borderRadius: 0,
      bgcolor: "background.default",
    }}
  >
    <Stack
      spacing={1.5}
      sx={{ height: "100%", alignItems: "flex-start", minWidth: 0 }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Chip size="small" label={formatCategory(item.category)} variant="outlined" />
        <Chip size="small" label={item.status} />
      </Stack>

      <Typography
        component="h3"
        variant="h6"
        sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
      >
        {item.title}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {item.rating > 0 ? `Your rating · ${item.rating}/10` : "Not rated"}
      </Typography>

      {item.notes && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            overflow: "hidden",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
        >
          {item.notes}
        </Typography>
      )}

      {item.link && (
        <Button
          href={item.link}
          target="_blank"
          rel="noreferrer"
          endIcon={<OpenInNewRounded />}
          size="small"
          sx={{ mt: "auto", px: 0, textTransform: "none" }}
        >
          View details
        </Button>
      )}
    </Stack>
  </Paper>
);

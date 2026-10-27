import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useUser } from "../context/user";
import { Navigate } from "react-router-dom";

export const Profile = () => {
  const userContext = useUser();

  if (!userContext) {
    return <Alert severity="error">Profile information is unavailable.</Alert>;
  }

  if (userContext.isInitializing) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 240 }}>
        <CircularProgress aria-label="Loading profile" />
      </Box>
    );
  }

  const user = userContext.user;

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const createdAt = new Date(user.createdAt);
  const joinedDate = Number.isNaN(createdAt.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat(undefined, {
        dateStyle: "long",
      }).format(createdAt);

  return (
    <Box
      component="main"
      sx={{
        width: "100%",
        maxWidth: 720,
        mx: "auto",
        px: { xs: 2, sm: 3 },
        py: 4,
      }}
    >
      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ letterSpacing: "0.16em" }}
      >
        ACCOUNT
      </Typography>
      <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Your profile
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          p: { xs: 2.5, sm: 4 },
          borderRadius: 0,
          bgcolor: "background.default",
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: "secondary.main",
              color: "primary.main",
              fontSize: "1.5rem",
            }}
            aria-label={`${user.userName} profile`}
          >
            {user.userName.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 600, overflowWrap: "anywhere" }}
            >
              {user.userName}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ overflowWrap: "anywhere" }}
            >
              {user.email}
            </Typography>
          </Box>
        </Stack>

        <Divider />

        <Stack spacing={2.5} sx={{ pt: 3 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Username
            </Typography>
            <Typography>{user.userName}</Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography sx={{ overflowWrap: "anywhere" }}>
              {user.email}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Member since
            </Typography>
            <Typography>{joinedDate}</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

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
import { Header } from "./landing";
import { LogoutOutlined } from "@mui/icons-material";

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
    <>
      <Header />
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
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", mb: 3, position: "relative" }}
          >
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

            <Box
              sx={{
                position: "absolute",
                right: 5,
                width: "2.5rem",
                height: "2.5rem",
                backgroundColor: "secondary.main",
                display: "flex",
                borderRadius: 25,
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1rem",
              }}
              onClick={() => {
                setTimeout(() => {
                  userContext.logout();
                }, 400);
              }}
            >
              <LogoutOutlined sx={{ color: "Background", fontSize: "1em" }} />
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
    </>
  );
};

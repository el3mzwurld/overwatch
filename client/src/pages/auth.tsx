import { useState, type FormEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/user";

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegistering = location.pathname.endsWith("/register");
  const userContext = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  if (!userContext) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Authentication is currently unavailable.</Alert>
      </Box>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const response = isRegistering
      ? await userContext.signUp(email, username, password)
      : await userContext.login(email, password);

    if (!response.success) {
      setError(response.cause ?? "Something went wrong. Please try again.");
      return;
    }

    if (isRegistering) {
      setNotice("Your account is ready. Sign in to continue.");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    navigate("/");
  };

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100dvh",
        width: "100%",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: 440 },
          minHeight: { xs: "100dvh", sm: "auto" },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          bgcolor: "background.default",
          border: { xs: 0, sm: 1 },
          borderColor: "divider",
          px: { xs: 3, sm: 5 },
          py: { xs: 5, sm: 6 },
        }}
      >
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="overline"
              sx={{ color: "text.secondary", letterSpacing: "0.18em" }}
            >
              OVERWATCH
            </Typography>
            <Typography component="h1" variant="h4" sx={{ mt: 1, fontWeight: 600 }}>
              {isRegistering ? "Create your account" : "Welcome back"}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              {isRegistering
                ? "Make a space for the things you love."
                : "Sign in to pick up where you left off."}
            </Typography>
          </Box>

          <Divider />

          {error && <Alert severity="error">{error}</Alert>}
          {notice && <Alert severity="success">{notice}</Alert>}

          <Stack component="form" spacing={2.25} onSubmit={handleSubmit}>
            {isRegistering && (
              <TextField
                label="Username"
                name="username"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                fullWidth
              />
            )}
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              autoComplete={isRegistering ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
            />
            {isRegistering && (
              <TextField
                label="Confirm password"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                fullWidth
              />
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={userContext.isSubmitting}
              sx={{
                minHeight: 48,
                borderRadius: 0,
                bgcolor: "secondary.main",
                color: "primary.main",
                "&:hover": { bgcolor: "text.primary", color: "background.default" },
              }}
            >
              {userContext.isSubmitting
                ? "Please wait..."
                : isRegistering
                  ? "Create account"
                  : "Sign in"}
            </Button>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textAlign: "center" }}
          >
            {isRegistering ? "Already have an account?" : "New to Overwatch?"}{" "}
            <Button
              component={RouterLink}
              to={isRegistering ? "/auth" : "/auth/register"}
              color="secondary"
              sx={{ p: 0, minWidth: 0, textTransform: "none", fontWeight: 600 }}
            >
              {isRegistering ? "Sign in" : "Create an account"}
            </Button>
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

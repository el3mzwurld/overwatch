import { useState, type FormEvent } from "react";
import { ArrowForwardRounded } from "@mui/icons-material";
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
import { Header } from "./landing";

export const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRegistering = location.pathname.endsWith("/register");
  const userContext = useUser();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notice, setNotice] = useState("");
  const passwordsDoNotMatch =
    isRegistering &&
    confirmPassword.length > 0 &&
    password !== confirmPassword;

  if (!userContext) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Authentication is currently unavailable.</Alert>
      </Box>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice("");

    if (isRegistering && password !== confirmPassword) {
      return;
    }

    const response = isRegistering
      ? await userContext.signUp(email, username, password)
      : await userContext.login(email, password);

    if (!response.success) {
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
    <>
      <Header />
      <Box
        component="main"
        sx={{
          width: "100%",
          bgcolor: "background.default",
          px: { xs: 2, sm: 3, lg: 5 },
          py: { xs: 3, md: 5 },
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1180,
            minHeight: { md: "min(760px, calc(100dvh - 10rem))" },
            mx: "auto",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(0, 1fr) minmax(390px, .82fr)",
            },
            alignItems: "stretch",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: { xs: 3, md: 2 },
            bgcolor: "background.paper",
            boxShadow: { xs: 0, md: 1 },
          }}
        >
          <Box
            sx={{
              position: "relative",
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              justifyContent: "space-between",
              p: { md: 4, lg: 6 },
              bgcolor: "background.default",
              borderRight: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="overline"
              sx={{ color: "text.secondary", letterSpacing: ".16em" }}
            >
              OVERWATCH
            </Typography>
            <Box sx={{ my: 5 }}>
              <Typography
                variant="overline"
                sx={{ color: "text.secondary", letterSpacing: ".14em" }}
              >
                A PERSONAL CATALOG
              </Typography>
              <Typography
                component="p"
                sx={{
                  maxWidth: 540,
                  mt: 1,
                  fontSize: { md: "2.3rem", lg: "2.8rem" },
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-.03em",
                  textWrap: "balance",
                }}
              >
                Keep track of what you love.
              </Typography>
              <Typography
                sx={{
                  maxWidth: 460,
                  mt: 2,
                  lineHeight: 1.8,
                  color: "text.secondary",
                }}
              >
                One place for your books, films, and games—what you&apos;ve
                finished, what you&apos;re enjoying, and what&apos;s next.
              </Typography>
            </Box>

            <Stack spacing={1.5}>
              {["Books", "Films & series", "Games"].map((category, index) => (
                <Box key={category}>
                  {index > 0 && <Divider sx={{ mb: 1.5 }} />}
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "baseline" }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      0{index + 1}
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>{category}</Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              px: { xs: 2.5, sm: 5, md: 5, lg: 7 },
              py: { xs: 4, sm: 6, md: 5 },
            }}
          >
            <Stack spacing={3} sx={{ width: "100%", maxWidth: 420 }}>
              <Box>
                <Typography
                  variant="overline"
                  sx={{ color: "text.secondary", letterSpacing: "0.12em" }}
                >
                  {isRegistering ? "CREATE AN ACCOUNT" : "SIGN IN"}
                </Typography>
                <Typography
                  component="h1"
                  variant="h4"
                  sx={{ mt: 0.75, fontWeight: 700, letterSpacing: "-.025em" }}
                >
                  {isRegistering ? "Create your account" : "Welcome back"}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {isRegistering
                    ? "Make a space for the things you love."
                    : "Sign in to pick up where you left off."}
                </Typography>
              </Box>

              {userContext.error && (
                <Alert severity="error">{userContext.error}</Alert>
              )}
              {notice && <Alert severity="success">{notice}</Alert>}

              <Stack component="form" spacing={2} onSubmit={handleSubmit}>
                {isRegistering && (
                  <TextField
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
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
                  autoComplete={
                    isRegistering ? "new-password" : "current-password"
                  }
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
                    error={passwordsDoNotMatch}
                    helperText={
                      passwordsDoNotMatch ? "Passwords do not match." : undefined
                    }
                    required
                    fullWidth
                  />
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={userContext.isSubmitting}
                  endIcon={!userContext.isSubmitting && <ArrowForwardRounded />}
                  sx={{
                    minHeight: 52,
                    mt: 0.5,
                    borderRadius: 1.5,
                    bgcolor: "secondary.main",
                    color: "primary.main",
                    fontWeight: 600,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "text.primary",
                      color: "background.default",
                    },
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
                {isRegistering
                  ? "Already have an account?"
                  : "New to Overwatch?"}{" "}
                <Button
                  component={RouterLink}
                  to={isRegistering ? "/auth" : "/auth/register"}
                  color="secondary"
                  sx={{
                    p: 0,
                    minWidth: 0,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  {isRegistering ? "Sign in" : "Create an account"}
                </Button>
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
};

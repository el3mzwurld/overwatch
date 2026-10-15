import { Box, Button, useColorScheme } from "@mui/material";
import { UseBookSearch } from "./hooks/useBookSearch";

function App() {
  const { books, isLoading, isPending } = UseBookSearch("Harry Potter");
  const { mode, setMode } = useColorScheme();

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        minHeight: "100vh",
      }}
    >
      {/* 1. Keep the toggle button accessible at all times */}
      <Button
        onClick={() => {
          setMode(mode === "light" ? "dark" : "light");
        }}
      >
        {/* 2. Only protect the text rendering to prevent SSR flashes */}
        {!mode ? "loading mode..." : mode === "light" ? "dark" : "light"}
      </Button>

      {/* 3. Confine your loading states strictly to the data area */}
      {isLoading || isPending ? (
        <h3>...loading books</h3>
      ) : (
        <ul>
          {books.map((item) => (
            <li key={item.externalId}>{item.title}</li>
          ))}
        </ul>
      )}
    </Box>
  );
}

export default App;

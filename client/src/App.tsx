import { useQueryClient } from "@tanstack/react-query";
import { useFilmSearch } from "./hooks/useFilmSearch";

function App() {
  const queryClient = useQueryClient();

  const { items, isLoading, isPending } = useFilmSearch("spider");

  if (isLoading) {
    return <h3>...loading</h3>;
  }

  return <>{items.map((item) => item.externalId)}</>;
}

export default App;

import { useDebouncer } from "./useDebouncer";
import { useQuery } from "@tanstack/react-query";
import { searchGame } from "../api/api";

export function useGameSearch(query: string) {
  const debouncedQuery = useDebouncer(query.trim(), 400);

  const q = useQuery({
    queryKey: ["search", "games", debouncedQuery],
    queryFn: () => {
      return searchGame(debouncedQuery) ?? [];
    },
    enabled: debouncedQuery.length > 1,
  });

  const games = q.data ?? [];

  return {
    gameSearchResults: games,
    isLoading: q.isLoading,
    error: q.error,
    isPending: q.isPending,
  };
}

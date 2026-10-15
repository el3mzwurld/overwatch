import { useEffect, useState } from "react";
import { useDebouncer } from "./useDebouncer";
import { useQuery } from "@tanstack/react-query";
import { searchGame } from "../api/api";

export function useGameSearch(query: string) {
  const debouncedQuery = useDebouncer(query.trim(), 400);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [debouncedQuery]);

  const q = useQuery({
    queryKey: ["search", "games", page, debouncedQuery],
    queryFn: () => searchGame(debouncedQuery, page),
    enabled: debouncedQuery.length > 1 && page >= 1,
  });

  const games = q.data ?? [];

  return {
    gameSearchResults: games,
    isLoading: q.isLoading,
    error: q.error,
    loadMore: () => setPage((p) => p + 1),
  };
}

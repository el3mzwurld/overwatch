import { useQuery } from "@tanstack/react-query";
import { discoverGames } from "../api/api";
import { useState } from "react";

export const useDiscoverFilms = () => {
  const [page, setPage] = useState(1);

  const q = useQuery({
    queryKey: ["discover-games", page],
    queryFn: () => discoverGames(page),
    enabled: page >= 1,
  });

  const results = q.data ?? [];

  return {
    games: results,
    isLoading: q.isLoading,
    isPending: q.isPending,
    error: q.error,
    loadMore: () => setPage((p) => p + 1),
  };
};

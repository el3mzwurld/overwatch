import { useQuery } from "@tanstack/react-query";
import { discoverGames } from "../api/api";
import { useMemo, useState } from "react";
import { DISCOVERY_PAGE_LIMIT } from "../assets/lib/utils";
import type { Game } from "../assets/lib/types";

export const useDiscoverGames = (id?: Game["externalId"]) => {
  const [page, setPage] = useState(1);

  const q = useQuery({
    queryKey: ["discover-games", page],
    queryFn: () => discoverGames(page, DISCOVERY_PAGE_LIMIT),
    enabled: page >= 1,
  });

  const results = q.data ?? [];

  // Keep the selected game stable when the results array changes.
  const findGame = useMemo((): Game | null => {
    if (!id) return null;

    const game = results.find((g) => g.externalId === id);

    return game ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    games: results,
    findGame,
    isLoading: q.isLoading,
    isPending: q.isPending,
    error: q.error,
    loadMore: () => setPage((p) => p + 1),
    page,
  };
};

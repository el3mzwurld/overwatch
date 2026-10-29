import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { discoverGames } from "../api/api";
import { useCallback, useMemo, useState } from "react";
import { DISCOVERY_PAGE_LIMIT } from "../assets/lib/utils";
import type { Game } from "../assets/lib/types";
import { LastPage } from "@mui/icons-material";

export const useDiscoverGames = () => {
  const [page, setPage] = useState(1);

  const q = useInfiniteQuery({
    queryKey: ["discover-games", page],
    queryFn: ({ pageParam }) => discoverGames(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      if (!last.results || last.results.length === 0) {
        return undefined;
      }

      return last.nextPage;
    },
  });

  const results = useMemo(() => {
    return q.data?.pages ?? [];
  }, [q.data]);

  const flatGames = useMemo(() => {
    return results ? results.flatMap((r) => r.results) : [];
  }, [results]);

  const findGame = useCallback((id?: Game["externalId"]) => {
    if (!id) return;

    const game = flatGames.find((g) => g.externalId === id);

    return game;
  }, []); //no need to include flatgames, we don't need to watch for changes on that dependency
  return {
    games: flatGames,
    findGame,
    isLoading: q.isLoading || q.isFetchingNextPage,
    isPending: q.isPending,
    error: q.error,
    loadMore: () => {
      q.fetchNextPage();
    },
    hasMore: q.hasNextPage,
    page,
  };
};

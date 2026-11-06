import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { discoverFilms, getMovie, getShow } from "../api/api";
import { useCallback, useMemo, useState } from "react";
import { DISCOVERY_PAGE_LIMIT, paginator } from "../assets/lib/utils";
import type { Film, FullMovie, FullTvShow } from "../assets/lib/types";

export const useDiscoverFilms = () => {
  const [page, setPage] = useState(1);
  const [gameLoading, setGameLoading] = useState(false);
  const q = useInfiniteQuery({
    queryKey: ["discover-films", page],
    queryFn: ({ pageParam }) => discoverFilms(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      if (!last || last.result.length === 0) {
        return undefined;
      }

      return last.nextPage;
    },
  });

  const results = useMemo(() => {
    return q.data?.pages ?? [];
  }, [q.data]);

  const flatFilms = useMemo(() => {
    return results ? results.flatMap((r) => r.result) : [];
  }, [results]);
  // Keep the selected film stable when the results array changes.
  const findFilm = useCallback(
    async (id?: Film["externalId"]): Promise<FullMovie | FullTvShow | null> => {
      if (!id) return null;
      const type = id.includes("movie") ? "movie" : "tv";
      try {
        const res =
          type === "movie"
            ? await getMovie(Number(id.split("-")[1]))
            : await getShow(Number(id.split("-")[1]));
        return res;
      } catch (error) {
        return null;
      }
    },
    [],
  );

  return {
    films: flatFilms,
    findFilm,
    isLoading: q.isLoading && q.isFetchingNextPage,
    isPending: q.isPending,
    error: q.error,
    loadMore: () => q.fetchNextPage(),
    page,
    hasMore: q.hasNextPage,
  };
};

import { useQuery } from "@tanstack/react-query";
import { discoverFilms, getMovie, getShow } from "../api/api";
import { useCallback, useMemo, useState } from "react";
import { DISCOVERY_PAGE_LIMIT, paginator } from "../assets/lib/utils";
import type { Film, FullMovie, FullTvShow } from "../assets/lib/types";

export const useDiscoverFilms = () => {
  const [page, setPage] = useState(1);

  const q = useQuery({
    queryKey: ["discover-films"],
    queryFn: () => discoverFilms(),
    retry: 2,
  });

  const films = q.data ?? [];
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
    films: paginator(films, page, DISCOVERY_PAGE_LIMIT),
    findFilm,
    isLoading: q.isLoading,
    isPending: q.isPending,
    error: q.error,
    hasMore: page * DISCOVERY_PAGE_LIMIT < films.length,
    loadMore: () => setPage((p) => p + 1),
    page,
  };
};

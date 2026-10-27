import { useQuery } from "@tanstack/react-query";
import { discoverFilms } from "../api/api";
import { useMemo, useState } from "react";
import { DISCOVERY_PAGE_LIMIT, paginator } from "../assets/lib/utils";
import type { Film } from "../assets/lib/types";

export const useDiscoverFilms = (id?: Film["externalId"]) => {
  const [page, setPage] = useState(1);

  const q = useQuery({
    queryKey: ["discover-films"],
    queryFn: () => discoverFilms(),
    retry: 2,
  });

  const films = q.data ?? [];
  // Keep the selected film stable when the results array changes.
  const findFilm = useMemo((): Film | null => {
    if (!id) return null;

    const film = films.find((item) => item.externalId === id);

    return film ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

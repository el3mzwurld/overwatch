import { useQuery } from "@tanstack/react-query";
import { discoverFilms } from "../api/api";
import { useState } from "react";
import { DISCOVERY_PAGE_LIMIT, paginator } from "../assets/lib/utils";

export const useDiscoverFilms = () => {
  const [page, setPage] = useState(1);

  const q = useQuery({
    queryKey: ["discover-films"],
    queryFn: () => discoverFilms(),
    retry: 2,
  });

  const films = q.data ?? [];

  return {
    films: paginator(films, page, DISCOVERY_PAGE_LIMIT),
    isLoading: q.isLoading,
    isPending: q.isPending,
    error: q.error,
    hasMore: page * DISCOVERY_PAGE_LIMIT < films.length,
    loadMore: () => setPage((p) => p + 1),
  };
};

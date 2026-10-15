import { useQuery } from "@tanstack/react-query";
import { discoverBooks } from "../api/api";
import { useState } from "react";
import { DISCOVERY_PAGE_LIMIT, paginator } from "../assets/lib/utils";

export const useDiscoverFilms = () => {
  const [page, setPage] = useState(1);

  const q = useQuery({
    queryKey: ["discover-books"],
    queryFn: () => discoverBooks(),
    retry: 2,
  });

  const results = q.data ?? [];

  return {
    books: paginator(results, page, DISCOVERY_PAGE_LIMIT),
    isLoading: q.isLoading,
    isPending: q.isPending,
    error: q.error,
    hasMore: page * DISCOVERY_PAGE_LIMIT < results.length,
    loadMore: () => setPage((p) => p + 1),
  };
};

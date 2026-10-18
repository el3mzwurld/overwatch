import { useQuery } from "@tanstack/react-query";
import { discoverBooks } from "../api/api";
import { useEffect, useState } from "react";
import { DISCOVERY_PAGE_LIMIT, paginator } from "../assets/lib/utils";
import type { Book } from "../assets/lib/types";

export const useDiscoverBooks = () => {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const q = useQuery({
    queryKey: ["discover-books"],
    queryFn: () => discoverBooks(),
    retry: 2,
  });

  const results = q.data ?? [];
  const loadMore = () => {
    const nextPage = paginator(q.data ?? [], page + 1, DISCOVERY_PAGE_LIMIT);

    setBooks((b) => [...b, ...nextPage]);
    setPage((p) => p + 1);
  };
  useEffect(() => {
    if (q.isPending) return;
    setBooks(paginator(q.data ?? [], page, DISCOVERY_PAGE_LIMIT));
  }, [page, q.data, q.isPending]);
  return {
    books,
    isLoading: q.isLoading,
    isPending: q.isPending,
    error: q.error,
    hasMore: page * DISCOVERY_PAGE_LIMIT < results.length,
    loadMore,
  };
};

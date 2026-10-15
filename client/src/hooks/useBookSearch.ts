import { useEffect, useState } from "react";
import { useDebouncer } from "./useDebouncer";
import { useQuery } from "@tanstack/react-query";
import { searchBook } from "../api/api";
import { paginator } from "../assets/lib/utils";

const DISCOVER_PAGE_LIMIT = 12;
export function UseBookSearch(query: string) {
  const debouncedQuery = useDebouncer(query.trim(), 400);
  const [page, setPage] = useState(1);

  useEffect(() => setPage(1), [debouncedQuery]);

  const q = useQuery({
    queryKey: ["search", "games", debouncedQuery],
    queryFn: () => searchBook(debouncedQuery),
    enabled: debouncedQuery.length > 1 && page >= 1,
  });

  const books = q.data ?? [];

  return {
    books: paginator(books, page, DISCOVER_PAGE_LIMIT),
    isLoading: q.isLoading,
    error: q.error,
    loadMore: () => setPage((p) => p + 1),
    hasMore: () => page * DISCOVER_PAGE_LIMIT < books.length,
    isPending: q.isPending,
  };
}

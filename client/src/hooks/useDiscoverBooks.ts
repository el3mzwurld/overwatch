import { useQuery } from "@tanstack/react-query";
import { discoverBooks, getBookById } from "../api/api";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DISCOVERY_PAGE_LIMIT, paginator } from "../assets/lib/utils";
import type { Book } from "../assets/lib/types";

export const useDiscoverBooks = (id?: Book["externalId"]) => {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  const q = useQuery({
    queryKey: ["discover-books"],
    queryFn: () => discoverBooks(),
    retry: 2,
  });

  const results = q.data ?? [];

  const bookFallBack = useCallback((): Book | null => {
    if (!id) return null;

    const book = results.find((item) => item.externalId === id);

    return book ?? null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const findBook = useCallback(async () => {
    if (!id) return null;
    try {
      const res = await getBookById(id);
      return res;
    } catch (error) {
      console.error(
        "Error fetching book by ID from open Library:",
        error,
        "using the fallback now...",
      );
      const fallback = bookFallBack();
      if (!fallback) throw error;
      return fallback;
      // eslint-disable-next-line
    }
  }, [id]);

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
    findBook,
    isLoading: q.isLoading,
    isPending: q.isPending,
    error: q.error,
    hasMore: page * DISCOVERY_PAGE_LIMIT < results.length,
    loadMore,
  };
};

import { useEffect, useState } from "react";
import { useDebouncer } from "./useDebouncer";
import { useQuery } from "@tanstack/react-query";
import { searchFilms } from "../api/api";

export function useFilmSearch(query: string) {
  const debouncedText = useDebouncer(query.trim(), 400);
  const [page, setPage] = useState(1);

  // set page to 1 on every new search
  useEffect(() => {
    setPage(1);
  }, [debouncedText]);

  const q = useQuery({
    queryKey: ["search", "films", debouncedText, page],
    queryFn: () => searchFilms(debouncedText, page),
    enabled: debouncedText.length > 1,
  });

  const films = q.data ?? [];

  return {
    items: films,
    loadMore: () => setPage((p) => p + 1),
    isLoading: q.isLoading,
    error: q.error,
    isPending: q.isPending,
  };
}

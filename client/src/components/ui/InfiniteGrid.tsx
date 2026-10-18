import { Box, Grid } from "@mui/material";
import { MotionBox } from "../motioncomps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Book, Movie, Gamepad } from "@mui/icons-material";
import { DiscoveryCard } from "./Card";
import type { Book as BookType, Film, Game } from "../../assets/lib/types";
import { useDiscoverBooks } from "../../hooks/useDiscoverBooks";
import { useDiscoverFilms } from "../../hooks/useDiscoverFilms";
import { useDiscoverGames } from "../../hooks/useDiscoverGames";
import { page_limit } from "../../assets/lib/utils";

export type Category = "films" | "books" | "games";
export const InfiniteGrid = () => {
  // load more div
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [cat, setCat] = useState<Category>("films");
  // discovery hooks
  const discoverBook = useDiscoverBooks();
  const discoverFilm = useDiscoverFilms();
  const discoverGames = useDiscoverGames();
  const lm = useCallback(() => {
    if (cat === "books") {
      discoverBook.loadMore();
      return;
    }
    if (cat === "films") {
      discoverFilm.loadMore();
    }
    discoverGames.loadMore();
  }, [cat, discoverBook, discoverFilm, discoverGames]);
  useEffect(() => {
    const checkPos = (): boolean => {
      if (!loadMoreRef.current) return false;

      const rect = loadMoreRef.current.getBoundingClientRect();

      const isVis = rect.bottom <= window.innerHeight && rect.bottom >= 0;

      return isVis;
    };

    const handleScroll = () => {
      const isVisible = checkPos();

      if (isVisible) {
        lm();
        return;
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreRef]);

  const displayedData = useMemo(() => {
    if (cat === "books") {
      return discoverBook.books;
    }
    if (cat === "films") {
      return discoverFilm.films;
    }
    return discoverGames.games;
  }, [cat, discoverBook.books, discoverFilm.films, discoverGames.games]);
  const isLoading = useMemo(() => {
    if (cat === "books") {
      return discoverBook.isPending;
    }
    if (cat === "films") {
      return discoverFilm.isPending;
    }
    return discoverGames.isPending;
  }, [
    cat,
    discoverBook.isPending,
    discoverFilm.isPending,
    discoverGames.isPending,
  ]);

  const hasMore = cat === "books" && discoverBook.hasMore;
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeIn" }}
      sx={{ width: "100%", backgroundColor: "inherit", px: { xs: 2.5 } }}
      role="grid"
    >
      {/* header */}
      <MotionBox
        className="ig-header"
        sx={{
          height: 65,
          width: "100%",
          overflow: "hidden",
          py: 0.8,
          display: "flex",
          gap: 2.5,
          justifyContent: "space-evenly",
        }}
      >
        <Box
          className={`ig-header-ico ${cat === "books" ? "active" : ""}`}
          onClick={() => setCat("books")}
          sx={{
            ":after": {
              backgroundColor: "secondary.main",
              transition: "all 0.25s ease-in",
            },
          }}
        >
          <Book />
        </Box>
        <Box
          className={`ig-header-ico ${cat === "films" ? "active" : ""}`}
          onClick={() => setCat("films")}
          sx={{
            ":after": {
              backgroundColor: "secondary.main",
              transition: "all 0.25s ease-in",
            },
          }}
        >
          <Movie />
        </Box>
        <Box
          className={`ig-header-ico ${cat === "games" ? "active" : ""}`}
          onClick={() => setCat("games")}
          sx={{
            ":after": {
              backgroundColor: "secondary.main",
              transition: "all 0.25s ease-in",
            },
          }}
        >
          <Gamepad />
        </Box>
      </MotionBox>
      {/* grid */}
      <Grid
        container
        spacing={{ xs: 1.5 }}
        sx={{ minHeight: { xs: "100vh" }, backgroundColor: "inherit", mt: 2 }}
      >
        {displayedData.map((data, index) => (
          <Grid size={{ xs: 6, sm: 4, lg: 3 }} key={index}>
            <DiscoveryCard category={data.category} cardData={data} />
          </Grid>
        ))}

        {hasMore && (
          <div
            style={{ width: "100%", textAlign: "center", padding: 10 }}
            ref={loadMoreRef}
          >
            Load More
          </div>
        )}
      </Grid>
    </MotionBox>
  );
};

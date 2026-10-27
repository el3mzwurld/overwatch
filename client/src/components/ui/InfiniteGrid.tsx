import { Box, CircularProgress, Grid } from "@mui/material";
import { MotionBox } from "../motioncomps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Book, Movie, Gamepad } from "@mui/icons-material";
import { DiscoveryCard } from "./Card";
import { useDiscoverBooks } from "../../hooks/useDiscoverBooks";
import { useDiscoverFilms } from "../../hooks/useDiscoverFilms";
import { useDiscoverGames } from "../../hooks/useDiscoverGames";

export type Category = "films" | "books" | "games";
export const InfiniteGrid = () => {
  // load more div
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [cat, setCat] = useState<Category>("films");
  const [changeDelay, setChangeDelay] = useState(false);
  // discovery hooks
  const discoverBook = useDiscoverBooks();
  const discoverFilm = useDiscoverFilms();
  const discoverGames = useDiscoverGames();

  // load more
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
  }, [loadMoreRef, lm]);

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

  const changeCategory = (category: Category) => {
    setChangeDelay(true);

    setTimeout(() => {
      setCat(category);
      setChangeDelay(false);
    }, 800);
  };
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
          onClick={() => changeCategory("books")}
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
          onClick={() => changeCategory("films")}
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
          onClick={() => changeCategory("games")}
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
        sx={{
          minHeight: { xs: "100vh" },
          backgroundColor: "inherit",
          mt: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {changeDelay ? (
          <CircularProgress
            size={"3rem"}
            color="secondary"
            aria-label="data loading..."
          />
        ) : isLoading ? (
          <CircularProgress
            size={"3rem"}
            color="secondary"
            aria-label="data loading..."
          />
        ) : (
          displayedData.map((data, index) => (
            <Grid size={{ xs: 6, sm: 4, lg: 3 }} key={index}>
              <DiscoveryCard category={data.category} cardData={data} />
            </Grid>
          ))
        )}
      </Grid>
    </MotionBox>
  );
};

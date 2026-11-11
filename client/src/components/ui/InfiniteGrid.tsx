import { Box, CircularProgress, Grid } from "@mui/material";
import { MotionBox } from "../motioncomps";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Book, Movie, Gamepad } from "@mui/icons-material";
import { DiscoveryCard } from "./Card";
import { useDiscoverBooks } from "../../hooks/useDiscoverBooks";
import { useDiscoverFilms } from "../../hooks/useDiscoverFilms";
import { useDiscoverGames } from "../../hooks/useDiscoverGames";
import { useNavigate } from "react-router-dom";

export type Category = "films" | "books" | "games";
export const InfiniteGrid = () => {
  // load more div
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [cat, setCat] = useState<Category>("films");
  const [changeDelay, setChangeDelay] = useState(false);
  const nav = useNavigate();

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

  //pagination
  useEffect(() => {
    const checkPos = (): boolean => {
      if (!loadMoreRef.current) return false;

      const rect = loadMoreRef.current.getBoundingClientRect();

      const isVis = rect.top <= window.innerHeight && rect.bottom >= 0;

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
  //data to display
  const displayedData = useMemo(() => {
    if (cat === "books") {
      return discoverBook.books ?? [];
    }
    if (cat === "films") {
      return discoverFilm.films ?? [];
    }
    return discoverGames.games ?? [];
  }, [cat, discoverBook.books, discoverFilm.films, discoverGames.games]);
  //loading/pending state
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
  //category toggling
  const changeCategory = (category: Category | "default") => {
    setChangeDelay(true);

    if (category === "default") {
      setTimeout(() => {
        setCat("films");
        setChangeDelay(false);
      }, 800);

      return;
    }

    setTimeout(() => {
      setCat(category);
      setChangeDelay(false);
    }, 800);
  };

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
          height: { xs: "4em", md: "3.5em" },
          width: "100%",
          overflow: "hidden",
          py: 0.8,
          display: "flex",
          gap: 2.5,
          justifyContent: { xs: "space-evenly", md: "center" },
          px: { md: "15rem" },
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
        spacing={{ xs: 1.5, md: 3 }}
        sx={{
          minHeight: { xs: "100vh" },
          backgroundColor: "inherit",
          mt: 2,
          alignContent: "center",
          justifyContent: { xs: "center", md: "start" },
          overflow: "hidden",
          px: { md: "10em" },
        }}
      >
        {changeDelay ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              size={"3rem"}
              color="secondary"
              aria-label="data loading..."
            />
          </div>
        ) : isLoading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress
              size={"3rem"}
              color="secondary"
              aria-label="data loading..."
            />
          </div>
        ) : (
          <>
            {displayedData.map((data, index) =>
              !data ? (
                <div
                  style={{
                    width: "100%",
                    height: "50vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {
                    <ErrorBoundary
                      category={cat}
                      error={
                        cat === "books"
                          ? discoverBook.error!
                          : cat === "films"
                            ? discoverFilm.error!
                            : discoverGames.error!
                      }
                    />
                  }
                </div>
              ) : (
                <Grid
                  size={{ xs: 6, sm: 4, lg: 3 }}
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const category: Category =
                      data.category === "movie" || data.category == "tv"
                        ? "films"
                        : data.category === "book"
                          ? "books"
                          : "games";
                    const url = `/item/${category}/${data.externalId}`;
                    nav(url);
                  }}
                >
                  <DiscoveryCard category={data.category} cardData={data} />
                </Grid>
              ),
            )}

            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                margin: "1em 1em",
              }}
            >
              {cat === "games" && (
                <Box ref={loadMoreRef} sx={{ color: "text" }}>
                  {discoverGames.isLoading ? (
                    <CircularProgress
                      size={"1.25em"}
                      color="secondary"
                      aria-label="data loading..."
                    />
                  ) : discoverGames.hasMore ? (
                    `Load More...`
                  ) : null}
                </Box>
              )}

              {cat === "books" && (
                <div
                  ref={loadMoreRef}
                  style={{
                    width: "100%",
                    padding: "1em 1em",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {discoverBook.isLoading ? (
                    <CircularProgress
                      size={"1.25em"}
                      color="secondary"
                      aria-label="data loading..."
                    />
                  ) : discoverBook.hasMore ? (
                    "Load More"
                  ) : null}
                </div>
              )}
              {cat === "films" && (
                <div
                  ref={loadMoreRef}
                  style={{
                    width: "100%",
                    padding: "1em 1em",
                    display: "flex",
                    justifyContent: "center",
                    color: "secondary.main",
                  }}
                >
                  {discoverFilm.isLoading ? (
                    <CircularProgress
                      size={"1.25em"}
                      color="secondary"
                      aria-label="data loading..."
                    />
                  ) : discoverGames.hasMore ? (
                    "Load More"
                  ) : null}
                </div>
              )}
            </div>
          </>
        )}
      </Grid>
    </MotionBox>
  );
};

interface ErrorBoundaryState {
  category: Category;
  error: Error;
}
const ErrorBoundary = (props: ErrorBoundaryState) => {
  return (
    <p>
      {props.error
        ? props.error.message
        : `We hit a snag trying to get the ${props.category} data.`}
    </p>
  );
};

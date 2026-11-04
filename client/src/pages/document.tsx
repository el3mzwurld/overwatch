import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import type {
  Book,
  Film,
  FullMovie,
  FullTvShow,
  Game,
} from "../assets/lib/types";
import type { Category } from "../components/ui/InfiniteGrid";
import { useDiscoverFilms } from "../hooks/useDiscoverFilms";
import { useDiscoverBooks } from "../hooks/useDiscoverBooks";
import { useDiscoverGames } from "../hooks/useDiscoverGames";
import { Box, CircularProgress } from "@mui/material";
import { ContentPage } from "../components/ui/contentPage";

export const Document = () => {
  const [doc, setDoc] = useState<FullMovie | FullTvShow | Game | Book | null>(
    null,
  );
  const { category, id } = useParams();
  const { findFilm } = useDiscoverFilms();
  const { findBook } = useDiscoverBooks(id);
  const { findGame } = useDiscoverGames();
  useEffect(() => {
    if (!category || !id) return;
    async function fetchDoc() {
      if ((category as Category) === "films") {
        const film = await findFilm(id);
        setDoc(film);
        return;
      }
      if ((category as Category) === "games") {
        const iden = Number(id);
        setDoc(findGame(iden));
        return;
      }
      const book = await findBook();
      setDoc(book);
    }

    void fetchDoc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, category]);

  if (!category || !id || !doc) {
    <NotAccessible />;

    setTimeout(() => {
      <Navigate to={"/"} />;
    }, 800);

    return;
  }

  return <ContentPage content={doc}></ContentPage>;
};

const NotAccessible = () => {
  return (
    <Box style={{ fontSize: "0.7rem", color: "secondary.main" }}>
      <p>Sorry, we couldn't find what you're looking for...</p>
      <CircularProgress sx={{ color: "secondary.main", width: "2em" }} />
    </Box>
  );
};

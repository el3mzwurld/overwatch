import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import { Box, Button, CircularProgress } from "@mui/material";
import { ContentPage } from "../components/ui/contentPage";
import { Header } from "./landing";
import { MotionBox } from "../components/motioncomps";
import { ArrowBack } from "@mui/icons-material";

export const Document = () => {
  const [doc, setDoc] = useState<FullMovie | FullTvShow | Game | Book | null>(
    null,
  );
  const { category, id } = useParams();
  const { findFilm } = useDiscoverFilms();
  const { findBook } = useDiscoverBooks(id);
  const { findGame } = useDiscoverGames();
  const nav = useNavigate();

  const goBack = () => {
    nav(-1);
  };

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

  return (
    <Box>
      <Header />
      {/* navigation pane */}
      <MotionBox
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        sx={{ minHeight: 40, padding: { xs: 1.2 } }}
      >
        <Button variant="text" onClick={goBack} sx={{ color: "text.primary" }}>
          <ArrowBack sx={{ mr: 1 }} fontSize="small" /> Go back
        </Button>
      </MotionBox>
      <ContentPage content={doc}></ContentPage>
    </Box>
  );
};
const NotAccessible = () => {
  return (
    <Box style={{ fontSize: "0.7rem", color: "secondary.main" }}>
      <p>Sorry, we couldn't find what you're looking for...</p>
      <CircularProgress sx={{ color: "secondary.main", width: "2em" }} />
    </Box>
  );
};

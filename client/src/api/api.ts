import axios from "axios";
import type {
  Book,
  BookSearchResult,
  Film,
  FullMovie,
  FullTvShow,
  Game,
  GameSearchResult,
  Item,
} from "../assets/lib/types";
import { axiosInstance } from "./axiosInstance";

interface DiscoverFilmReturn {
  films: Film[];
}
export interface GameSearch {
  message: string;
  results: GameSearchResult[];
  // RAWG sends null on the last page
  nextPage: string | null;
}

// Open Library ids arrive as "/works/OL123W" but our route expects the bare id.
// A path like /items/books/book//works/OL123W would never match the route.
const toBareId = (id: string) =>
  encodeURIComponent(id.split("/").filter(Boolean).pop() ?? id);

// film endpoints
export async function discoverFilms(): Promise<Film[]> {
  try {
    const res = await axiosInstance.get("/items/films");
    const data: DiscoverFilmReturn = res.data;
    return data.films;
  } catch (error) {
    console.error("We encountered a hitch fetching your data", error);
    throw new Error("Failed to fetch films", { cause: error });
  }
}

export async function searchFilms(
  query: string,
  page?: number,
): Promise<Film[]> {
  try {
    const res = await axiosInstance.get("/items/films/search", {
      params: { q: query, page: page ?? 1 },
    });

    const data: { films: Film[] } = res.data;
    return data.films;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error("Failed to fetch films", { cause: error });
  }
}

// VERIFY(backend): this route must be registered AFTER /films/search,
// otherwise Express matches "search" as the :id param.
export async function getMovie(id: number): Promise<FullMovie> {
  try {
    const res = await axiosInstance.get(`/items/films/${id}`, {
      params: { type: "movie" },
    });
    const data: FullMovie = res.data.result;
    return data;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error(
      "Server Error : We had an issue getting this movie for you",
      { cause: error },
    );
  }
}

export async function getShow(id: number): Promise<FullTvShow> {
  try {
    const res = await axiosInstance.get(`/items/films/${id}`, {
      params: { type: "tv" },
    });
    const data: FullTvShow = res.data.result;
    return data;
  } catch (error) {
    console.error((error as Error).message);
    throw new Error(
      "Server Error : We had an issue getting this show for you",
      { cause: error },
    );
  }
}

// book endpoints
export async function discoverBooks(): Promise<Book[]> {
  try {
    const res = await axiosInstance.get("/items/books");
    // the server groups books by genre: [{ genre, books: [...] }, ...]
    const shelves: { genre: string; books: Book[] }[] = res.data.results;

    // flatten the shelves, and drop repeats since one book can sit in several genres
    // (duplicate ids would also cause duplicate React keys in the grid)
    const seen = new Set<string>();
    return shelves
      .flatMap((shelf) => shelf.books)
      .filter((book) => {
        if (seen.has(book.externalId)) return false;
        seen.add(book.externalId);
        return true;
      });
  } catch (error) {
    console.error((error as Error).message, (error as Error).cause);
    throw new Error(
      "Server Error : We hit a bump fetching those books for you. We're trying to fix that.",
      { cause: error },
    );
  }
}

export async function searchBook(query: string): Promise<BookSearchResult[]> {
  try {
    // VERIFY(backend): the query param name (`search` here, but the old Google
    // controller read `name`) and the response key (`results` vs `result`)
    const res = await axiosInstance.get("/items/books/find", {
      params: { search: query },
    });
    const data: BookSearchResult[] = res.data.results;
    return data;
  } catch (error) {
    console.error(
      `Error : ${(error as Error).message} \n Cause : ${(error as Error).cause}`,
    );
    throw new Error(
      "Server Error : We hit a bump fetching those books for you. We're trying to fix that.",
      { cause: error },
    );
  }
}

export async function getBookById(id: string): Promise<Book> {
  try {
    // VERIFY(backend): response key is `results` here; other detail routes use `result`
    const res = await axiosInstance.get(`/items/books/book/${toBareId(id)}`);
    const data: Book = res.data.results;
    return data;
  } catch (error) {
    console.error(
      `Error : ${(error as Error).message} \n Cause : ${(error as Error).cause}`,
    );
    throw new Error(
      "Server Error : We hit a bump fetching that book for you. We're trying to fix that.",
      { cause: error },
    );
  }
}

// game endpoints
export async function getGames(): Promise<Game[]> {
  try {
    // VERIFY(backend): discoverDefaultGames returns { results: Game[] }
    const res = await axiosInstance.get("/items/games");
    const data: Game[] = res.data.results;
    return data;
  } catch (error) {
    console.error(
      `Error : ${(error as Error).message} \n Cause : ${(error as Error).cause}`,
    );
    throw new Error(
      "Server Error : We hit a bump fetching those games for you. We're trying to fix that.",
      { cause: error },
    );
  }
}

export async function getGameBySlug(slug: string): Promise<Game> {
  try {
    const res = await axiosInstance.get(
      `/items/games/${encodeURIComponent(slug)}`,
    );
    // the server wraps the game as { message, results }, so unwrap it
    const data: Game = res.data.results;
    return data;
  } catch (error) {
    console.error(
      `Error : ${(error as Error).message} \n Cause : ${(error as Error).cause}`,
    );
    throw new Error(
      "Server Error : We hit a bump fetching that game for you. We're trying to fix that.",
      { cause: error },
    );
  }
}

export async function getGamesByGenre(genre: string): Promise<Game[]> {
  try {
    // VERIFY(backend): assumed to wrap its payload as { results } like the other
    // game routes (this used to read res.data directly). Confirm in Postman.
    const res = await axiosInstance.get(`/items/games/find-genre`, {
      params: { genre: genre.toLowerCase() },
    });
    const data: Game[] = res.data.results;
    return data;
  } catch (error) {
    console.error(
      `Error : ${(error as Error).message} \n Cause : ${(error as Error).cause}`,
    );
    throw new Error(
      "Server Error : We hit a bump fetching those games for you. We're trying to fix that.",
      { cause: error },
    );
  }
}

export async function searchGame(
  query: string,
  page?: number,
): Promise<GameSearchResult[]> {
  try {
    // VERIFY(backend): searchGame must read req.query.page, or "load more"
    // will keep returning page 1
    const res = await axiosInstance.get(`/items/games/find`, {
      params: { search: query.toLowerCase(), page: page ?? 1 },
    });
    const data: GameSearch = res.data.results;
    return data.results;
  } catch (error) {
    console.error(
      `Error : ${(error as Error).message} \n Cause : ${(error as Error).cause}`,
    );
    throw new Error(
      "Server Error : We hit a bump fetching those games for you. We're trying to fix that.",
      { cause: error },
    );
  }
}

// library endpoints (these need a token)
export async function createItem({
  category,
  title,
  notes,
  externalId,
  link,
}: {
  category: string;
  title: string;
  notes?: string;
  externalId: string;
  link: string;
}): Promise<Item> {
  const body = {
    category,
    title,
    notes,
    externalId,
    link,
  };

  try {
    const res = await axiosInstance.post("/items/add", body);
    return res.data.item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 409) {
        throw new Error("You already have this item in your library", {
          cause: error,
        });
      }
      if (status === 400) {
        throw new Error(
          "This item couldn't be saved because some details are missing or invalid",
          { cause: error },
        );
      }
      if (status === 401) {
        throw new Error("Please log in to add items to your library", {
          cause: error,
        });
      }
    }
    console.error(
      `Error : ${(error as Error).message}, Cause : ${(error as Error).cause}`,
    );
    throw new Error("We couldn't create this item", { cause: error });
  }
}

export async function fetchMyItems(
  category?: string,
  status?: string,
): Promise<Item[]> {
  try {
    // axios leaves undefined params out of the query string
    const res = await axiosInstance.get("/items/lib", {
      params: { category, status },
    });
    const data: Item[] = res.data.items;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("Please log in to see your library", { cause: error });
    }
    console.error(
      `Error : ${(error as Error).message}, Cause : ${(error as Error).cause}`,
    );
    throw new Error("We couldn't get your items", { cause: error });
  }
}

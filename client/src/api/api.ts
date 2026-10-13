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
  results: GameSearchResult;
  nextPage: string;
}
// film endpoints
export async function discoverFilms(): Promise<Film[]> {
  try {
    const res = await axiosInstance.get("/items/films");
    const data: DiscoverFilmReturn = res.data;
    return data.films;
  } catch (error) {
    console.log("We encountered a hitch fetching your data", error);
    throw new Error("Failed to fethc films", { cause: error });
  }
}

export async function searchFilms(query: string): Promise<Film[]> {
  try {
    const res = await axiosInstance.get("/items/films/search", {
      params: { q: query },
    });

    const data: { films: Film[] } = res.data;
    return data.films;
  } catch (error) {
    console.log((error as Error).message);
    throw new Error("Failed to fetch films", { cause: error });
  }
}
export async function getMovie(id: number): Promise<FullMovie> {
  try {
    const res = await axiosInstance.get(`/items/films/${id}`, {
      params: { type: "movie" },
    });
    const data: FullMovie = res.data.result;
    return data;
  } catch (error) {
    console.log((error as Error).message);
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
    console.log((error as Error).message);
    throw new Error(
      "Server Error : We had an issue getting this movie for you",
      { cause: error },
    );
  }
}

// book endpoints
export async function discoverBooks(): Promise<Book[]> {
  try {
    const res = await axiosInstance.get("/items/books");
    const data: Book[] = res.data.results;
    return data;
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
    const res = await axiosInstance.get(`items/books/book/${id}`);
    const data: Book = res.data.results;
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
// game endpoints
export async function getGames(): Promise<Game[]> {
  try {
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
    const res = await axiosInstance.get(`items/games/${slug}`);
    const data: Game = res.data;
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
export async function getGamesByGenre(genre: string): Promise<Game[]> {
  try {
    const res = await axiosInstance.get(`/items/games/find-genre`, {
      params: { genre: genre.toLowerCase() },
    });
    const data: Game[] = res.data;
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
): Promise<GameSearch> {
  try {
    const res = await axiosInstance.get(`/items/games/find`, {
      params: { search: query.toLowerCase(), page: page ?? 1 },
    });
    const data: GameSearch = res.data;
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
export async function createItem({
  category,
  title,
  externalId,
  link,
}: {
  category: string;
  title: string;
  notes: string;
  externalId: string;
  link: string;
}) {
  const body = {
    category,
    title,
    externalId,
    link,
  };

  try {
    const res = await axiosInstance.post("/items/add", body);
    const item = res.data.item;
    return item;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.status === 409) {
        throw new Error("You already have this item in your library", {
          cause: error,
        });
      }
      if (error.status === 400) {
        console.error("Bad request", error.message);
        return;
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
    const res = await axiosInstance.get("/items/lib", {
      params: { category: category ?? null, status: status ?? null },
    });
    const data: Item[] = res.data.items;
    return data;
  } catch (error) {
    console.error(
      `Error : ${(error as Error).message}, Cause : ${(error as Error).cause}`,
    );
    throw new Error("We couldn't get your items", { cause: error });
  }
}

import type {
  Book,
  Film,
  FullMovie,
  FullTvShow,
  Game,
  Item,
  ItemStatus,
} from "./types";

// this is for utility functions
const tok_store = import.meta.env.VITE_LOCAL_TOKEN_STORAGE;

export const setToken = (token: string) => {
  localStorage.setItem(tok_store, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(tok_store);
};

export const deleteToken = () => {
  localStorage.removeItem(tok_store);
};

export const paginator = <T>(
  arr: Array<T>,
  page: number,
  limit: number,
): Array<T> => {
  const totalItems = arr.length;

  const end = Math.min(page * limit, totalItems);

  return arr.slice(0, end);
};

export const DISCOVERY_PAGE_LIMIT = 18;

export const page_limit = 10;

export const MovieGenreMapper: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const TVGenreMapper: Record<number, string> = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

const filmtoItemNormalizer = (
  raw: Film | FullMovie | FullTvShow,
  status: ItemStatus,
): Item => {
  return {
    category: raw.category,
    externalId: raw.externalId,
    link: raw.externalUrl,
    notes: "",
    rating: 0,
    status,
    title: raw.title,
    userId: "", //this will be set inside the hook itself
  };
};

const bookToItemNormalizer = (raw: Book, status: ItemStatus): Item => {
  return {
    category: raw.category,
    externalId: raw.externalId,
    link: raw.externalUrl,
    notes: "",
    rating: 0,
    status,
    title: raw.title,
    userId: "",
  };
};
const gameToItemNormalizer = (raw: Game, status: ItemStatus): Item => {
  return {
    category: raw.category,
    externalId: raw.slug,
    link: `https://rawg.io/games/${raw.slug}`,
    notes: "",
    rating: 0,
    status,
    title: raw.name,
    userId: "",
  };
};

export function ItemNormalizer(
  raw: Book | Game | Film | FullMovie | FullTvShow,
  status: ItemStatus,
): Item {
  if (raw.category === "book") {
    return bookToItemNormalizer(raw, status);
  }
  if (raw.category === "game") {
    return gameToItemNormalizer(raw, status);
  }
  return filmtoItemNormalizer(raw, status);
}

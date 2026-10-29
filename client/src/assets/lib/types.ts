export type LoginResponse = {
  user: User;
  token: string;
};

export type User = {
  id: string;
  createdAt: string;
  email: string;
  userName: string;
};

export type Film = {
  externalId: string;
  category: "movie" | "tv";
  title: string;
  releaseDate: string;
  posterUrl: string;
  overview: string;
  externalUrl: string;
  metadata: {
    voteAverage: number;
    genreIds: number[];
  };
};

export type FullMovie = {
  externalId: string;
  category: "movie";
  title: string;
  releaseDate: string;
  posterUrl: string;
  backdrop: string;
  overview: string;
  runtime: string;
  releaseStatus: string;
  metaData: {
    voteAverage: number;
    genres: { id: number; name: string }[];
  };
};

export type FullTvShow = {
  externalId: string;
  category: "tv";
  title: string;
  releaseDate: string;
  posterUrl: string;
  backdrop: string;
  overview: string;
  runtime: string;
  releaseStatus: string;
  seasonCount: number;
  networks: {
    id: number;
    logo_path: string;
    name: string;
    origin_country: string;
  }[];
  metaData: {
    voteAverage: number;
    genres: { id: number; name: string }[];
  };
};
export type Book = {
  externalId: string;
  category: "book";
  title: string;
  authors: string[];
  publishDate: number;
  genres: string[];
  images: string | string[] | { thumbnail: string } | null;
  externalUrl: string;
  bookDesc: string;
  pageCount: number | null;
  metadata: {
    averageRating: number | null;
    ratingsCount: number | null;
  };
};

export type BookSearchResult = {
  author: string[];
  image: string;
  publishDate: number;
  title: string;
  externalId: string;
  series: string | null;
};

export type Game = {
  externalId: number;
  category: "game";
  slug: string;
  name: string;
  availablePlatforms: RAWGPlatfom[];
  availableStores: Store[];
  releaseDate: string;
  image: string;
  tags: {
    id: number;
    name: string;
    slug: string;
    language: string;
    games_count: 252272;
    image_background: string;
  };
  esrbRating: ESRB;
  genres: RAWGGenre[];
  analytics: RAWGAnalytics;
};

export type GameSearchResult = {
  externalId: number;
  slug: string;
  name: string;
  releaseDate: string;
  image: string;
  esrbRating: {
    id: number;
    name: string;
    slug: string;
  };
  analytics: {
    averageRating: number;
    metacriticRating: number;
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isFilm = (value: unknown): value is Film => {
  if (!isRecord(value) || !isRecord(value.metadata)) return false;

  return (
    typeof value.externalId === "string" &&
    (value.category === "movie" || value.category === "tv") &&
    typeof value.title === "string" &&
    typeof value.releaseDate === "string" &&
    typeof value.posterUrl === "string" &&
    typeof value.overview === "string" &&
    typeof value.externalUrl === "string" &&
    typeof value.metadata.voteAverage === "number" &&
    Array.isArray(value.metadata.genreIds) &&
    value.metadata.genreIds.every((id) => typeof id === "number")
  );
};

export const isBookSearchResult = (
  value: unknown,
): value is BookSearchResult => {
  if (!isRecord(value)) return false;

  return (
    Array.isArray(value.author) &&
    value.author.every((author) => typeof author === "string") &&
    typeof value.image === "string" &&
    typeof value.publishDate === "number" &&
    typeof value.title === "string" &&
    typeof value.externalId === "string"
  );
};

export const isGameSearchResult = (
  value: unknown,
): value is GameSearchResult => {
  if (
    !isRecord(value) ||
    !isRecord(value.esrbRating) ||
    !isRecord(value.analytics)
  ) {
    return false;
  }

  return (
    typeof value.externalId === "number" &&
    typeof value.slug === "string" &&
    typeof value.name === "string" &&
    typeof value.releaseDate === "string" &&
    typeof value.image === "string" &&
    typeof value.esrbRating.id === "number" &&
    typeof value.esrbRating.name === "string" &&
    typeof value.esrbRating.slug === "string" &&
    typeof value.analytics.averageRating === "number"
  );
};

type RAWGPlatfom = {
  id: number;
  name: string;
  slug: string;
};

type Store = {
  id: number;
  name: string;
  slug: string;
};

type ESRB = {
  id: number;
  name: string;
  slug: string;
  name_en: string;
  name_ru: string;
};

type RAWGGenre = {
  id: number;
  name: string;
  slug: string;
};

type RAWGAnalytics = {
  averageRating: number;
  ratingsAnalysis: Array<{
    id: number;
    title: "exceptional" | "recommended" | "meh" | "skip";
    count: number;
    percent: number;
  }>;
  ratingsCount: number;
  metacriticRating: number;
};

export type Item = {
  userId: string;
  category: "movie" | "book" | "game" | "tv";
  title: string;
  status: "want" | "in progress" | "finished" | "dropped";
  rating: number;
  notes: string;
  externalId: string;
  link: string;
};

export type Playlist = {
  items: Item[];
};

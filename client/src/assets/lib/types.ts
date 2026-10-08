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

export type Book = {
  externalId: string;
  category: "book";
  title: string;
  authors: string[];
  publishDate: string;
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
  author: string;
  image: string;
  publishDate: string;
  title: string;
  externalId: string;
  series: string | null;
};

export type Game = {
  externalId: number;
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

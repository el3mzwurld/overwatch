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

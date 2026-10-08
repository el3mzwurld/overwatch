import jwt from "jsonwebtoken";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const TMDB_IMG_URL = "https://image.tmdb.org/t/p/w500";

/**
 *The following functions are for email and password validation
 @param {string} email
 @param {string} password
 @returns {boolean}
 */
export const testEmail = (string) => {
  if (typeof string !== "string") return false;
  return EMAIL_REGEX.test(string);
};

export const testPassword = (string) => {
  if (typeof password !== "string") return false;
  return PASSWORD_REGEX.test(string);
};

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

export const verifyJwt = (token) => {
  if (!token) return null;

  return jwt.verify(token, process.env.JWT_SECRET);
};

export const normalizeMovie = (movie) => {
  const normalized = {
    externalId: `movie-${movie.id}`,
    category: "movie",
    title: movie.title,
    releaseDate: movie.release_date,
    posterUrl: movie.poster_path ? `${TMDB_IMG_URL}${movie.poster_path}` : null,
    overview: movie.overview,
    externalUrl: `https://www.themoviedb.org/movie/${movie.id}`,
    metadata: {
      voteAverage: movie.vote_average,
      genreIds: movie.genre_ids,
    },
  };

  return normalized;
};
export const normalizeShow = (show) => {
  const normalized = {
    externalId: `tv-${show.id}`,
    category: "tv",
    title: show.name,
    releaseDate: show.first_air_date,
    posterUrl: show.poster_path ? `${TMDB_IMG_URL}${show.poster_path}` : null,
    overview: show.overview,
    externalUrl: `https://www.themoviedb.org/tv/${show.id}`,
    metadata: {
      voteAverage: show.vote_average,
      genreIds: show.genre_ids,
    },
  };

  return normalized;
};

export const normalikeBook = (work) => {
  return {
    externalId: work.key, // "/works/OL16813053W"
    category: "book",
    title: work.title,
    authors: work.authors?.map((a) => a.name) || [],
    publishDate: work.first_publish_year
      ? String(work.first_publish_year)
      : work.first_publish_date
        ? work.first_publish_date
        : null,
    genres: work.subject || work.subjects || [],
    images:
      work.cover_id || work.covers || []
        ? {
            thumbnail: `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`,
          }
        : null,
    externalUrl: `https://openlibrary.org${work.key}`,
    bookDesc: "", // not present on this endpoint — filled in via getBookById
    pageCount: null, // not present here either
    metadata: {
      averageRating: null, // requires separate ratings call
      ratingsCount: null,
    },
  };
};

export const normalizeSearchedBook = (work) => {
  const normalized = {
    author: work.author_name,
    image: work.cover_i,
    publishDate: work.first_publish_year,
    title: work.title,
    externalId: work.key,
    series: work.series_key ?? null,
    metadata: {
      averageRating: null,
      ratingsCount: null,
    },
  };

  return normalized;
};

export const normalizeGame = (result) => {
  const normalized = {
    externalId: result.id,
    slug: result.slug,
    name: result.name,
    availablePlatforms: result.platforms,
    availableStores: result.stores,
    releaseDate: result.released,
    image: result.background_image,
    tags: result.tags,
    esrbRating: result.esrb_rating,
    genres: result.genres,
    analytics: {
      averageRating: result.rating,
      ratingsAnalysis: result.ratings,
      ratingsCount: result.ratings_count,
      metacriticRating: result.metacritic,
    },
  };

  return normalized;
};
export const DISCOVER_SUBJECTS = [
  "fiction",
  "action",
  "adventure",
  "mystery",
  "science",
  "biography",
  "fantasy",
];

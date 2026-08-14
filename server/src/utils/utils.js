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

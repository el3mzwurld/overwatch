import { normalizeMovie, normalizeShow } from "../utils/utils.js";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const tmdb_key = process.env.TMDB_AUTH_HEADER;
const fetchTMDB = async (endpoint) => {
  // build the url
  const url = `${TMDB_BASE_URL}${endpoint}`;
  // fetch from the api
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tmdb_key}`,
    },
  });

  if (!res.ok) throw new Error(`TMDB Request Failed, ${res.status}`);
  const data = await res.json();
  return data;
};

export async function getFilms(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  try {
    const [movieRes, showRes] = await Promise.allSettled([
      fetchTMDB(`/movie/popular?page=${page}`),
      fetchTMDB(`/tv/popular?page=${page}`),
    ]);

    const normalizedMovies = movieRes.value.results.map((m) => {
      return normalizeMovie(m);
    });
    const normalizedShows = showRes.value.results.map((s) => {
      return normalizeShow(s);
    });

    // merge both films into one normalizedFilms object
    const normalizedFilms = [...normalizedMovies, ...normalizedShows];

    return res.json({ films: normalizedFilms, page });
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch films: ${error.message}, ${error.cause}`,
    });
  }
}

export const searchFilms = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }
  try {
    const [movieRes, tvRes] = await Promise.allSettled([
      fetchTMDB(`/search/movie?query=${encodeURIComponent(q)}`),
      fetchTMDB(`/search/tv?query=${encodeURIComponent(q)}`),
    ]);

    // normalize movies and shows
    const movies =
      movieRes.status === "fulfilled"
        ? movieRes.value.results.map((m) => {
            return normalizeMovie(m);
          })
        : [];
    const shows =
      tvRes.status === "fulfilled"
        ? tvRes.value.results.map((t) => {
            return normalizeShow(t);
          })
        : [];

    const searchResults = [...movies, ...shows];

    return res.json({ films: searchResults });
  } catch (error) {
    res.status(500).json({
      error: `Failed to fetch search results for this query: ${error.message}`,
    });
  }
};

export const getFilm = async (req, res) => {
  const { id, type } = req.query;
  if (!id || !type) {
    return res.status(400).json({
      error:
        "Bad request: The film id and film type is required to access this endpoint",
    });
  }

  if (type !== "movie" || type !== tv) {
    return res.status(400).json({
      error:
        "Bad Request : Critical Error : query param type must only be movie or tv",
    });
  }
  const endpoint = `/${type === "movie" ? "movie" : "tv"}/${id}`;

  try {
    let result;
    const data = await fetchTMDB(endpoint);
    if (type === "movie") {
      result = data.movieres;
    }
  } catch (error) {}
};

export const getFilmDetails = async (req, res) => {};

import { normalizeMovie, normalizeShow } from "../utils/utils.js";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const fetchTMDB = async (endpoint) => {
  // build the url
  const url = `${TMDB_BASE_URL}${endpoint}&api_key=${process.env.TMDB_KEY}`;
  // fetch from the api
  const res = await fetch(url);

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
    res.status(500).json({ error: `Failed to fetch films: ${error.message}` });
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

import { normalizeMovie, normalizeShow } from "../utils/utils";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const fetchTMDB = async (endpoint, page) => {
  // build the url
  const url = `${TMDB_BASE_URL}${endpoint}&api_key=${process.env.TMDB_KEY}`;
  // fetch from the api
  const res = await fetch(url);

  if (!res.ok) throw new Error("TMDB Request failed:", res.status);
  return res.json();
};

export async function getFilms(req, res) {
  const page = Math.max(1, Number(req.query.page) || 1);
  try {
    const [movieRes, showRes] = await Promise.all([
      fetchTMDB(`/movie/popular?page=${page}`),
      fetchTMDB(`/tv/popular?page=${page}`),
    ]);

    //   normalize films
    const normalizedMovies = movieRes.results.map((m) => {
      return normalizeMovie(m);
    });
    const normalizedShows = showRes.results.map((s) => {
      return normalizeShow(s);
    });

    // merge both films into one normalizedFilms object
    const normalizedFilms = [...normalizedMovies, ...normalizedShows];

    return res.json({ films: normalizedFilms, page });
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch films: ${error.message}` });
  }
}

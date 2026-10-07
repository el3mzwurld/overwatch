import { DISCOVER_SUBJECTS, normalikeBook } from "../utils/utils.js";
const BASE_URL = "https://openlibrary.org";

const fetchOpenLib = async (endpoint = "") => {
  const url = `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(
        `There seems to have been an issue fetching the books for you...${response.status}`,
      );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Fetch func : ", error.message, error.cause);
    throw new Error(
      `There seems to have been an issue fetching the books for you...${error.message ?? null}, ${error.cause}`,
    );
  }
};

export const discoverBooks = async (req, res) => {
  try {
    const results = await Promise.allSettled(
      DISCOVER_SUBJECTS.map(async (cat) => {
        const endpoint = `/subjects/${encodeURIComponent(cat.toLowerCase())}.json?limit=10&details=false&has_fulltext=false&sort=${encodeURIComponent("rating desc")}`;
        const r = await fetchOpenLib(endpoint);

        const books = (r.works || []).map((work) => normalikeBook(work));

        return {
          genre: cat,
          books,
        };
      }),
    );
    const results_actual = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);
    return res.status(200).json({ results: results_actual });
  } catch (error) {
    console.log({ error: error.message });
    res.status(500).json({
      message: `We hit a snag while fetching the books on our end, ${error.message}`,
    });
  }
};

export const getBook = async (req, res) => {
  const bookID = req.params.id;

  if (!bookID) {
    return res.status(400).json({
      error: "Bad Request : book Id not provided in the request parameter",
    });
  }

  const endpoint = `/works/${bookID}.json`;
  const rating_endpoint = `/works/${bookID}/ratings.json`;
  try {
    const data = await fetchOpenLib(endpoint);
    const ratings = await fetchOpenLib(rating_endpoint);
    const authors = await fetchOpenLib(`${data.authors[0].author.key}.json`);

    const normalized = normalikeBook(data);
    normalized.metadata.averageRating = ratings?.summary?.average;
    normalized.metadata.ratingsCount = ratings?.summary?.count;
    normalized.authors = authors.name;
    return res.status(200).json({ results: normalized });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchBook = async (req, res) => {
  const query = req.query.search;

  if (!query) {
    return res.status(400).json({ error: "Bad request : Unprovided Query" });
  }

  const endpoint = `/search.json?q=${encodeURIComponent(query)}`;

  try {
    const data = await fetchOpenLib(endpoint);
    const results = normalikeBook(data.docs);
    return res.status(200).json({ query: query, data });
  } catch (error) {
    console.error(error.message, error.cause);
    res.status(500).json({ error: error.message });
  }
};

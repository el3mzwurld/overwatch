import axios from "axios";
import { normalizeGame } from "../utils/utils.js";

const RAWG_KEY = process.env.RAWG_KEY;
const base_url = "https://api.rawg.io/api";
const fetchRawg = async (endpoint = "") => {
  if (endpoint.trim().length === 0) return;
  const url = `${base_url}${endpoint}`;

  try {
    const response = await axios.get(url);
    const data = await response.data;
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch RAWG data:", error.cause);
  }
};

export const discoverDefaultGames = async (req, res) => {
  const { page } = req.query;

  let pageNum = page;
  if (!page) {
    pageNum = 1;
  }

  const minimum_rating = 80;
  const highest_rating = 100;
  const page_size = 10;

  const endpoint = `/games?page=${pageNum}&metacritic=${minimum_rating},${highest_rating}&page_size=${page_size}&key=${RAWG_KEY}`;

  try {
    const data = await fetchRawg(endpoint);
    const normalized = data.results.map((raw) => normalizeGame(raw));
    res
      .status(200)
      .json({ message: "Success", results: normalized, nextPage: data.next });
  } catch (error) {
    res.status(200).json({ error: error.message, cause: error.cause });
    console.log(error.message);
  }
};

export const getGame = async (req, res) => {
  const { slug } = req.params;

  if (!slug || !String(slug)) {
    return res
      .status(400)
      .json({ error: "Bad request, search parameter not included in request" });
  }

  const endpoint = `/games/${encodeURIComponent(slug)}?key=${RAWG_KEY}`;
  try {
    const data = await fetchRawg(endpoint);
    res.status(200).json({ message: "Success", results: data });
  } catch (error) {
    res.status(200).json({ error: error.message, cause: error.cause });
    console.log(error.message);
  }
};

export const discoverByGenre = async (req, res) => {
  const genre = req.query.genre || "spider";

  const endpoint = `/games?genres=${genre}&key=${RAWG_KEY}`;
  try {
    const data = await fetchRawg(endpoint);
    const normalized = data.results.map((raw) => normalizeGame(raw));
    res
      .status(200)
      .json({ message: "Success", results: normalized, nextPage: data.next });
  } catch (error) {
    res.status(200).json({ error: error.message, cause: error.cause });
    console.log(error.message);
  }
};

export const searchGame = async (req, res) => {
  const { search } = req.query;

  if (!search || !String(search)) {
    return res.status(400).json({ error: "Bad request" });
  }

  const endpoint = `/games?search=${encodeURIComponent(search)}&key=${RAWG_KEY}`;
  try {
    const data = await fetchRawg(endpoint);
    const normalized = data.results.map((raw) => normalizeGame(raw));
    res
      .status(200)
      .json({ message: "Success", results: normalized, nextPage: data.next });
  } catch (error) {
    res.status(200).json({ error: error.message, cause: error.cause });
    console.log(error.message);
  }
};

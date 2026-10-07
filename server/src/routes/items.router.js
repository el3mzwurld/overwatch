import { reqAuth } from "../middleware/reqAuth.js";
import { Router } from "express";
import {
  fetchItems,
  createItem,
  deleteItem,
  updateItem,
  getById,
} from "../controllers/items.controller.js";
import { getFilms, searchFilms } from "../controllers/tmdb.controller.js";
import {
  discoverBooks,
  getBook,
  searchBook,
} from "../controllers/googleBooks.controller.js";
import {
  discoverByGenre,
  discoverDefaultGames,
  getGame,
  searchGame,
} from "../controllers/rawg.controller.js";

const router = Router();

//discover films
router.get("/films", getFilms);
// search films
router.get("/films/search", searchFilms);
// discover books
router.get("/books", discoverBooks);
// get book
router.get("/books/book/:id", getBook);
// find book
router.get("/books/find", searchBook);
//DISCOVER GAMES
router.get("/games", discoverDefaultGames);
// GET GAME BY GENRE
router.get("/games/find-genre", discoverByGenre);
// FIND MOVIE
router.get("/games/find", searchGame);
// GET GAME BY SLUG/ID
router.get("/games/:slug", getGame);
// create item
router.post("/add", reqAuth, createItem);
// get all items
router.get("/", reqAuth, fetchItems);
// patch an item
router.patch("/edit/:id", updateItem);
// delete an item
router.delete("/delete/:id", deleteItem);
// get by id
router.get("/:id", getById);

export default router;

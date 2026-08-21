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

const router = Router();

//discover films
router.get("/films", getFilms);
// search films
router.get("/films/search", searchFilms);

// middleware
router.use(reqAuth);

// create item
router.post("/add", createItem);
// get all items
router.get("/", fetchItems);
// patch an item
router.patch("/edit/:id", updateItem);
// delete an item
router.delete("/delete/:id", deleteItem);
// get by id
router.get("/:id", getById);

export default router;

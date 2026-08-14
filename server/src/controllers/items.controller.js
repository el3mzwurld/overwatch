import { Item } from "./../models/item.model.js";
import mongoose from "mongoose";

// get items
export const fetchItems = async (req, res) => {
  // get user id
  const userId = req.user.id;
  // get category or status
  const { category, status } = req.query;

  const filter = { userId };
  if (category) filter.category = category;
  if (status) filter.status = status;
  try {
    const items = await Item.find(filter);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: `Server error ${error.message}` });
    console.error(error);
  }
};

export const createItem = async (req, res) => {
  // get user id
  const userId = req.user.id;
  const { category, status, title, rating, notes, externalId, metadata, link } =
    req.body;

  // check for title and category
  if (!title || !category || !externalId) {
    return res.status(400).json({
      error: "Bad request : Please ensure you pass all required parameters",
    });
  }
  // check if it's in our type
  const cats = ["movie", "book", "game"];
  if (!cats.includes(category)) {
    return res.status(400).json({
      error: "Bad request : Please ensure you use a valid category",
    });
  }
  const statusCats = ["want", "in progress", "finished", "dropped"];
  const newItem = {
    userId,
    category,
    title,
    externalId,
  };
  //   optional attributes
  if (status && !statusCats.includes(status)) {
    return res
      .status(400)
      .json({ error: "Bad request: Please use a valid status." });
  }
  if (status) newItem.status = status;
  if (rating) newItem.rating = rating;
  if (notes) newItem.notes = notes;
  if (metadata) newItem.metadata = metadata;
  if (link) newItem.link = link;

  try {
    //   create the item
    const item = new Item(newItem);
    //   save the item
    await item.save();
    res.status(201).json({ message: "success", item: item });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    console.error(error.message);
  }
};

export const updateItem = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  // editable fields are only rating status and notes
  const { status, rating, notes } = req.body;
  const updatedItem = {};
  // status enum
  const statusCats = ["want", "in progress", "finished", "dropped"];
  if (status && !statusCats.includes(status)) {
    return res
      .status(400)
      .json({ error: "Bad request: Please use a valid status category" });
  }
  // check rating
  if (rating && (rating < 0 || rating > 10)) {
    return res.status(400).json({
      error: "Bad request: Please use a valid rating within our boundary",
    });
  }

  if (status) updatedItem.status = status;
  if (rating) updatedItem.rating = rating;
  if (notes) updatedItem.notes = notes;
  try {
    const update = await Item.findOneAndUpdate(
      { _id: id, userId: userId },
      { $set: updatedItem },
      { new: true },
    );
    if (!update) {
      return res.status(404).json({
        error: "This resource doesn't exist",
      });
    }

    res.status(200).json({ item: update });
  } catch (error) {
    res.status(500).json({ error: `Server error ${error.message}` });
    console.error(error);
  }
};

export const deleteItem = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const item = await Item.findOneAndDelete({ _id: id, userId: userId });
    if (!item) {
      return res
        .status(404)
        .json({ error: "This item wasn't found, nothing was deleted." });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: `Server error ${error.message}` });
    console.error(error);
  }
};

export const getById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const item = await Item.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ error: "Resource not found" });
    }
    res.status(200).json({ item: item });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    console.error(error.message);
  }
};

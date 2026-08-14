import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["movie", "book", "game", "tv"],
      trim: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      enum: ["want", "in progress", "finished", "dropped"],
      default: "want",
    },
    rating: {
      type: Number,
      min: [0, "Rating must be at least 1"],
      max: [10, "Rating must be at most 10"],
      default: 0,
    },
    notes: {
      type: String,
    },
    externalId: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    link: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Item = mongoose.model("Item", itemSchema);

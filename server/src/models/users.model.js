import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  userName: {
    type: String,
    lowercase: true,
    required: true,
    unique: true,
    trim: true,
  },
});

export const User = mongoose.model("User", userSchema);

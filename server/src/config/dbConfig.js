import mongoose from "mongoose";

export const databaseConfig = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongo db connected succesfully via mongoose");
  } catch (error) {
    console.error(
      "There was a problem connecting to server side storage.",
      error.message,
    );
    process.exit(1);
  }
};

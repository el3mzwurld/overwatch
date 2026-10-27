import express from "express";
import cors from "cors";
import * as dotenv from "dotenv/config";
import dns from "dns";
import { databaseConfig } from "./src/config/dbConfig.js";
import authRouter from "./src/routes/auth.router.js";
import itemsRouter from "./src/routes/items.router.js";
const app = express();

// cors middleware
app.use(cors({ origin: ["http://localhost:5173"] }));
// express middleware
app.use(express.json());
// authentication
app.use("/auth", authRouter);
app.use("/items", itemsRouter);
// dns server fix
dns.setServers(["8.8.8.8", "1.1.1.1"]);
// database connect
databaseConfig();
app.get("/", (req, res) => {
  res.send({ message: "Hi, Welcome to overwatch!" });
});
app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});

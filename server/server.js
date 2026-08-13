import express from "express";
import * as dotenv from "dotenv/config";
import dns from "dns";
import { databaseConfig } from "./src/config/dbConfig.js";
import authRouter from "./src/routes/auth.router.js";
const app = express();

// express middleware
app.use(express.json());
app.use("/auth", authRouter);
// dns server fix
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// database connect
databaseConfig();

app.get("/", (req, res) => {
  res.send({ message: "Hi, Welcome to LogX" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});

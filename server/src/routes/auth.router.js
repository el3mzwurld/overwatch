import { Router } from "express";
import { register, login, getUser } from "../controllers/auth.controller.js";
import { reqAuth } from "../middleware/reqAuth.js";

const router = Router();

// authentication
router.post("/reg", register);
router.post("/login", login);
router.get("/me", reqAuth, getUser);
export default router;

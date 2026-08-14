import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { reqAuth } from "../middleware/reqAuth.js";

const router = Router();

// authentication
router.post("/reg", register);
router.post("/login", login);

export default router;

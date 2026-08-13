import { verifyJwt } from "../utils/utils.js";

export const reqAuth = (req, res, next) => {
  // pull the header
  const authHeader = req.headers.authorization;

  // return if there's no header or the header doesn't include a bearer token
  if (!authHeader || !authHeader.includes("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or malformed Authorization header" });
  }
  //   get the token from the header
  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyJwt(token);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ error: "Session expired. Please log in again." });
    }
    return res.status(401).json({ error: "Invalid token." });
  }
};

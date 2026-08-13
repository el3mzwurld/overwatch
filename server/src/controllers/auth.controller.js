import bcrypt from "bcrypt";
import { User } from "../models/users.model.js";
// utils
import { signToken, testEmail, testPassword } from "../utils/utils.js";

export const register = async (req, res) => {
  const { userName, email, password } = req.body;
  // check all fields
  if (!userName || !email || !password) {
    return res.status(400).json({
      error: "Bad Request : Please ensure you pass all required parameters.",
    });
  }

  try {
    //   check if a user's email already exists
    const hasUser = await User.findOne({ email: String(email) });

    if (hasUser) {
      return res
        .status(409)
        .json({ error: "A user already exists with this email address." });
    }
    //   hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      userName,
      email,
      passwordHash,
    });
    //   save user
    user.save();

    return res.status(200).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    console.log(error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Bad Request : Ensure you fill all required fields" });
  }

  try {
    const user = await User.findOne({ email: String(email) });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!isValid) {
      return res.status(409).json({ error: "Invalid credentials" });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };
    // sign token
    const token = signToken(payload);
    //   get showable user property
    const { passwordHash, ...passedUser } = user.toObject();

    res
      .status(200)
      .json({ message: "Login Successful", user: passedUser, token: token });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
    console.log(error.message);
  }
};

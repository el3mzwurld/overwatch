import jwt from "jsonwebtoken";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 *The following functions are for email and password validation
 @param {string} email
 @param {string} password
 @returns {boolean}
 */
export const testEmail = (string) => {
  if (typeof string !== "string") return false;
  return EMAIL_REGEX.test(string);
};

export const testPassword = (string) => {
  if (typeof password !== "string") return false;
  return PASSWORD_REGEX.test(string);
};

export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "30m",
  });
};

export const verifyJwt = (token) => {
  if (!token) return null;

  return jwt.verify(token, process.env.JWT_SECRET);
};

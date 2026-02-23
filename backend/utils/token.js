import jwt from "jsonwebtoken";

export function createJSONToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function validateJSONToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

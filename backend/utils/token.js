import "../loadEnv.js";
import jwt from "jsonwebtoken";
import { resolveJwtSecret } from "./jwtSecret.js";

export { resolveJwtSecret };

const JWT_SECRET = resolveJwtSecret(process.env.JWT_SECRET);

export function createJSONToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function validateJSONToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

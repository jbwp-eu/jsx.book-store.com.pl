import { describe, expect, it } from "vitest";
import { resolveJwtSecret } from "../utils/jwtSecret.js";

describe("resolveJwtSecret", () => {
  it("rejects missing, short, and known placeholders", () => {
    expect(() => resolveJwtSecret(undefined)).toThrow(/JWT_SECRET/);
    expect(() => resolveJwtSecret("")).toThrow(/JWT_SECRET/);
    expect(() => resolveJwtSecret("1234")).toThrow(/JWT_SECRET/);
    expect(() => resolveJwtSecret("change-me")).toThrow(/JWT_SECRET/);
    expect(() => resolveJwtSecret("short")).toThrow(/JWT_SECRET/);
  });

  it("accepts a random secret of at least 32 characters", () => {
    const secret = "a".repeat(32);
    expect(resolveJwtSecret(secret)).toBe(secret);
    expect(resolveJwtSecret(`  ${secret}  `)).toBe(secret);
  });
});

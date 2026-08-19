const FORBIDDEN_JWT_SECRETS = new Set([
  "1234",
  "change-me",
  "change-me-long-random",
]);

/** Rejects missing, short, and known placeholders. */
export function resolveJwtSecret(raw) {
  const secret = raw?.trim() ?? "";
  if (FORBIDDEN_JWT_SECRETS.has(secret) || secret.length < 32) {
    throw new Error(
      "JWT_SECRET must be set to a random string of at least 32 characters (e.g. openssl rand -hex 32)",
    );
  }
  return secret;
}

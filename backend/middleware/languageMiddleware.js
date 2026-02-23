import { t } from "../utils/translate.js";

/**
 * Sets req.language from query and attaches req.t.
 * Must be registered before routes that use req.t.
 */
export function languageMiddleware(req, res, next) {
  req.language = req.query.language;
  req.t = (key, vars) => t(req.language, key, vars);
  next();
}

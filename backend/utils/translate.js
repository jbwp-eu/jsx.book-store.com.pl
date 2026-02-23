import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, "../locales");
const en = JSON.parse(
  readFileSync(path.join(localesDir, "en.json"), "utf-8")
);
const pl = JSON.parse(
  readFileSync(path.join(localesDir, "pl.json"), "utf-8")
);




const messages = { en, pl };

/**
 * Normalize language from query (PL, GB, etc.) to locale key (pl, en).
 * @param {string} lang - Language from req.query.language or req.ln
 * @returns {'pl'|'en'}
 */
export function normalizeLang(lang) {
  const l = String(lang || "").toUpperCase();
  return l === "PL" ? "pl" : "en";
}

/**
 * Get nested value by dot path, e.g. "user.notFound" -> messages.en.user.notFound
 */
function getNested(obj, key) {
  const parts = key.split(".");
  let v = obj;
  for (const p of parts) {
    if (v == null) return undefined;
    v = v[p];
  }
  return v;
}

/**
 * Replace {{var}} placeholders in string with values from vars.
 * @param {string} str
 * @param {Record<string, string|number>} [vars]
 */
function interpolate(str, vars = {}) {
  if (!str || typeof str !== "string") return str;
  let out = str;
  for (const [k, v] of Object.entries(vars)) {
    out = out.replace(new RegExp(`\\{\\{${k}\\}\\}`, "g"), String(v));
  }
  return out;
}

/**
 * Translate by key for the given language.
 * @param {string} lang - Language (PL, pl, en, etc.); normalized via normalizeLang.
 * @param {string} key - Dot path, e.g. "user.notFound"
 * @param {Record<string, string|number>} [vars] - Optional interpolation vars, e.g. { title: "Book" }
 * @returns {string}
 */
export function t(lang, key, vars = {}) {
  const locale = normalizeLang(lang);
  const dict = messages[locale] || messages.en;
  const value = getNested(dict, key);
  const str = value != null ? String(value) : getNested(messages.en, key) ?? key;
  return interpolate(str, vars);
}

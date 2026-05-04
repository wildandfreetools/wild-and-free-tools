import { randomInt } from "node:crypto";
import { SITE_BASE } from "../../config.js";

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>/?",
};

export default {
  name: "password_generator",
  description: "Generate cryptographically random passwords with configurable length and character classes.",
  inputSchema: {
    type: "object",
    properties: {
      length: { type: "number", default: 16, minimum: 4, maximum: 256 },
      count: { type: "number", default: 1, minimum: 1, maximum: 100 },
      lowercase: { type: "boolean", default: true },
      uppercase: { type: "boolean", default: true },
      digits: { type: "boolean", default: true },
      symbols: { type: "boolean", default: true },
      excludeAmbiguous: { type: "boolean", default: false, description: "Exclude characters that look alike: 0, O, 1, l, I" },
    },
  },
  async run({ length = 16, count = 1, lowercase = true, uppercase = true, digits = true, symbols = true, excludeAmbiguous = false } = {}) {
    const ambiguous = "0O1lI";
    let pool = "";
    if (lowercase) pool += SETS.lower;
    if (uppercase) pool += SETS.upper;
    if (digits) pool += SETS.digits;
    if (symbols) pool += SETS.symbols;
    if (excludeAmbiguous) pool = pool.split("").filter((c) => !ambiguous.includes(c)).join("");
    if (!pool) return "Select at least one character class.";
    const len = Math.max(4, Math.min(256, Math.floor(length)));
    const n = Math.max(1, Math.min(100, Math.floor(count)));
    const passwords = [];
    for (let p = 0; p < n; p++) {
      let pw = "";
      for (let i = 0; i < len; i++) pw += pool[randomInt(pool.length)];
      passwords.push(pw);
    }
    return {
      passwords,
      length: len,
      count: n,
      webVersion: `${SITE_BASE}/generator-tools/password-generator/`,
    };
  },
};

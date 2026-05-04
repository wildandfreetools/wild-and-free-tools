import { SITE_BASE } from "../../config.js";

export default {
  name: "slug_generator",
  description: "Convert text into a URL-friendly slug. Lowercases, removes accents, replaces spaces and special characters with hyphens, collapses repeats.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Text to convert into a slug" },
      separator: { type: "string", default: "-", description: "Separator character between words" },
      lowercase: { type: "boolean", default: true },
      maxLength: { type: "number", default: 100, description: "Maximum slug length" },
    },
    required: ["input"],
  },
  async run({ input, separator = "-", lowercase = true, maxLength = 100 }) {
    let s = (input || "")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9\s-_]/g, "")
      .trim()
      .replace(/[\s\-_]+/g, separator);
    if (lowercase) s = s.toLowerCase();
    const sep = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    s = s.replace(new RegExp(`^${sep}+|${sep}+$`, "g"), "");
    if (s.length > maxLength) {
      s = s.slice(0, maxLength).replace(new RegExp(`${sep}[^${sep}]*$`), "");
    }
    return s;
  },
};

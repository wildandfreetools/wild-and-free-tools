import { SITE_BASE } from "../../config.js";

const CASES = ["lowercase", "uppercase", "title", "sentence", "camel", "pascal", "snake", "kebab", "constant", "dot"];

function titleCase(s) {
  return s.toLowerCase().replace(/\b([a-z])/g, (_, c) => c.toUpperCase());
}

function sentenceCase(s) {
  return s.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, (_, p, c) => p + c.toUpperCase());
}

function tokens(s) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_\-.]+/g, " ")
    .replace(/[^A-Za-z0-9 ]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

export default {
  name: "text_case_converter",
  description: "Convert text between case formats: lowercase, UPPERCASE, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Text to convert" },
      format: { type: "string", enum: CASES, default: "lowercase" },
    },
    required: ["input"],
  },
  async run({ input, format = "lowercase" }) {
    const t = input || "";
    const parts = tokens(t);
    switch (format) {
      case "lowercase": return t.toLowerCase();
      case "uppercase": return t.toUpperCase();
      case "title": return titleCase(t);
      case "sentence": return sentenceCase(t);
      case "camel": return parts.map((p, i) => (i === 0 ? p.toLowerCase() : p[0].toUpperCase() + p.slice(1).toLowerCase())).join("");
      case "pascal": return parts.map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase()).join("");
      case "snake": return parts.map((p) => p.toLowerCase()).join("_");
      case "kebab": return parts.map((p) => p.toLowerCase()).join("-");
      case "constant": return parts.map((p) => p.toUpperCase()).join("_");
      case "dot": return parts.map((p) => p.toLowerCase()).join(".");
      default: return t;
    }
  },
};

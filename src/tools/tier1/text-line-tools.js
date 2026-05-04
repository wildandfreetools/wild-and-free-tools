import { SITE_BASE } from "../../config.js";

export default {
  name: "text_line_tools",
  description: "Operate on text line-by-line: sort, reverse, deduplicate, count, shuffle, trim whitespace, remove empty lines.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Multi-line text input" },
      operation: {
        type: "string",
        enum: ["sort", "sort_desc", "reverse", "dedupe", "shuffle", "trim", "remove_empty", "count"],
        default: "sort",
      },
      caseInsensitive: { type: "boolean", default: false, description: "Case-insensitive sort/dedupe" },
    },
    required: ["input", "operation"],
  },
  async run({ input, operation = "sort", caseInsensitive = false }) {
    const lines = (input || "").split(/\r?\n/);
    const cmp = caseInsensitive
      ? (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
      : (a, b) => a.localeCompare(b);
    switch (operation) {
      case "sort": return [...lines].sort(cmp).join("\n");
      case "sort_desc": return [...lines].sort((a, b) => -cmp(a, b)).join("\n");
      case "reverse": return [...lines].reverse().join("\n");
      case "dedupe": {
        const seen = new Set();
        const out = [];
        for (const line of lines) {
          const k = caseInsensitive ? line.toLowerCase() : line;
          if (!seen.has(k)) { seen.add(k); out.push(line); }
        }
        return out.join("\n");
      }
      case "shuffle": {
        const a = [...lines];
        for (let i = a.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [a[i], a[j]] = [a[j], a[i]];
        }
        return a.join("\n");
      }
      case "trim": return lines.map((l) => l.trim()).join("\n");
      case "remove_empty": return lines.filter((l) => l.trim().length > 0).join("\n");
      case "count": {
        const total = lines.length;
        const nonEmpty = lines.filter((l) => l.trim().length > 0).length;
        const unique = new Set(caseInsensitive ? lines.map((l) => l.toLowerCase()) : lines).size;
        return { total, nonEmpty, empty: total - nonEmpty, unique };
      }
      default: return input;
    }
  },
};

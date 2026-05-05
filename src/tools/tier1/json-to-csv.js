import { escapeCell } from "../../lib/csv.js";
import { SITE_BASE } from "../../config.js";

export default {
  name: "json_to_csv",
  description: "Convert a JSON array of objects into CSV text. Auto-derives the header from the union of keys across all rows. Escapes quotes, delimiters, and newlines.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "JSON string containing an array of objects" },
      delimiter: { type: "string", description: "Field delimiter, default is comma", default: "," },
      include_header: { type: "boolean", description: "Include the header row", default: true },
    },
    required: ["input"],
  },
  async run({ input, delimiter = ",", include_header = true }) {
    let data;
    try { data = JSON.parse(input); }
    catch (e) { return `Invalid JSON: ${e.message}\n\nWeb version: ${SITE_BASE}/developer-tools/json-to-csv/`; }
    if (!Array.isArray(data)) return "Input JSON must be an array of objects.";
    if (data.length === 0) return "";

    const keys = [...new Set(data.flatMap((row) => (row && typeof row === "object" ? Object.keys(row) : [])))];
    const lines = [];
    if (include_header) lines.push(keys.map((k) => escapeCell(k, delimiter)).join(delimiter));
    for (const row of data) {
      const r = row && typeof row === "object" ? row : {};
      lines.push(keys.map((k) => escapeCell(r[k], delimiter)).join(delimiter));
    }
    return lines.join("\n");
  },
};

import { parseCSV, serializeCSV } from "../../lib/csv.js";

export default {
  name: "csv_deduplicator",
  description: "Remove duplicate rows from CSV text. Optionally dedupe by a single column (matching by name from the header row) instead of full-row equality.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Raw CSV text" },
      delimiter: { type: "string", description: "Field delimiter, default is comma", default: "," },
      has_header: { type: "boolean", description: "Whether the first row is a header", default: true },
      key_column: { type: "string", description: "Optional column name to dedupe on. If omitted, dedupes by full row." },
      case_sensitive: { type: "boolean", description: "Treat values as case-sensitive when comparing", default: true },
    },
    required: ["input"],
  },
  async run({ input, delimiter = ",", has_header = true, key_column, case_sensitive = true }) {
    const rows = parseCSV(input, delimiter);
    if (rows.length === 0) return "";

    const header = has_header ? rows[0] : null;
    const body = has_header ? rows.slice(1) : rows;
    let keyOf;
    if (key_column && header) {
      const idx = header.indexOf(key_column);
      if (idx === -1) return `Column "${key_column}" not found in header. Available: ${header.join(", ")}`;
      keyOf = (row) => row[idx] ?? "";
    } else {
      keyOf = (row) => row.join("");
    }
    const seen = new Set();
    const kept = [];
    let removed = 0;
    for (const row of body) {
      let k = keyOf(row);
      if (!case_sensitive) k = k.toLowerCase();
      if (seen.has(k)) { removed++; continue; }
      seen.add(k);
      kept.push(row);
    }
    const out = header ? [header, ...kept] : kept;
    return `${serializeCSV(out, delimiter)}\n\n# Removed ${removed} duplicate row${removed === 1 ? "" : "s"}, kept ${kept.length}.`;
  },
};

import { parseCSV, serializeCSV } from "../../lib/csv.js";

const SMART_QUOTES = { "“": '"', "”": '"', "‘": "'", "’": "'" };

export default {
  name: "csv_sanitizer",
  description: "Clean CSV text by trimming whitespace, normalizing smart quotes to ASCII, collapsing internal whitespace, removing fully empty rows, and stripping the BOM. All transforms are configurable.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Raw CSV text" },
      delimiter: { type: "string", default: "," },
      trim_cells: { type: "boolean", description: "Strip leading/trailing whitespace in each cell", default: true },
      collapse_whitespace: { type: "boolean", description: "Collapse runs of internal whitespace to a single space", default: false },
      normalize_quotes: { type: "boolean", description: "Replace smart quotes with ASCII quotes", default: true },
      remove_empty_rows: { type: "boolean", description: "Remove rows where every cell is empty", default: true },
      strip_bom: { type: "boolean", description: "Remove the UTF-8 byte-order mark if present", default: true },
    },
    required: ["input"],
  },
  async run({ input, delimiter = ",", trim_cells = true, collapse_whitespace = false, normalize_quotes = true, remove_empty_rows = true, strip_bom = true }) {
    let text = input;
    if (strip_bom && text.charCodeAt(0) === 0xfeff) text = text.slice(1);
    if (normalize_quotes) text = text.replace(/[“”‘’]/g, (c) => SMART_QUOTES[c]);

    const rows = parseCSV(text, delimiter);
    let cleaned = rows.map((row) =>
      row.map((cell) => {
        let v = cell;
        if (trim_cells) v = v.trim();
        if (collapse_whitespace) v = v.replace(/\s+/g, " ");
        return v;
      })
    );
    let removed = 0;
    if (remove_empty_rows) {
      const kept = cleaned.filter((row) => row.some((c) => c !== ""));
      removed = cleaned.length - kept.length;
      cleaned = kept;
    }
    return `${serializeCSV(cleaned, delimiter)}\n\n# Sanitized ${rows.length} rows${removed ? `, removed ${removed} empty` : ""}.`;
  },
};

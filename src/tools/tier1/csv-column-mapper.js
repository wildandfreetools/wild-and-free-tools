import { parseCSV, serializeCSV } from "../../lib/csv.js";

export default {
  name: "csv_column_mapper",
  description: "Rename, reorder, drop, or add columns in a CSV. Pass a JSON mapping object or an array of column specs. Header row is rewritten and rows are projected to match.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Raw CSV text (must have a header row)" },
      mapping: {
        type: "string",
        description:
          "JSON object mapping source column names to target names (e.g. {\"old_email\":\"email\",\"old_name\":\"full_name\"}). Source columns not in the mapping are dropped unless keep_unmapped is true.",
      },
      keep_unmapped: { type: "boolean", description: "Keep columns not present in the mapping, with their original names", default: false },
      delimiter: { type: "string", default: "," },
    },
    required: ["input", "mapping"],
  },
  async run({ input, mapping, keep_unmapped = false, delimiter = "," }) {
    let map;
    try { map = JSON.parse(mapping); }
    catch (e) { return `Invalid mapping JSON: ${e.message}`; }
    if (typeof map !== "object" || map === null || Array.isArray(map)) {
      return "Mapping must be a JSON object of {source: target} pairs.";
    }
    const rows = parseCSV(input, delimiter);
    if (rows.length === 0) return "";
    const [header, ...body] = rows;

    const outCols = [];
    header.forEach((src, i) => {
      if (Object.prototype.hasOwnProperty.call(map, src)) outCols.push({ srcIdx: i, name: map[src] });
      else if (keep_unmapped) outCols.push({ srcIdx: i, name: src });
    });
    const newHeader = outCols.map((c) => c.name);
    const newBody = body.map((row) => outCols.map((c) => row[c.srcIdx] ?? ""));
    return serializeCSV([newHeader, ...newBody], delimiter);
  },
};

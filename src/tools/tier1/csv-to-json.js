import { parseCSV, rowsToObjects } from "../../lib/csv.js";

export default {
  name: "csv_to_json",
  description: "Parse CSV text into a JSON array. Handles quoted fields, escaped quotes, and configurable delimiter. By default the first row is used as object keys.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Raw CSV text" },
      delimiter: { type: "string", description: "Field delimiter, default is comma", default: "," },
      has_header: { type: "boolean", description: "If true, first row is used as object keys; if false, returns array-of-arrays", default: true },
    },
    required: ["input"],
  },
  async run({ input, delimiter = ",", has_header = true }) {
    const rows = parseCSV(input, delimiter);
    if (rows.length === 0) return [];
    if (!has_header) return rows;
    return rowsToObjects(rows).objects;
  },
};

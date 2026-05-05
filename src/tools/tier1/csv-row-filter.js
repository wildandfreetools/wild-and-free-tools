import { parseCSV, serializeCSV } from "../../lib/csv.js";

export default {
  name: "csv_row_filter",
  description: "Filter CSV rows by matching a column against a value or regex. Supports equals, not-equals, contains, regex, and numeric comparisons. Header row is preserved.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Raw CSV text" },
      column: { type: "string", description: "Column name (from header row) to filter on" },
      operator: { type: "string", enum: ["equals", "not_equals", "contains", "not_contains", "regex", "gt", "lt", "gte", "lte"], default: "equals" },
      value: { type: "string", description: "Value to compare against (for regex, treated as a JavaScript regex source)" },
      delimiter: { type: "string", default: "," },
      case_sensitive: { type: "boolean", default: true },
    },
    required: ["input", "column", "value"],
  },
  async run({ input, column, operator = "equals", value, delimiter = ",", case_sensitive = true }) {
    const rows = parseCSV(input, delimiter);
    if (rows.length < 2) return input;
    const [header, ...body] = rows;
    const idx = header.indexOf(column);
    if (idx === -1) return `Column "${column}" not found. Available: ${header.join(", ")}`;

    const norm = (s) => (case_sensitive ? String(s) : String(s).toLowerCase());
    const target = norm(value);
    let test;
    if (operator === "equals")        test = (v) => norm(v) === target;
    else if (operator === "not_equals")    test = (v) => norm(v) !== target;
    else if (operator === "contains")      test = (v) => norm(v).includes(target);
    else if (operator === "not_contains")  test = (v) => !norm(v).includes(target);
    else if (operator === "regex") {
      let re;
      try { re = new RegExp(value, case_sensitive ? "" : "i"); }
      catch (e) { return `Invalid regex: ${e.message}`; }
      test = (v) => re.test(String(v));
    }
    else {
      const cmp = parseFloat(value);
      if (Number.isNaN(cmp)) return `Operator "${operator}" requires a numeric value, got "${value}"`;
      const num = (v) => parseFloat(v);
      if (operator === "gt")  test = (v) => num(v) >  cmp;
      if (operator === "lt")  test = (v) => num(v) <  cmp;
      if (operator === "gte") test = (v) => num(v) >= cmp;
      if (operator === "lte") test = (v) => num(v) <= cmp;
    }

    const kept = body.filter((row) => test(row[idx] ?? ""));
    return `${serializeCSV([header, ...kept], delimiter)}\n\n# Kept ${kept.length} of ${body.length} rows.`;
  },
};

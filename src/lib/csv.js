// CSV parser and serializer used by csv_to_json, csv_deduplicator, csv_row_filter,
// csv_sanitizer, csv_column_mapper. Handles quoted fields, escaped quotes,
// CRLF/LF line endings, and configurable delimiter.

export function parseCSV(text, delimiter = ",") {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = false;
      } else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === delimiter) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (cell !== "" || row.length > 0) { row.push(cell); rows.push(row); row = []; cell = ""; }
      if (c === "\r" && text[i + 1] === "\n") i++;
    } else cell += c;
  }
  if (cell !== "" || row.length > 0) { row.push(cell); rows.push(row); }
  return rows;
}

export function serializeCSV(rows, delimiter = ",") {
  return rows.map((row) => row.map((cell) => escapeCell(cell, delimiter)).join(delimiter)).join("\n");
}

export function escapeCell(value, delimiter) {
  const str = value === null || value === undefined ? "" : String(value);
  if (str.includes('"') || str.includes(delimiter) || str.includes("\n") || str.includes("\r")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function rowsToObjects(rows) {
  if (rows.length === 0) return { header: [], objects: [] };
  const [header, ...body] = rows;
  const objects = body.map((row) => {
    const obj = {};
    header.forEach((key, i) => { obj[key] = row[i] ?? ""; });
    return obj;
  });
  return { header, objects };
}

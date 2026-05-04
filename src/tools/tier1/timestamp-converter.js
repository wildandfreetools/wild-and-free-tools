import { SITE_BASE } from "../../config.js";

export default {
  name: "timestamp_converter",
  description: "Convert between Unix timestamps (seconds or milliseconds) and ISO 8601 / human-readable dates. Supports any timezone.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Either a Unix timestamp (e.g. 1714000000) or an ISO date string (e.g. 2026-04-25T00:00:00Z)" },
      mode: { type: "string", enum: ["auto", "to_iso", "to_unix", "to_unix_ms"], default: "auto" },
      timezone: { type: "string", default: "UTC", description: "IANA timezone name for output (e.g. America/New_York)" },
    },
    required: ["input"],
  },
  async run({ input, mode = "auto", timezone = "UTC" }) {
    const val = String(input || "").trim();
    if (!val) return "Provide a timestamp or date string.";
    let date;
    const isNumeric = /^-?\d+(\.\d+)?$/.test(val);
    if (isNumeric) {
      const n = Number(val);
      const ms = Math.abs(n) > 1e12 ? n : n * 1000;
      date = new Date(ms);
    } else {
      date = new Date(val);
    }
    if (Number.isNaN(date.getTime())) return `Could not parse: ${val}`;

    const result = {
      iso: date.toISOString(),
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMilliseconds: date.getTime(),
      utc: date.toUTCString(),
    };
    try {
      result.localTime = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        dateStyle: "full",
        timeStyle: "long",
      }).format(date);
      result.timezone = timezone;
    } catch {
      result.timezone = "UTC (invalid timezone provided)";
    }
    if (mode === "to_iso") return result.iso;
    if (mode === "to_unix") return String(result.unixSeconds);
    if (mode === "to_unix_ms") return String(result.unixMilliseconds);
    return result;
  },
};

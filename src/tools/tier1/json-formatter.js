import { SITE_BASE } from "../../config.js";

export default {
  name: "json_formatter",
  description: "Format, validate, and minify JSON. Pretty-prints valid JSON with 2-space indentation, or minifies it. Returns parse errors with descriptive messages.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Raw JSON string to format or minify" },
      mode: { type: "string", enum: ["format", "minify"], default: "format" },
    },
    required: ["input"],
  },
  async run({ input, mode = "format" }) {
    let parsed;
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      return `Invalid JSON: ${e.message}\n\nWeb version: ${SITE_BASE}/developer-tools/json-formatter/`;
    }
    if (mode === "minify") return JSON.stringify(parsed);
    return JSON.stringify(parsed, null, 2);
  },
};

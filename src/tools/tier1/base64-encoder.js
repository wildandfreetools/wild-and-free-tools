import { SITE_BASE } from "../../config.js";

export default {
  name: "base64_encoder",
  description: "Encode text to Base64 or decode Base64 back to text. Standard Base64 with optional URL-safe variant.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Text to encode or Base64 string to decode" },
      mode: { type: "string", enum: ["encode", "decode"], default: "encode" },
      urlSafe: { type: "boolean", default: false, description: "Use URL-safe Base64 (- and _ instead of + and /)" },
    },
    required: ["input"],
  },
  async run({ input, mode = "encode", urlSafe = false }) {
    if (mode === "encode") {
      let out = Buffer.from(input, "utf8").toString("base64");
      if (urlSafe) out = out.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
      return out;
    }
    let normalized = input;
    if (urlSafe) normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    while (normalized.length % 4) normalized += "=";
    try {
      return Buffer.from(normalized, "base64").toString("utf8");
    } catch (e) {
      return `Decode failed: ${e.message}\n\nWeb version: ${SITE_BASE}/encode-decode-tools/base64/`;
    }
  },
};

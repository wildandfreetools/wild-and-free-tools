import { SITE_BASE } from "../../config.js";

export default {
  name: "url_encoder",
  description: "URL-encode or URL-decode text. Encodes special characters into percent-encoding for safe use in URLs and query strings, or decodes them back.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Text to encode or URL-encoded string to decode" },
      mode: { type: "string", enum: ["encode", "decode"], default: "encode" },
      component: { type: "boolean", default: true, description: "Use encodeURIComponent (true) for query/path values, or encodeURI (false) for full URLs" },
    },
    required: ["input"],
  },
  async run({ input, mode = "encode", component = true }) {
    try {
      if (mode === "encode") {
        return component ? encodeURIComponent(input) : encodeURI(input);
      }
      return component ? decodeURIComponent(input) : decodeURI(input);
    } catch (e) {
      return `Operation failed: ${e.message}\n\nWeb version: ${SITE_BASE}/encode-decode-tools/url-encoder-decoder/`;
    }
  },
};

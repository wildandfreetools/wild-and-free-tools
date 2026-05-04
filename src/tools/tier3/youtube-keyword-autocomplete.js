import { SITE_BASE, REQUEST_TIMEOUT_MS } from "../../config.js";

export default {
  name: "youtube_keyword_autocomplete",
  description: "Get YouTube search autocomplete suggestions for a seed keyword. Useful for tag generation, video title research, and discovering what people search for on a topic.",
  inputSchema: {
    type: "object",
    properties: {
      seed: { type: "string", description: "Seed keyword or phrase to expand into search suggestions" },
    },
    required: ["seed"],
  },
  async run({ seed }) {
    const q = (seed || "").trim();
    if (!q) {
      return `Provide a seed keyword.\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-tags-generator/`;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const resp = await fetch(`${SITE_BASE}/api/yt/autocomplete?q=${encodeURIComponent(q)}`, {
        signal: ctrl.signal,
        headers: { "user-agent": "wild-and-free-tools/0.1" },
      });
      if (!resp.ok) {
        return `Autocomplete failed (HTTP ${resp.status})\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-tags-generator/`;
      }
      const data = await resp.json();
      return {
        seed: q,
        suggestions: Array.isArray(data) ? data : data.suggestions || data,
        webVersion: `${SITE_BASE}/youtube-tools/youtube-tags-generator/`,
      };
    } catch (e) {
      return `Autocomplete error: ${e.message}\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-tags-generator/`;
    } finally {
      clearTimeout(timer);
    }
  },
};

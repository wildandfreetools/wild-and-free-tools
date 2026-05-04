import { SITE_BASE, REQUEST_TIMEOUT_MS } from "../../config.js";

function extractVideoId(input) {
  if (/^[A-Za-z0-9_-]{11}$/.test(input)) return input;
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = input.match(re);
    if (m) return m[1];
  }
  return null;
}

export default {
  name: "youtube_video_info",
  description: "Look up YouTube video metadata: title, description, channel, view count, like count, publish date, tags, and thumbnail. Accepts a video URL, shorts URL, or 11-character video ID.",
  inputSchema: {
    type: "object",
    properties: {
      video: { type: "string", description: "YouTube video URL, shorts URL, or 11-character video ID" },
    },
    required: ["video"],
  },
  async run({ video }) {
    const id = extractVideoId((video || "").trim());
    if (!id) {
      return `Could not parse a YouTube video ID from: ${video}\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-video-description-extractor/`;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const resp = await fetch(`${SITE_BASE}/api/yt/video-info?v=${encodeURIComponent(id)}`, {
        signal: ctrl.signal,
        headers: { "user-agent": "wild-and-free-tools/0.1" },
      });
      if (!resp.ok) {
        return `Lookup failed (HTTP ${resp.status})\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-video-description-extractor/`;
      }
      const data = await resp.json();
      return data;
    } catch (e) {
      return `Lookup error: ${e.message}\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-video-description-extractor/`;
    } finally {
      clearTimeout(timer);
    }
  },
};

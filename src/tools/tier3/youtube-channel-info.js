import { SITE_BASE, REQUEST_TIMEOUT_MS } from "../../config.js";

function extractChannelRef(input) {
  const trimmed = (input || "").trim();
  if (!trimmed) return null;
  const handle = trimmed.match(/(?:youtube\.com\/)?@([A-Za-z0-9_.-]+)/);
  if (handle) return "@" + handle[1];
  const channelId = trimmed.match(/youtube\.com\/channel\/(UC[A-Za-z0-9_-]{22})/);
  if (channelId) return channelId[1];
  if (/^UC[A-Za-z0-9_-]{22}$/.test(trimmed)) return trimmed;
  if (trimmed.startsWith("@")) return trimmed;
  return trimmed;
}

export default {
  name: "youtube_channel_info",
  description: "Look up a YouTube channel's branding metadata: title, description, subscriber count, view count, country, custom URL, banner, profile picture, and keywords. Accepts a channel URL, @handle, or channel ID.",
  inputSchema: {
    type: "object",
    properties: {
      channel: { type: "string", description: "YouTube channel URL, @handle, or 24-character channel ID" },
    },
    required: ["channel"],
  },
  async run({ channel }) {
    const ref = extractChannelRef(channel);
    if (!ref) {
      return `Could not parse a channel reference from: ${channel}\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-channel-keywords-extractor/`;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const resp = await fetch(`${SITE_BASE}/api/yt/channel-branding?ref=${encodeURIComponent(ref)}`, {
        signal: ctrl.signal,
        headers: { "user-agent": "wild-and-free-tools/0.1" },
      });
      if (!resp.ok) {
        return `Lookup failed (HTTP ${resp.status})\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-channel-keywords-extractor/`;
      }
      return await resp.json();
    } catch (e) {
      return `Lookup error: ${e.message}\n\nWeb version: ${SITE_BASE}/youtube-tools/youtube-channel-keywords-extractor/`;
    } finally {
      clearTimeout(timer);
    }
  },
};

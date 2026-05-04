import { SITE_BASE } from "../../config.js";

export default {
  name: "word_counter",
  description: "Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time for a text input.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Text to analyze" },
      wpm: { type: "number", default: 225, description: "Words per minute for reading time estimate" },
    },
    required: ["input"],
  },
  async run({ input, wpm = 225 }) {
    const text = input || "";
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = (text.match(/\S+/g) || []).length;
    const sentences = (text.match(/[^.!?]+[.!?]+/g) || []).length;
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
    const readingMinutes = Math.max(1, Math.ceil(words / wpm));
    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: `${readingMinutes} min`,
      webVersion: `${SITE_BASE}/text-tools/word-counter/`,
    };
  },
};

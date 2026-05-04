import { SITE_BASE } from "../../config.js";

const WORDS = "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(" ");

function pickWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function buildSentence() {
  const len = 6 + Math.floor(Math.random() * 12);
  const words = [];
  for (let i = 0; i < len; i++) words.push(pickWord());
  words[0] = words[0][0].toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function buildParagraph() {
  const sentences = 3 + Math.floor(Math.random() * 5);
  return Array.from({ length: sentences }, buildSentence).join(" ");
}

export default {
  name: "lorem_ipsum_generator",
  description: "Generate placeholder Lorem Ipsum text in words, sentences, or paragraphs.",
  inputSchema: {
    type: "object",
    properties: {
      unit: { type: "string", enum: ["words", "sentences", "paragraphs"], default: "paragraphs" },
      count: { type: "number", default: 3, minimum: 1, maximum: 100 },
      startWithLorem: { type: "boolean", default: true },
    },
  },
  async run({ unit = "paragraphs", count = 3, startWithLorem = true } = {}) {
    const n = Math.max(1, Math.min(100, Math.floor(count)));
    let parts = [];
    if (unit === "words") parts = Array.from({ length: n }, pickWord);
    else if (unit === "sentences") parts = Array.from({ length: n }, buildSentence);
    else parts = Array.from({ length: n }, buildParagraph);

    let out = unit === "paragraphs" ? parts.join("\n\n") : parts.join(" ");
    if (startWithLorem) {
      const stem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit";
      if (unit === "paragraphs" && !out.startsWith("Lorem")) {
        out = stem + ", " + parts[0].slice(0, 1).toLowerCase() + parts[0].slice(1);
        if (parts.length > 1) out += "\n\n" + parts.slice(1).join("\n\n");
      } else if (unit === "sentences" && !out.startsWith("Lorem")) {
        out = stem + ". " + parts.slice(1).join(" ");
      } else if (unit === "words") {
        out = "Lorem ipsum dolor sit amet " + parts.slice(5).join(" ");
      }
    }
    return out.trim();
  },
};

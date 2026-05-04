import { SITE_BASE } from "../../config.js";

export default {
  name: "grammar_fixer",
  description: "Generate grammar fixer content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Paste text with grammar issues, typos, or awkward phrasing..."
      }
    },
    "required": [
      "input"
    ]
  },
  async run(args) {
    const prompt = `Fix all grammar, spelling, and punctuation errors. Keep the original meaning and style. Only output the corrected text:

${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/grammar-fixer/`,
    ].join("\n");
  },
};

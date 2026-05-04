import { SITE_BASE } from "../../config.js";

export default {
  name: "paraphraser",
  description: "Generate paraphraser content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Paste the text you want to paraphrase..."
      }
    },
    "required": [
      "input"
    ]
  },
  async run(args) {
    const prompt = `Paraphrase the following text using different words and sentence structures while keeping the exact same meaning:

${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/paraphraser/`,
    ].join("\n");
  },
};

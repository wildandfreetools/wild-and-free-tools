import { SITE_BASE } from "../../config.js";

export default {
  name: "tone_rewriter",
  description: "Generate tone rewriter content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Paste text you want rewritten in a different tone..."
      }
    },
    "required": [
      "input"
    ]
  },
  async run(args) {
    const prompt = `Rewrite the following text in a professional tone. Keep the same meaning. Only output the rewritten text:

${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/tone-rewriter/`,
    ].join("\n");
  },
};

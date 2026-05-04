import { SITE_BASE } from "../../config.js";

export default {
  name: "code_explainer",
  description: "Generate code explainer content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Paste code here — any language..."
      },
      "level": {
        "type": "string",
        "enum": [
          "beginner",
          "intermediate",
          "expert"
        ],
        "description": "level",
        "default": "beginner"
      }
    },
    "required": [
      "input"
    ]
  },
  async run(args) {
    const prompt = `Explain this code to someone who has never programmed. Use simple language, no jargon.

Code:
${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/code-explainer/`,
    ].join("\n");
  },
};

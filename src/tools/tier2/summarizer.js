import { SITE_BASE } from "../../config.js";

export default {
  name: "summarizer",
  description: "Generate summarizer content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Paste an article, email, or any long text here..."
      },
      "type": {
        "type": "string",
        "enum": [
          "brief",
          "detailed",
          "bullets",
          "tldr"
        ],
        "description": "type",
        "default": "brief"
      }
    },
    "required": [
      "input"
    ]
  },
  async run(args) {
    const prompt = `Summarize in 2-3 clear sentences:

${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/summarizer/`,
    ].join("\n");
  },
};

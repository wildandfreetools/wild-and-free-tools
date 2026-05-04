import { SITE_BASE } from "../../config.js";

export default {
  name: "youtube_summarizer",
  description: "Generate youtube summarizer content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Paste the YouTube video transcript here..."
      },
      "type": {
        "type": "string",
        "enum": [
          "takeaways",
          "brief",
          "bullets",
          "detailed"
        ],
        "description": "type",
        "default": "takeaways"
      }
    },
    "required": [
      "input"
    ]
  },
  async run(args) {
    const prompt = `Extract the 5-7 most important key ${args.type} from this YouTube video transcript. Format as numbered points:

${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/youtube-summarizer/`,
    ].join("\n");
  },
};

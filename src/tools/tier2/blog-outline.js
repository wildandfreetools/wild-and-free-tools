import { SITE_BASE } from "../../config.js";

export default {
  name: "blog_outline",
  description: "Generate blog outline content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string",
        "description": "Blog Topic"
      },
      "format": {
        "type": "string",
        "enum": [
          "howto",
          "listicle",
          "comparison",
          "deepdive",
          "beginner"
        ],
        "description": "Article Format",
        "default": "howto"
      },
      "audience": {
        "type": "string",
        "description": "Target Audience"
      }
    },
    "required": [
      "topic"
    ]
  },
  async run(args) {
    const prompt = `Create a detailed how-to guide blog outline for the topic: "${args.topic}". Target audience: ${args.audience}.

Include:
- A compelling title
- Introduction section
- 4-6 H2 sections with 2-3 H3 sub-points each
- Key talking points under each heading
- Conclusion section

Format with clear heading hierarchy using ## for H2 and ### for H3.`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/blog-outline/`,
    ].join("\n");
  },
};

import { SITE_BASE } from "../../config.js";

export default {
  name: "meta_description",
  description: "Generate meta description content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "Page Title"
      },
      "content": {
        "type": "string",
        "description": "Page Content Summary (optional — improves accuracy)"
      },
      "keyword": {
        "type": "string",
        "description": "Target Keyword"
      }
    },
    "required": [
      "title",
      "content"
    ]
  },
  async run(args) {
    const prompt = `Write 3 SEO-optimized meta descriptions for this web page.

Page title: "${args.title}"
Content summary: ${args.content}
Target keyword: ${args.keyword}

Rules:
- Each description must be 150-160 characters (STRICT — count carefully)
- Include the target keyword naturally if provided
- Start with a compelling hook or benefit
- End with a subtle call to action or value proposition
- No generic phrases like "Learn more" or "Click here"
- Show character count after each option like: (156 chars)

Format as:
Option 1: [description] (X chars)
Option 2: [description] (X chars)
Option 3: [description] (X chars)`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/meta-description/`,
    ].join("\n");
  },
};

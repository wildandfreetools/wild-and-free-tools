import { SITE_BASE } from "../../config.js";

export default {
  name: "social_caption",
  description: "Generate social caption content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Describe your post topic, product, event, or idea..."
      }
    },
    "required": [
      "input"
    ]
  },
  async run(args) {
    const prompt = `You are a social media expert. Write exactly 3 unique Instagram caption options for the topic below. Each caption should:
- Start with a strong hook (first line is critical)
- Be 100-200 words
- Include relevant emojis naturally throughout
- End with a call to action
- Include 15-20 relevant hashtags at the end (mix of popular and niche)
- Use line breaks for readability

Label them Caption 1, Caption 2, Caption 3.

Topic: ${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/social-caption/`,
    ].join("\n");
  },
};

import { SITE_BASE } from "../../config.js";

export default {
  name: "product_description",
  description: "Generate product description content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Product Name"
      },
      "features": {
        "type": "string",
        "description": "Key Features (one per line or comma-separated)"
      },
      "tone": {
        "type": "string",
        "enum": [
          "professional",
          "casual",
          "luxury",
          "playful",
          "technical"
        ],
        "description": "Tone",
        "default": "professional"
      },
      "audience": {
        "type": "string",
        "description": "Target Audience"
      }
    },
    "required": [
      "name",
      "features"
    ]
  },
  async run(args) {
    const prompt = `Write a compelling ecommerce product description for "${args.name}".

Key features:
${args.features}

Tone: ${args.tone}. Target audience: ${args.audience}.

Write 2-3 paragraphs that lead with benefits, paint a picture of the experience, include the key features naturally, and end with a subtle call to action. Do not use generic filler phrases.`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/product-description/`,
    ].join("\n");
  },
};

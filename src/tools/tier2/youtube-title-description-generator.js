import { SITE_BASE } from "../../config.js";

export default {
  name: "youtube_title_description_generator",
  description: "Generate youtube title description generator content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string",
        "description": "Video Topic"
      },
      "audience": {
        "type": "string",
        "description": "Target audience"
      },
      "tone": {
        "type": "string",
        "description": "Tone"
      },
      "keywords": {
        "type": "string",
        "description": "Target keywords"
      },
      "format": {
        "type": "string",
        "description": "Video format"
      }
    },
    "required": [
      "topic",
      "audience"
    ]
  },
  async run(args) {
    const prompt = `You are a YouTube SEO expert. For this video:

Topic: ${args.topic}
Audience: ${args.audience}
Format: __WFT_FORMAT_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Target keywords: ${args.keywords}

Generate exactly this output, no extra commentary:

## Titles
1. [title variant 1]
2. [title variant 2]
3. [title variant 3]
4. [title variant 4]
5. [title variant 5]
6. [title variant 6]
7. [title variant 7]
8. [title variant 8]
9. [title variant 9]
10. [title variant 10]

Title rules: Each under 60 characters. Mix styles — numbered lists, curiosity gaps, specific results, question format, bracketed tags ([2026], [Tutorial]), and benefit-led. Front-load the main keyword where possible.

## Description
Write a 150-200 word description with: a strong opening hook in the first 2 sentences (most important, shown above the fold), 1-2 paragraphs of value prop and what the viewer will learn, a timestamps section placeholder, hashtags at the bottom (3-5 relevant tags), and a call-to-action to subscribe.`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/youtube-tools/youtube-title-description-generator/`,
    ].join("\n");
  },
};

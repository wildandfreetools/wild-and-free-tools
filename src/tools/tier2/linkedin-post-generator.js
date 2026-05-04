import { SITE_BASE } from "../../config.js";

export default {
  name: "linkedin_post_generator",
  description: "Generate linkedin post generator content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string",
        "description": "Post Topic"
      },
      "post_type": {
        "type": "string",
        "description": "Post Type"
      },
      "tone": {
        "type": "string",
        "description": "Tone"
      },
      "length": {
        "type": "string",
        "enum": [
          "short",
          "medium",
          "long"
        ],
        "description": "Length",
        "default": "short"
      },
      "cta": {
        "type": "string",
        "description": "CTA goal (optional — what should readers do?)"
      },
      "tog_hashtags": {
        "type": "string",
        "description": "tog_hashtags"
      }
    },
    "required": [
      "topic",
      "cta",
      "tog_hashtags"
    ]
  },
  async run(args) {
    const prompt = `Write 3 distinct LinkedIn __wft_post_type_placeholder_value_long_enough_for_length_checks__ variations on this topic. Each should feel different in approach but match the same tone and goal.

Topic: ${args.topic}
Post type: __WFT_POST_TYPE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Length: ${args.length}
CTA goal: ${args.cta}
Include hashtags: no
Include emojis: no

Platform rules: LinkedIn post max is 3,000 chars. First 2 lines are critical — they're all that shows before "see more". Use line breaks between ${args.length} paragraphs for readability. If hashtags are on, use 3-5 professional industry-specific tags at the end. Never emoji-stuff.
Hard character cap per variation: 3000

FORMAT — output exactly 3 variations, each separated by a line with only "---" (three dashes). No preamble, no commentary, no numbering in the output, no "Variation 1" labels. Just the three LinkedIn __wft_post_type_placeholder_value_long_enough_for_length_checks__ texts separated by ---`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/linkedin-tools/linkedin-post-generator/`,
    ].join("\n");
  },
};

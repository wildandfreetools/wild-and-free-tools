import { SITE_BASE } from "../../config.js";

export default {
  name: "pinterest_pin_description_generator",
  description: "Generate pinterest pin description generator content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string",
        "description": "Pin Topic"
      },
      "post_type": {
        "type": "string",
        "description": "Pin Type"
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
    const prompt = `Write 3 distinct Pinterest __wft_post_type_placeholder_value_long_enough_for_length_checks__ variations on this topic. Each should feel different in approach but match the same tone and goal.

Topic: ${args.topic}
Post type: __WFT_POST_TYPE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Length: ${args.length}
CTA goal: ${args.cta}
Include hashtags: no
Include emojis: no

Platform rules: Pinterest Pin description max is 500 characters. Keywords matter FAR more than hashtags — Pinterest is a visual search engine, so the description should read like SEO copy with natural keyword usage. If hashtags are on, add 3-5 relevant ones at the very end. Never put hashtags in the Pin title.
Hard character cap per variation: 500

FORMAT — output exactly 3 variations, each separated by a line with only "---" (three dashes). No preamble, no commentary, no numbering in the output, no "Variation 1" labels. Just the three Pinterest __wft_post_type_placeholder_value_long_enough_for_length_checks__ texts separated by ---`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/pinterest-tools/pinterest-pin-description-generator/`,
    ].join("\n");
  },
};

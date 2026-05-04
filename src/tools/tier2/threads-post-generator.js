import { SITE_BASE } from "../../config.js";

export default {
  name: "threads_post_generator",
  description: "Generate threads post generator content. Returns a prompt for the assistant to execute.",
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
      "tog_emojis": {
        "type": "string",
        "description": "tog_emojis"
      }
    },
    "required": [
      "topic",
      "cta",
      "tog_emojis"
    ]
  },
  async run(args) {
    const prompt = `Write 3 distinct Threads __wft_post_type_placeholder_value_long_enough_for_length_checks__ variations on this topic. Each should feel different in approach but match the same tone and goal.

Topic: ${args.topic}
Post type: __WFT_POST_TYPE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Length: ${args.length}
CTA goal: ${args.cta}
Include hashtags: no
Include emojis: no

Platform rules: Threads post max is 500 characters. Threads rewards conversational, reply-driving content over broadcast tweets — lean into questions, relatable observations, and mild hot takes. No hashtags (Threads has no hashtag discovery system comparable to Twitter). Emojis are welcome and fit the platform's casual tone.
Hard character cap per variation: 500

FORMAT — output exactly 3 variations, each separated by a line with only "---" (three dashes). No preamble, no commentary, no numbering in the output, no "Variation 1" labels. Just the three Threads __wft_post_type_placeholder_value_long_enough_for_length_checks__ texts separated by ---`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/threads-tools/threads-post-generator/`,
    ].join("\n");
  },
};

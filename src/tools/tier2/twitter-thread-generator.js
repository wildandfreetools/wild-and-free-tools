import { SITE_BASE } from "../../config.js";

export default {
  name: "twitter_thread_generator",
  description: "Generate twitter thread generator content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string",
        "description": "Thread Topic"
      },
      "post_type": {
        "type": "string",
        "description": "Thread Length"
      },
      "tone": {
        "type": "string",
        "description": "Tone"
      },
      "length": {
        "type": "string",
        "enum": [
          "punchy",
          "full"
        ],
        "description": "Length",
        "default": "punchy"
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
    const prompt = `Write 3 distinct Twitter / X __wft_post_type_placeholder_value_long_enough_for_length_checks__ variations on this topic. Each should feel different in approach but match the same tone and goal.

Topic: ${args.topic}
Post type: __WFT_POST_TYPE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Length: ${args.length}
CTA goal: ${args.cta}
Include hashtags: no
Include emojis: no

Platform rules: Output a full numbered thread. Use "1/" "2/" "3/" format at the start of each tweet (or 1/7, 2/7 if preferred). Each tweet individually must stay within 280 characters — never exceed. Separate tweets with a blank line in the output. Tweet 1 is the hook (must earn the click-expand). The last tweet is the payoff or CTA. No hashtags anywhere in threads — they dilute reach.
Hard character cap per variation: 280

FORMAT — output exactly 3 variations, each separated by a line with only "---" (three dashes). No preamble, no commentary, no numbering in the output, no "Variation 1" labels. Just the three Twitter / X __wft_post_type_placeholder_value_long_enough_for_length_checks__ texts separated by ---`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/twitter-x-tools/twitter-thread-generator/`,
    ].join("\n");
  },
};

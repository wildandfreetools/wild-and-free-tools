import { SITE_BASE } from "../../config.js";

export default {
  name: "twitter_x_bio_generator",
  description: "Generate twitter x bio generator content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Name / brand / handle"
      },
      "niche": {
        "type": "string",
        "description": "What you do / niche"
      },
      "audience": {
        "type": "string",
        "description": "Who it's for (target audience)"
      },
      "tone": {
        "type": "string",
        "description": "Tone"
      },
      "usp": {
        "type": "string",
        "description": "Unique value / hook (what makes you different)"
      },
      "cta": {
        "type": "string",
        "description": "Link / CTA"
      },
      "tog_emojis": {
        "type": "string",
        "description": "tog_emojis"
      }
    },
    "required": [
      "name",
      "niche",
      "audience",
      "usp",
      "tog_emojis"
    ]
  },
  async run(args) {
    const prompt = `Write 3 distinct Twitter / X bio variations. Each must stay within 160 characters. Each should feel different in approach but match the same tone.

Name / brand: ${args.name}
Niche / what they do: ${args.niche}
Target audience: ${args.audience}
Unique value / hook: ${args.usp}
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
CTA / link prompt: ${args.cta}
Include emojis: no
Use line breaks: no (single flowing line)

Platform rules: Twitter/X bio max is 160 characters. No line breaks (bios render on a single wrapped line). Emojis welcome and help visual scanning. Handle @mentions of companies you work at. Hashtags technically work but look outdated — skip unless branded.
Hard character cap per variation: 160

FORMAT — output exactly 3 variations, each separated by a line with only "---" (three dashes). No preamble, no commentary, no "Variation 1" labels. Just the three bio texts separated by ---`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/twitter-x-tools/twitter-x-bio-generator/`,
    ].join("\n");
  },
};

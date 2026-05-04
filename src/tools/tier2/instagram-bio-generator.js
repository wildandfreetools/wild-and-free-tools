import { SITE_BASE } from "../../config.js";

export default {
  name: "instagram_bio_generator",
  description: "Generate instagram bio generator content. Returns a prompt for the assistant to execute.",
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
        "description": "Link prompt / CTA (what the link-in-bio points to)"
      },
      "tog_emojis": {
        "type": "string",
        "description": "tog_emojis"
      },
      "tog_lines": {
        "type": "string",
        "description": "tog_lines"
      }
    },
    "required": [
      "name",
      "niche",
      "audience",
      "usp",
      "cta",
      "tog_emojis",
      "tog_lines"
    ]
  },
  async run(args) {
    const prompt = `Write 3 distinct Instagram bio variations. Each must stay within 150 characters. Each should feel different in approach but match the same tone.

Name / brand: ${args.name}
Niche / what they do: ${args.niche}
Target audience: ${args.audience}
Unique value / hook: ${args.usp}
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
CTA / link prompt: ${args.cta}
Include emojis: no
Use line breaks: no (single flowing line)

Platform rules: Instagram bio max is 150 characters. Line breaks are allowed and help readability. 1-3 tasteful emojis work well. End with a link prompt that tees up the link-in-bio. Avoid hashtags in the bio itself (they go in posts).
Hard character cap per variation: 150

FORMAT — output exactly 3 variations, each separated by a line with only "---" (three dashes). No preamble, no commentary, no "Variation 1" labels. Just the three bio texts separated by ---`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/instagram-tools/instagram-bio-generator/`,
    ].join("\n");
  },
};

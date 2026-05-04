import { SITE_BASE } from "../../config.js";

export default {
  name: "youtube_channel_description_generator",
  description: "Generate youtube channel description generator content. Returns a prompt for the assistant to execute.",
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
        "description": "Subscribe prompt / link CTA"
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
    const prompt = `Write 3 distinct YouTube channel description variations. Each must stay within 1000 characters. Each should feel different in approach but match the same tone.

Name / brand: ${args.name}
Niche / what they do: ${args.niche}
Target audience: ${args.audience}
Unique value / hook: ${args.usp}
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
CTA / link prompt: ${args.cta}
Include emojis: no
Use line breaks: no (single flowing line)

Platform rules: YouTube channel About description cap is 1,000 characters (though up to 5,000 allowed technically, best practice is under 1,000). First 150 chars show above the fold in search. KEYWORD-indexed by YouTube search — include your niche terms, target topics, upload schedule. Use line breaks for readability. End with subscribe CTA.
Hard character cap per variation: 1000

FORMAT — output exactly 3 variations, each separated by a line with only "---" (three dashes). No preamble, no commentary, no "Variation 1" labels. Just the three channel description texts separated by ---`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/youtube-tools/youtube-channel-description-generator/`,
    ].join("\n");
  },
};

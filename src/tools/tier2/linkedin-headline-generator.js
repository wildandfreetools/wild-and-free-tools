import { SITE_BASE } from "../../config.js";

export default {
  name: "linkedin_headline_generator",
  description: "Generate linkedin headline generator content. Returns a prompt for the assistant to execute.",
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
        "description": "Positioning line / hook"
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
    const prompt = `Write 3 distinct LinkedIn headline variations. Each must stay within 220 characters. Each should feel different in approach but match the same tone.

Name / brand: ${args.name}
Niche / what they do: ${args.niche}
Target audience: ${args.audience}
Unique value / hook: ${args.usp}
Tone: __WFT_TONE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
CTA / link prompt: ${args.cta}
Include emojis: no
Use line breaks: no (single flowing line)

Platform rules: LinkedIn headline max is 220 characters. This is both search-indexed (recruiters search by job titles/skills) AND social (shown under your name everywhere). Best headlines combine: role + value outcome + who they help. Keywords matter — include the exact titles and skills you want to rank for. Generally avoid emojis unless your audience is creator-heavy.
Hard character cap per variation: 220

FORMAT — output exactly 3 variations, each separated by a line with only "---" (three dashes). No preamble, no commentary, no "Variation 1" labels. Just the three headline texts separated by ---`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/linkedin-tools/linkedin-headline-generator/`,
    ].join("\n");
  },
};

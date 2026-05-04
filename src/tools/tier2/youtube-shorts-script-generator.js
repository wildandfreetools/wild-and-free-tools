import { SITE_BASE } from "../../config.js";

export default {
  name: "youtube_shorts_script_generator",
  description: "Generate youtube shorts script generator content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "topic": {
        "type": "string",
        "description": "Video Topic"
      },
      "length": {
        "type": "string",
        "enum": [
          "15",
          "30",
          "45",
          "60"
        ],
        "description": "Length",
        "default": "15"
      },
      "hook_style": {
        "type": "string",
        "description": "Hook style"
      },
      "niche": {
        "type": "string",
        "description": "Niche"
      },
      "cta": {
        "type": "string",
        "description": "CTA goal (what should viewers do next?)"
      }
    },
    "required": [
      "topic",
      "cta"
    ]
  },
  async run(args) {
    const prompt = `Write a YouTube Shorts script on this topic. Follow the format exactly — no extra commentary, no preamble.

Topic: ${args.topic}
Niche: __WFT_NICHE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
Length: ${args.length} seconds (target ~45 words total)
Hook style: __WFT_HOOK_STYLE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__
CTA goal: ${args.cta}

FORMAT (use these exact section labels):

[HOOK — 3 seconds]
<the opening line(s). Must stop the scroll in 3 seconds. Use the __WFT_HOOK_STYLE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__ style.>

[BODY — 10 seconds]
<tight beats, one clear idea per beat. Conversational spoken words, not paragraphs. Natural rhythm, no filler, no "um" or "so". About 25 words.>

[CTA — 2 seconds]
<one-line call-to-action: ${args.cta}. Punchy, under 12 words.>

[VISUALS / B-ROLL ideas]
- <1-2 visual cues that match the hook>
- <1-2 visual cues for the body>
- <1 visual for the CTA>`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/youtube-tools/youtube-shorts-script-generator/`,
    ].join("\n");
  },
};

import { SITE_BASE } from "../../config.js";

export default {
  name: "youtube_channel_name_generator",
  description: "Generate youtube channel name generator content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "niche": {
        "type": "string",
        "description": "Niche / topic"
      },
      "vibe": {
        "type": "string",
        "description": "Vibe"
      }
    },
    "required": [
      "niche"
    ]
  },
  async run(args) {
    const prompt = `Generate 20 creative YouTube channel name ideas for a channel about: "${args.niche}". Vibe: __WFT_VIBE_PLACEHOLDER_VALUE_LONG_ENOUGH_FOR_LENGTH_CHECKS__. Rules: 1-3 words each, easy to spell, memorable, no numbers or symbols, no generic words like "channel" or "official". Output as a numbered list, one name per line, nothing else — no explanations, no intros.`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/youtube-tools/youtube-channel-name-generator/`,
    ].join("\n");
  },
};

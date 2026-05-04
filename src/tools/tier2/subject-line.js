import { SITE_BASE } from "../../config.js";

export default {
  name: "subject_line",
  description: "Generate subject line content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "context": {
        "type": "string",
        "description": "What is the email about?"
      },
      "style": {
        "type": "string",
        "enum": [
          "mixed",
          "curiosity",
          "urgency",
          "benefit",
          "personal",
          "question"
        ],
        "description": "Style",
        "default": "mixed"
      },
      "type": {
        "type": "string",
        "enum": [
          "marketing",
          "newsletter",
          "cold",
          "followup",
          "announcement"
        ],
        "description": "Email Type",
        "default": "marketing"
      }
    },
    "required": [
      "context"
    ]
  },
  async run(args) {
    const prompt = `Generate 10 email subject lines for this ${args.type} email:

${args.context}

Style: Use a variety of approaches — mix curiosity, urgency, benefit, personal, and question styles.

Rules:
- Each subject line should be 6-10 words (40-60 characters)
- No ALL CAPS words
- No spam trigger words (free, buy now, act now, limited time)
- No exclamation marks
- Make each one genuinely different in approach
- Number them 1-10
- After each, add the character count in parentheses`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/subject-line/`,
    ].join("\n");
  },
};

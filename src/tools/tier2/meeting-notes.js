import { SITE_BASE } from "../../config.js";

export default {
  name: "meeting_notes",
  description: "Generate meeting notes content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Paste your meeting notes here — raw transcript, chat log, bullet points, or stream-of-consciousness notes. The messier the better — the AI will organize everything."
      }
    },
    "required": [
      "input"
    ]
  },
  async run(args) {
    const prompt = `You are an expert executive assistant. Analyze the following meeting notes and organize them into a clear, structured format with exactly these four sections:

SUMMARY
Write a concise 2-3 sentence overview of what was discussed and the overall purpose of the meeting.

KEY DECISIONS
List each decision that was made during the meeting as a bullet point. If no clear decisions were made, note that.

ACTION ITEMS
List each action item as a bullet point in this format:
- [Owner name if mentioned] — [Task description] — [Deadline if mentioned]
If no owner is mentioned, write [Unassigned]. If no deadline is mentioned, write [No deadline set].

NEXT STEPS
List follow-up items, upcoming meetings, or things that need to happen next.

Be thorough — extract every action item and decision, even if implied. Use clear, professional language.

Meeting notes:
${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/meeting-notes/`,
    ].join("\n");
  },
};

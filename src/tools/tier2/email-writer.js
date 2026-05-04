import { SITE_BASE } from "../../config.js";

const TONES = ["professional", "friendly", "casual", "formal", "apologetic", "persuasive", "concise", "warm"];

export default {
  name: "email_writer",
  description: "Generate a tailored email draft from a situation description and chosen tone. Returns a prompt the assistant should execute to produce the email (subject line, greeting, body, sign-off).",
  inputSchema: {
    type: "object",
    properties: {
      situation: { type: "string", description: "Describe the situation, recipient, and goal of the email" },
      tone: { type: "string", enum: TONES, default: "professional" },
    },
    required: ["situation"],
  },
  async run({ situation, tone = "professional" }) {
    if (!TONES.includes(tone)) tone = "professional";
    const prompt = `Write a ${tone} email for this situation: ${situation}\n\nInclude a subject line, greeting, body, and sign-off. Keep it concise and natural. Format:\nSubject: ...\n\n[email body]`;
    return [
      "Generate the following email by responding to the prompt below. Return only the finished email (subject + body), no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/email-writer/`,
    ].join("\n");
  },
};

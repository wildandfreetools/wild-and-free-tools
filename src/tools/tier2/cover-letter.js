import { SITE_BASE } from "../../config.js";

export default {
  name: "cover_letter",
  description: "Generate cover letter content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "f_job": {
        "type": "string",
        "description": "e.g. Senior Product Manager, Marketing Director, Software Engineer"
      },
      "f_company": {
        "type": "string",
        "description": "e.g. Stripe, Nike, Acme Corp"
      },
      "input": {
        "type": "string",
        "description": "List your relevant skills, experience, and achievements. The more specific, the better the letter.&#10;&#10;Example: 7 years in product management, led a team of 12, launched 3 products that drove $5M ARR, experienced with agile and data-driven decision making, MBA from Wharton"
      }
    },
    "required": [
      "f_job",
      "f_company",
      "input"
    ]
  },
  async run(args) {
    const prompt = `You are an expert career coach and cover letter writer. Write a complete cover letter for a job application. Follow these rules exactly:

1. Write 3-4 paragraphs (opening, 1-2 body paragraphs, closing)
2. Opening paragraph: State the specific role and company. Open with a strong hook — not "I am writing to apply for." Show you know what the company does.
3. Body paragraphs: Connect the candidate's specific skills and experience directly to what this role needs. Use concrete details, numbers, and achievements from the skills provided. Do NOT use generic phrases like "I am a hard worker" or "I am passionate about."
4. Closing paragraph: Restate interest, mention enthusiasm for contributing, and include a call to action about next steps.
5. Use a polished, professional tone. Be direct, confident, and respectful.
6. Do NOT include placeholder brackets like [Your Name] or [Address]. Start directly with the greeting "Dear Hiring Manager," and end with "Sincerely," on its own line.
7. Keep it under 350 words. Every sentence should earn its place.

Job Title: ${args.f_job}
Company: ${args.f_company}
Candidate's Key Skills & Experience: ${args.input}`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/ai-tools/cover-letter/`,
    ].join("\n");
  },
};

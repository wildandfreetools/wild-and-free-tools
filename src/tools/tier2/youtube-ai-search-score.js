import { SITE_BASE } from "../../config.js";

export default {
  name: "youtube_ai_search_score",
  description: "Generate youtube ai search score content. Returns a prompt for the assistant to execute.",
  inputSchema: {
    "type": "object",
    "properties": {
      "title": {
        "type": "string",
        "description": "Your YouTube Title"
      },
      "desc": {
        "type": "string",
        "description": "Your Description"
      }
    },
    "required": [
      "title",
      "desc"
    ]
  },
  async run(args) {
    const prompt = `You are an expert in Generative Engine Optimization (GEO) — helping YouTube creators get their content cited by AI answer engines (Google AI Overviews, ChatGPT, Perplexity, Gemini).

Analyze this YouTube content for AI search / citation likelihood:

Title: ${args.title}
Description: ${args.desc}

Score from 0-100. High score (80+) = AI engines likely to quote this content when answering related questions. Low score (under 50) = content reads like clickbait, curiosity gap, or generic SEO stuffing that AI engines ignore.

Signals that INCREASE score:
- Title clearly states what the video teaches (not a cliffhanger)
- Specific numbers, methods, or outcomes
- Direct answer to a searchable question
- Factual density in description
- Clear topic entities (people, tools, concepts)
- Structured claims

Signals that DECREASE score:
- Curiosity-gap clickbait ("You won't believe...")
- Vague emotional language
- Keyword stuffing
- No concrete promises of content
- Links/hashtags crowding out actual info

Respond in EXACTLY this format, no preamble:

## Score
<number>/100

## What's Working
<2-3 specific things this content does well, or "(nothing notable)" if score is low>

## What's Weak
<2-3 specific issues, explain WHY AI engines would skip this>

## Rewrites
Title: <improved title, under 60 chars, answers a specific question or makes a factual promise>
Description: <first 2 sentences of an improved description, AI-citation-ready>`;
    return [
      "Generate the following content by responding to the prompt below. Return only the finished output, no commentary.",
      "",
      "---",
      prompt,
      "---",
      "",
      `Web version: ${SITE_BASE}/youtube-tools/youtube-ai-search-score/`,
    ].join("\n");
  },
};

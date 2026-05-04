# Wild and Free Tools

**A Model Context Protocol (MCP) server that gives your AI coding agent 350+ free utility tools.** Format JSON, encode Base64, count words, hash text, look up YouTube metadata, draft emails, and many more, all from inside Claude Code, Cursor, Codex, Gemini CLI, Cline, or any MCP-compatible agent.

The web versions of every tool live at [wildandfreetools.com](https://wildandfreetools.com). The MCP server lets you call them from your terminal or editor without switching context.

## What you get

- **Local-first** for fast utilities (JSON, Base64, hashes, text counters, regex, encoding, calculators).
- **Prompt-driven** for generation tasks (emails, captions, scripts, summaries). The tool hands a tested prompt to your agent's own LLM, so it works with whatever model you are running, including local ones.
- **Live data** for tools that need it (YouTube video metadata, channel info). Calls a public endpoint on wildandfreetools.com, no API keys required.
- **MIT licensed**, no signup, no paywall, no telemetry, no analytics.

## Compatible agents

Any agent that supports Model Context Protocol works:

- Claude Code, Claude Desktop
- Cursor, Windsurf
- OpenAI Codex
- Gemini CLI, Gemini Code Assist
- Cline, Roo Code, Continue, Aider
- Goose, Replit Agent
- Local-model agents via Ollama, LM Studio, llama.cpp

The model behind your agent does not matter. GPT-5, Claude, Gemini, DeepSeek, Qwen, Llama, Grok, Mistral, anything served by Groq or Together or OpenRouter, all work.

## Install

### From source (recommended for v0.1)

```bash
git clone https://github.com/wildandfreetools/wild-and-free-tools.git
cd wild-and-free-tools
npm install
```

Then point your MCP-compatible agent at `src/index.js`. Examples below.

### Via npx (coming soon)

Once published to npm:

```bash
npx wild-and-free-tools
```

## Wire it into your agent

### Claude Code

Add to `~/.claude/mcp.json`:

```json
{
  "mcpServers": {
    "wild-and-free-tools": {
      "command": "node",
      "args": ["/absolute/path/to/wild-and-free-tools/src/index.js"]
    }
  }
}
```

Restart Claude Code. The tools appear automatically.

### Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "wild-and-free-tools": {
      "command": "node",
      "args": ["/absolute/path/to/wild-and-free-tools/src/index.js"]
    }
  }
}
```

### Cline / Continue / Roo Code

Use each agent's MCP settings panel and point it at the same `node src/index.js` command.

### Other agents

Any agent that follows the MCP stdio transport spec works. Use `node /absolute/path/to/src/index.js` as the command.

## Examples

In your agent, after the server is wired up:

```
Use json_formatter to pretty-print this:
{"name":"luca","tags":["dog","corgi"],"age":5}
```

```
Use word_counter on the README and tell me the reading time.
```

```
Use email_writer to draft a friendly follow-up to a prospect who hasn't responded in a week.
```

```
Use youtube_video_info to look up dQw4w9WgXcQ and summarize what the video is about.
```

## Roadmap

The full library of 350+ tools is being added in batches. Browser-API tools (image, video, audio, OCR, PDF, spreadsheet, design, font, chart, document) are on the v0.4 roadmap. Star the repo to follow progress.

<!-- TOOLS-TABLE:START -->
## Tools in this release

75 tools registered. Click any tool name to view its source. Web versions of every tool live at [wildandfreetools.com](https://wildandfreetools.com).

### Tier 1: local computation (38)

Run entirely inside the MCP server process. No network calls, no LLM calls, deterministic output.

| Tool | What it does |
|---|---|
| [`age_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/age-calculator.js) | Calculate age in years, months, and days from a date of birth, optionally as of a target date. |
| [`base64_encoder`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/base64-encoder.js) | Encode text to Base64 or decode Base64 back to text. Standard Base64 with optional URL-safe variant. |
| [`box_shadow_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/box-shadow-generator.js) | Generate CSS box-shadow values from offset, blur, spread, color, and inset settings. |
| [`budget_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/budget-calculator.js) | Calculate a monthly budget breakdown across income and expense categories, returning surplus or deficit. |
| [`color_converter`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/color-converter.js) | Convert between color formats: HEX, RGB, RGBA, HSL. Accepts a HEX string or rgb()/hsl() expression as input. |
| [`css_gradient_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/css-gradient-generator.js) | Generate CSS linear or radial gradient code from color stops and direction. |
| [`dca_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/dca-calculator.js) | Calculate dollar-cost-averaging returns over a period given a recurring investment amount and asset price history. |
| [`debt_payoff_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/debt-payoff-calculator.js) | Calculate the payoff timeline and total interest for a debt given balance, APR, and monthly payment. |
| [`diff_checker`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/diff-checker.js) | Compare two text inputs and return a line-by-line diff highlighting additions, deletions, and unchanged lines. |
| [`dividend_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/dividend-calculator.js) | Calculate annual dividend income and yield-on-cost from share count, share price, and dividend rate. |
| [`email_validator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/email-validator.js) | Validate an email address syntactically and report common deliverability issues like disposable domains. |
| [`fire_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/fire-calculator.js) | Calculate financial-independence (FIRE) numbers: target nest egg, savings rate impact, and years to retirement. |
| [`hash_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/hash-generator.js) | Generate cryptographic hash digests (md5, sha1, sha256, sha384, sha512) from text input. Returns hex-encoded digest. |
| [`heading_validator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/heading-validator.js) | Validate the heading hierarchy (h1 through h6) of an HTML document for accessibility and SEO best practices. |
| [`headline_analyzer`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/headline-analyzer.js) | Score a headline on length, word balance, sentiment, common/uncommon word ratio, and clarity. |
| [`json_formatter`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/json-formatter.js) | Format, validate, and minify JSON. Pretty-prints valid JSON with 2-space indentation, or minifies it. Returns parse errors with descriptive messages. |
| [`keyword_density`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/keyword-density.js) | Calculate keyword density and frequency for one-, two-, and three-word phrases in a block of text. |
| [`lorem_ipsum_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/lorem-ipsum-generator.js) | Generate placeholder Lorem Ipsum text in words, sentences, or paragraphs. |
| [`options_profit_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/options-profit-calculator.js) | Calculate profit and loss at expiration for a single-leg option trade given strike, premium, and underlying price. |
| [`passphrase_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/passphrase-generator.js) | Generate a memorable passphrase from a wordlist with configurable word count and separator. |
| [`password_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/password-generator.js) | Generate cryptographically random passwords with configurable length and character classes. |
| [`position_size_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/position-size-calculator.js) | Calculate trade position size given account balance, risk percent, entry price, and stop-loss price. |
| [`prompt_builder`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/prompt-builder.js) | Assemble a structured LLM prompt from role, context, task, format, and constraint fields. |
| [`random_number_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/random-number-generator.js) | Generate one or more random integers within a configurable minimum and maximum range. |
| [`remove_duplicates`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/remove-duplicates.js) | Remove duplicate lines from a text input, with optional case-sensitivity and trim controls. |
| [`resume_keyword_matcher`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/resume-keyword-matcher.js) | Compare a resume to a job description and report matching, missing, and surplus keywords. |
| [`risk_reward_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/risk-reward-calculator.js) | Calculate risk-to-reward ratio and break-even win rate for a trade given entry, stop-loss, and target. |
| [`serp_preview`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/serp-preview.js) | Preview how a page title, URL, and meta description will render in Google search results, with length checks. |
| [`slug_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/slug-generator.js) | Convert text into a URL-friendly slug. Lowercases, removes accents, replaces spaces and special characters with hyphens, collapses repeats. |
| [`spacing_checker`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/spacing-checker.js) | Detect double spaces, leading and trailing whitespace, and inconsistent spacing patterns in text. |
| [`stock_profit_calculator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/stock-profit-calculator.js) | Calculate profit and loss for a stock trade given buy price, sell price, share count, and commissions. |
| [`text_case_converter`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/text-case-converter.js) | Convert text between case formats: lowercase, UPPERCASE, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case. |
| [`text_line_tools`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/text-line-tools.js) | Operate on text line-by-line: sort, reverse, deduplicate, count, shuffle, trim whitespace, remove empty lines. |
| [`timestamp_converter`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/timestamp-converter.js) | Convert between Unix timestamps (seconds or milliseconds) and ISO 8601 / human-readable dates. Supports any timezone. |
| [`unit_converter`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/unit-converter.js) | Convert between units across length, weight, temperature, volume, area, time, and speed. |
| [`url_encoder`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/url-encoder.js) | URL-encode or URL-decode text. Encodes special characters into percent-encoding for safe use in URLs and query strings, or decodes them back. |
| [`uuid_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/uuid-generator.js) | Generate one or more UUIDs (v4 by default). Useful for creating unique identifiers, request IDs, or test data. |
| [`word_counter`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier1/word-counter.js) | Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time for a text input. |

### Tier 2: prompt-driven generation (34)

Return a tested prompt for your agent's own LLM to execute. Works with any model the agent is wired to.

| Tool | What it does |
|---|---|
| [`blog_outline`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/blog-outline.js) | Generate blog outline content. Returns a prompt for the assistant to execute. |
| [`code_explainer`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/code-explainer.js) | Generate code explainer content. Returns a prompt for the assistant to execute. |
| [`cover_letter`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/cover-letter.js) | Generate cover letter content. Returns a prompt for the assistant to execute. |
| [`email_writer`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/email-writer.js) | Generate a tailored email draft from a situation description and chosen tone. Returns a prompt the assistant should execute to produce the email (subject line, greeting, body, sign-off). |
| [`grammar_fixer`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/grammar-fixer.js) | Generate grammar fixer content. Returns a prompt for the assistant to execute. |
| [`instagram_bio_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/instagram-bio-generator.js) | Generate instagram bio generator content. Returns a prompt for the assistant to execute. |
| [`instagram_caption_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/instagram-caption-generator.js) | Generate instagram caption generator content. Returns a prompt for the assistant to execute. |
| [`instagram_reels_script_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/instagram-reels-script-generator.js) | Generate instagram reels script generator content. Returns a prompt for the assistant to execute. |
| [`linkedin_headline_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/linkedin-headline-generator.js) | Generate linkedin headline generator content. Returns a prompt for the assistant to execute. |
| [`linkedin_post_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/linkedin-post-generator.js) | Generate linkedin post generator content. Returns a prompt for the assistant to execute. |
| [`meeting_notes`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/meeting-notes.js) | Generate meeting notes content. Returns a prompt for the assistant to execute. |
| [`meta_description`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/meta-description.js) | Generate meta description content. Returns a prompt for the assistant to execute. |
| [`paraphraser`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/paraphraser.js) | Generate paraphraser content. Returns a prompt for the assistant to execute. |
| [`pinterest_bio_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/pinterest-bio-generator.js) | Generate pinterest bio generator content. Returns a prompt for the assistant to execute. |
| [`pinterest_pin_description_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/pinterest-pin-description-generator.js) | Generate pinterest pin description generator content. Returns a prompt for the assistant to execute. |
| [`product_description`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/product-description.js) | Generate product description content. Returns a prompt for the assistant to execute. |
| [`social_caption`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/social-caption.js) | Generate social caption content. Returns a prompt for the assistant to execute. |
| [`subject_line`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/subject-line.js) | Generate subject line content. Returns a prompt for the assistant to execute. |
| [`summarizer`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/summarizer.js) | Generate summarizer content. Returns a prompt for the assistant to execute. |
| [`threads_bio_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/threads-bio-generator.js) | Generate threads bio generator content. Returns a prompt for the assistant to execute. |
| [`threads_post_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/threads-post-generator.js) | Generate threads post generator content. Returns a prompt for the assistant to execute. |
| [`tiktok_bio_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/tiktok-bio-generator.js) | Generate tiktok bio generator content. Returns a prompt for the assistant to execute. |
| [`tiktok_caption_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/tiktok-caption-generator.js) | Generate tiktok caption generator content. Returns a prompt for the assistant to execute. |
| [`tiktok_script_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/tiktok-script-generator.js) | Generate tiktok script generator content. Returns a prompt for the assistant to execute. |
| [`tone_rewriter`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/tone-rewriter.js) | Generate tone rewriter content. Returns a prompt for the assistant to execute. |
| [`tweet_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/tweet-generator.js) | Generate tweet generator content. Returns a prompt for the assistant to execute. |
| [`twitter_thread_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/twitter-thread-generator.js) | Generate twitter thread generator content. Returns a prompt for the assistant to execute. |
| [`twitter_x_bio_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/twitter-x-bio-generator.js) | Generate twitter x bio generator content. Returns a prompt for the assistant to execute. |
| [`youtube_ai_search_score`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/youtube-ai-search-score.js) | Generate youtube ai search score content. Returns a prompt for the assistant to execute. |
| [`youtube_channel_description_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/youtube-channel-description-generator.js) | Generate youtube channel description generator content. Returns a prompt for the assistant to execute. |
| [`youtube_channel_name_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/youtube-channel-name-generator.js) | Generate youtube channel name generator content. Returns a prompt for the assistant to execute. |
| [`youtube_shorts_script_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/youtube-shorts-script-generator.js) | Generate youtube shorts script generator content. Returns a prompt for the assistant to execute. |
| [`youtube_summarizer`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/youtube-summarizer.js) | Generate youtube summarizer content. Returns a prompt for the assistant to execute. |
| [`youtube_title_description_generator`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier2/youtube-title-description-generator.js) | Generate youtube title description generator content. Returns a prompt for the assistant to execute. |

### Tier 3: live-data lookups (3)

Call public endpoints on wildandfreetools.com for data the local process can't compute. No API keys required.

| Tool | What it does |
|---|---|
| [`youtube_channel_info`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier3/youtube-channel-info.js) | Look up a YouTube channel's branding metadata: title, description, subscriber count, view count, country, custom URL, banner, profile picture, and keywords. Accepts a channel URL, @handle, or channel ID. |
| [`youtube_keyword_autocomplete`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier3/youtube-keyword-autocomplete.js) | Get YouTube search autocomplete suggestions for a seed keyword. Useful for tag generation, video title research, and discovering what people search for on a topic. |
| [`youtube_video_info`](https://github.com/wildandfreetools/wild-and-free-tools/tree/main/src/tools/tier3/youtube-video-info.js) | Look up YouTube video metadata: title, description, channel, view count, like count, publish date, tags, and thumbnail. Accepts a video URL, shorts URL, or 11-character video ID. |

<!-- TOOLS-TABLE:END -->

## Configuration

Environment variables (all optional):

| Variable | Default | Purpose |
|---|---|---|
| `WFT_SITE_BASE` | `https://wildandfreetools.com` | Base URL for the public site and links in tool responses |
| `WFT_API_BASE` | `${WFT_SITE_BASE}/api` | Base URL for backend endpoints |

## Privacy

The server runs entirely on your machine. The only network calls it makes are:

- Tier 3 tools that hit `wildandfreetools.com/api/...` (e.g., YouTube metadata lookups). Required to fetch live data.
- Nothing else. No telemetry, no analytics, no logging.

Your inputs to local tools (Tier 1) and prompt tools (Tier 2) never leave your machine.

## Contributing

Bug reports, tool ideas, and PRs welcome.

- File issues at [github.com/wildandfreetools/wild-and-free-tools/issues](https://github.com/wildandfreetools/wild-and-free-tools/issues)
- See [AGENTS.md](AGENTS.md) for the tool-authoring conventions

## License

MIT. Use it for anything, including commercial work.

## Links

- Site: [wildandfreetools.com](https://wildandfreetools.com)
- Profile: [github.com/wildandfreetools](https://github.com/wildandfreetools)
- Browse all 350+ tools in your browser: [wildandfreetools.com](https://wildandfreetools.com)

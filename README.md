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

## What's in v0.2

50 tools shipped:

- **14 Tier 1 tools** (local computation): JSON formatter, Base64, URL encoder, hash generator, word counter, UUID generator, password generator, lorem ipsum generator, slug generator, text case converter, text line tools (sort/dedupe/shuffle), timestamp converter, color converter
- **33 Tier 2 tools** (prompt-driven generation): blog outline, code explainer, cover letter, email writer, grammar fixer, meeting notes, meta description, paraphraser, product description, social caption, subject line, summarizer, tone rewriter, YouTube summarizer, plus social-media generators for Instagram, LinkedIn, Pinterest, Threads, TikTok, Twitter/X, YouTube
- **3 Tier 3 tools** (live data): YouTube video info, YouTube channel info, YouTube keyword autocomplete

The full library of 350+ tools is being added in batches. Star the repo to follow progress.

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

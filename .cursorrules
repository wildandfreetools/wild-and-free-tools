# Wild and Free Tools: Agent Guide

This is a Model Context Protocol (MCP) server that exposes a library of free utility tools to AI coding agents.

## What this gives you

A set of installable tools that handle common dev tasks without a network round trip to a chat completion: format JSON, encode/decode Base64, count words, hash text, look up YouTube video metadata, draft emails, and many more. Tools run locally inside the MCP server process.

The web versions of all tools live at `https://wildandfreetools.com`. Each tool's response includes a link to its web counterpart so users can switch contexts easily.

## How tools are organized

Tools are loaded automatically from `src/tools/<tier>/*.js`. Each file exports a default object with this shape:

```js
export default {
  name: "tool_name",
  description: "What the tool does, in one sentence.",
  inputSchema: { type: "object", properties: {...}, required: [...] },
  async run(args) { /* return string or object */ },
};
```

The registry walks `src/tools/tier1`, `src/tools/tier2`, `src/tools/tier3` at startup and registers every default export. To add a new tool, drop a new file in the appropriate tier folder.

### Tier semantics

- **tier1**: Pure local computation. No network, no agent LLM call. Fast, deterministic.
- **tier2**: Generation tools. The tool returns a prompt for the calling agent's own LLM to execute. The agent generates the result.
- **tier3**: Tools that call existing wildandfreetools.com endpoints for data the local process can't compute (e.g., looking up YouTube video metadata).

## Adding tools

1. Pick the tier folder that matches the tool's behavior.
2. Create `<slug>.js` exporting a default tool object.
3. Validate input with the JSON schema (the runtime relies on it).
4. Always include a `webVersion` link in the returned object pointing to the corresponding wildandfreetools.com page.

## Running locally for development

```bash
npm install
node src/index.js
```

The server speaks MCP over stdio. Connect any MCP-compatible client to test.

## Configuration

Environment variables (all optional):

- `WFT_SITE_BASE`: Base URL for the public site. Default: `https://wildandfreetools.com`.
- `WFT_API_BASE`: Base URL for backend endpoints. Default: `${WFT_SITE_BASE}/api`.

## Pull requests welcome

Tool ideas, bug reports, and PRs are all welcome. See the README for install instructions and the contributor section for guidelines.

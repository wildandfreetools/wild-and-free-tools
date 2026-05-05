import { SITE_BASE } from "../../config.js";

const NAMED = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", copy: "©", reg: "®", trade: "™", hellip: "…", mdash: "—", ndash: "–", lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”" };
const NAMED_INV = Object.fromEntries(Object.entries(NAMED).map(([k, v]) => [v, k]));

function encode({ named = true, all = false } = {}) {
  return (text) => text.replace(/[\s\S]/g, (ch) => {
    if (named && NAMED_INV[ch]) return `&${NAMED_INV[ch]};`;
    const code = ch.codePointAt(0);
    if (all && code > 127) return `&#${code};`;
    if (ch === "&") return "&amp;";
    if (ch === "<") return "&lt;";
    if (ch === ">") return "&gt;";
    if (ch === '"') return "&quot;";
    if (ch === "'") return "&#39;";
    return ch;
  });
}

function decode(text) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&([a-z]+);/gi, (m, name) => (NAMED[name.toLowerCase()] !== undefined ? NAMED[name.toLowerCase()] : m));
}

export default {
  name: "html_entities",
  description: "Encode text to HTML entities or decode HTML entities back to text. Handles named entities (&amp;, &lt;), numeric (&#39;), and hex (&#x2F;).",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Text to encode or HTML-entity-encoded string to decode" },
      mode: { type: "string", enum: ["encode", "decode"], default: "encode" },
      encode_all: { type: "boolean", description: "When encoding, also escape every non-ASCII character to a numeric entity", default: false },
    },
    required: ["input"],
  },
  async run({ input, mode = "encode", encode_all = false }) {
    if (mode === "decode") return decode(input);
    return encode({ all: encode_all })(input);
  },
};

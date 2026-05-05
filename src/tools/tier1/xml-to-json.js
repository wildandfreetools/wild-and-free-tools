import { SITE_BASE } from "../../config.js";

// Lightweight XML parser. Handles elements, text, attributes, CDATA, and self-closing tags.
// Does not support DTDs, processing instructions beyond skipping them, or namespaces beyond preserving prefixes.
function parseXML(text) {
  let pos = 0;
  const len = text.length;

  function skipWhitespace() { while (pos < len && /\s/.test(text[pos])) pos++; }
  function startsWith(s) { return text.substr(pos, s.length) === s; }

  function parseAttrs(end) {
    const attrs = {};
    while (pos < end) {
      skipWhitespace();
      if (pos >= end || text[pos] === "/" || text[pos] === ">") break;
      let nameEnd = pos;
      while (nameEnd < end && text[nameEnd] !== "=" && !/\s/.test(text[nameEnd])) nameEnd++;
      const name = text.slice(pos, nameEnd);
      pos = nameEnd;
      skipWhitespace();
      if (text[pos] !== "=") { attrs[name] = true; continue; }
      pos++;
      skipWhitespace();
      const quote = text[pos];
      if (quote !== '"' && quote !== "'") throw new Error(`Expected quote at position ${pos}`);
      pos++;
      const valStart = pos;
      while (pos < end && text[pos] !== quote) pos++;
      attrs[name] = decodeEntities(text.slice(valStart, pos));
      pos++;
    }
    return attrs;
  }

  function decodeEntities(s) {
    return s
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
      .replace(/&amp;/g, "&");
  }

  function parseElement() {
    if (text[pos] !== "<") throw new Error(`Expected '<' at position ${pos}`);
    pos++;
    const nameStart = pos;
    while (pos < len && !/[\s/>]/.test(text[pos])) pos++;
    const name = text.slice(nameStart, pos);
    const tagEnd = text.indexOf(">", pos);
    if (tagEnd === -1) throw new Error("Unclosed tag");
    const selfClosing = text[tagEnd - 1] === "/";
    const attrs = parseAttrs(selfClosing ? tagEnd - 1 : tagEnd);
    pos = tagEnd + 1;

    const node = { _name: name };
    if (Object.keys(attrs).length) node._attrs = attrs;
    if (selfClosing) return node;

    const children = [];
    let textBuf = "";
    while (pos < len) {
      if (startsWith("<!--")) { pos = text.indexOf("-->", pos); if (pos === -1) throw new Error("Unclosed comment"); pos += 3; continue; }
      if (startsWith("<![CDATA[")) {
        const cend = text.indexOf("]]>", pos);
        if (cend === -1) throw new Error("Unclosed CDATA");
        textBuf += text.slice(pos + 9, cend);
        pos = cend + 3;
        continue;
      }
      if (startsWith("</")) {
        const closeEnd = text.indexOf(">", pos);
        pos = closeEnd + 1;
        if (textBuf.trim()) children.push({ _text: decodeEntities(textBuf) });
        if (children.length) node._children = children;
        return node;
      }
      if (text[pos] === "<") {
        if (textBuf.trim()) children.push({ _text: decodeEntities(textBuf) });
        textBuf = "";
        children.push(parseElement());
        continue;
      }
      textBuf += text[pos++];
    }
    throw new Error(`Unclosed element <${name}>`);
  }

  // Skip prolog and doctype
  while (pos < len) {
    skipWhitespace();
    if (startsWith("<?")) { pos = text.indexOf("?>", pos) + 2; continue; }
    if (startsWith("<!--")) { pos = text.indexOf("-->", pos) + 3; continue; }
    if (startsWith("<!")) { pos = text.indexOf(">", pos) + 1; continue; }
    break;
  }
  if (pos >= len) throw new Error("Empty document");
  return parseElement();
}

// Collapse {_name, _attrs, _children, _text} structure into a more idiomatic JSON object.
function simplify(node) {
  if (node._text !== undefined) return node._text;
  const out = {};
  if (node._attrs) for (const [k, v] of Object.entries(node._attrs)) out["@" + k] = v;
  if (!node._children) return out;
  const grouped = {};
  for (const child of node._children) {
    if (child._text !== undefined) {
      grouped["#text"] = (grouped["#text"] || "") + child._text;
      continue;
    }
    const val = simplify(child);
    if (grouped[child._name] === undefined) grouped[child._name] = val;
    else if (Array.isArray(grouped[child._name])) grouped[child._name].push(val);
    else grouped[child._name] = [grouped[child._name], val];
  }
  return Object.keys(out).length ? { ...out, ...grouped } : grouped;
}

export default {
  name: "xml_to_json",
  description: "Parse XML text into JSON. Element children become object keys, repeated children become arrays, attributes are prefixed with @, and text content is preserved.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Raw XML text" },
    },
    required: ["input"],
  },
  async run({ input }) {
    try {
      const tree = parseXML(input);
      return { [tree._name]: simplify(tree) };
    } catch (e) {
      return `XML parse error: ${e.message}\n\nWeb version: ${SITE_BASE}/developer-tools/xml-to-json/`;
    }
  },
};

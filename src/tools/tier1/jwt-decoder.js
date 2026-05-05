import { SITE_BASE } from "../../config.js";

function base64UrlDecode(str) {
  let s = str.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Buffer.from(s, "base64").toString("utf8");
}

export default {
  name: "jwt_decoder",
  description: "Decode a JSON Web Token (JWT). Returns the parsed header and payload, the algorithm, and expiration info. Does NOT verify the signature.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "JWT string in the form header.payload.signature" },
    },
    required: ["input"],
  },
  async run({ input }) {
    const token = (input || "").trim();
    const parts = token.split(".");
    if (parts.length !== 3) {
      return `Invalid JWT: expected 3 parts separated by dots, got ${parts.length}.\n\nWeb version: ${SITE_BASE}/developer-tools/jwt-decoder/`;
    }
    let header, payload;
    try { header = JSON.parse(base64UrlDecode(parts[0])); }
    catch (e) { return `Header decode error: ${e.message}`; }
    try { payload = JSON.parse(base64UrlDecode(parts[1])); }
    catch (e) { return `Payload decode error: ${e.message}`; }

    const now = Math.floor(Date.now() / 1000);
    const out = {
      header,
      payload,
      algorithm: header.alg,
      type: header.typ,
      signature: parts[2],
      verified: false,
      note: "Signature is not verified. Use a JWT library with the issuing key to verify.",
    };
    if (typeof payload.exp === "number") {
      out.expires_at = new Date(payload.exp * 1000).toISOString();
      out.expired = now >= payload.exp;
    }
    if (typeof payload.iat === "number") out.issued_at = new Date(payload.iat * 1000).toISOString();
    if (typeof payload.nbf === "number") out.not_before = new Date(payload.nbf * 1000).toISOString();
    return out;
  },
};

import { randomUUID, randomBytes } from "node:crypto";
import { SITE_BASE } from "../../config.js";

export default {
  name: "uuid_generator",
  description: "Generate one or more UUIDs (v4 by default). Useful for creating unique identifiers, request IDs, or test data.",
  inputSchema: {
    type: "object",
    properties: {
      count: { type: "number", default: 1, minimum: 1, maximum: 1000 },
      version: { type: "string", enum: ["v4"], default: "v4" },
      uppercase: { type: "boolean", default: false },
    },
  },
  async run({ count = 1, uppercase = false } = {}) {
    const n = Math.max(1, Math.min(1000, Math.floor(count)));
    const ids = Array.from({ length: n }, () => {
      const u = randomUUID();
      return uppercase ? u.toUpperCase() : u;
    });
    return {
      uuids: ids,
      count: ids.length,
      webVersion: `${SITE_BASE}/generator-tools/uuid-generator/`,
    };
  },
};

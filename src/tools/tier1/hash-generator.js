import { createHash } from "node:crypto";
import { SITE_BASE } from "../../config.js";

const ALGORITHMS = ["md5", "sha1", "sha256", "sha384", "sha512"];

export default {
  name: "hash_generator",
  description: "Generate cryptographic hash digests (md5, sha1, sha256, sha384, sha512) from text input. Returns hex-encoded digest.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Text to hash" },
      algorithm: { type: "string", enum: ALGORITHMS, default: "sha256" },
    },
    required: ["input"],
  },
  async run({ input, algorithm = "sha256" }) {
    if (!ALGORITHMS.includes(algorithm)) {
      return `Unsupported algorithm: ${algorithm}. Use one of: ${ALGORITHMS.join(", ")}`;
    }
    const digest = createHash(algorithm).update(input, "utf8").digest("hex");
    return {
      algorithm,
      digest,
      webVersion: `${SITE_BASE}/developer-tools/hash-generator/`,
    };
  },
};

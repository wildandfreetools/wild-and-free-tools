import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/lorem-ipsum.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "t-type": {
    "key": "type",
    "isCheckbox": null,
    "isNumber": null
  },
  "t-count": {
    "key": "count",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["t-output"];

export default {
  name: "lorem_ipsum",
  description: "Run the lorem ipsum tool. text category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "type": {
        "type": "string",
        "enum": [
          "paragraphs",
          "sentences",
          "words"
        ],
        "description": "type",
        "default": "paragraphs"
      },
      "count": {
        "type": "number",
        "description": "count"
      }
    },
    "required": [
      "count"
    ]
  },
  async run(args) {
    const inputValues = {};
    for (const [id, meta] of Object.entries(INPUT_MAP)) {
      const v = args[meta.key];
      if (v === undefined || v === null) {
        inputValues[id] = "";
      } else if (meta.isCheckbox) {
        inputValues[id] = v ? "on" : "";
      } else {
        inputValues[id] = String(v);
      }
    }
    const result = await runToolSandbox({
      script,
      action: "gen",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/text-tools/lorem-ipsum/`;
    }
    return result.output;
  },
};

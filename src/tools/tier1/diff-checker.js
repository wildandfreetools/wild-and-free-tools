import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/diff-checker.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "t-a": {
    "key": "a",
    "isCheckbox": null,
    "isNumber": null
  },
  "t-b": {
    "key": "b",
    "isCheckbox": null,
    "isNumber": null
  }
};
const OUTPUTS = ["t-output"];

export default {
  name: "diff_checker",
  description: "Run the diff checker tool. developer category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "a": {
        "type": "string",
        "description": "Paste original text..."
      },
      "b": {
        "type": "string",
        "description": "Paste modified text..."
      }
    },
    "required": [
      "a",
      "b"
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
      action: "run",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/developer-tools/diff-checker/`;
    }
    return result.output;
  },
};

import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/remove-duplicates.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "t-input": {
    "key": "input",
    "isCheckbox": null,
    "isNumber": null
  }
};
const OUTPUTS = ["t-output"];

export default {
  name: "remove_duplicates",
  description: "Run the remove duplicates tool. text category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "One item per line..."
      }
    },
    "required": [
      "input"
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
      action: "dedup",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/text-tools/remove-duplicates/`;
    }
    return result.output;
  },
};

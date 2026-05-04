import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/keyword-density.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "t-input": {
    "key": "input",
    "isCheckbox": null,
    "isNumber": null
  },
  "target-kw": {
    "key": "target_kw",
    "isCheckbox": false,
    "isNumber": false
  }
};
const OUTPUTS = ["target-result"];

export default {
  name: "keyword_density",
  description: "Calculate keyword density and frequency for one-, two-, and three-word phrases in a block of text.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input": {
        "type": "string",
        "description": "Paste your article, blog post, or any text here to analyze keyword density and word frequency..."
      },
      "target_kw": {
        "type": "string",
        "description": "e.g. running shoes, content marketing, meal prep"
      }
    },
    "required": [
      "input",
      "target_kw"
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
      action: "analyze",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/writing-tools/keyword-density/`;
    }
    return result.output;
  },
};

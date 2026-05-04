import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/headline-analyzer.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "headline-input": {
    "key": "headline_input",
    "isCheckbox": false,
    "isNumber": false
  }
};
const OUTPUTS = ["results","score-number","score-label"];

export default {
  name: "headline_analyzer",
  description: "Run the headline analyzer tool. writing category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "headline_input": {
        "type": "string",
        "description": "Type or paste your headline here..."
      }
    },
    "required": [
      "headline_input"
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
      action: "runAnalysis",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/writing-tools/headline-analyzer/`;
    }
    return result.output;
  },
};

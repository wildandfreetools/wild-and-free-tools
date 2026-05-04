import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/fire-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "income": {
    "key": "income",
    "isCheckbox": false,
    "isNumber": true
  },
  "expenses": {
    "key": "expenses",
    "isCheckbox": false,
    "isNumber": true
  },
  "savings": {
    "key": "savings",
    "isCheckbox": false,
    "isNumber": true
  },
  "rate": {
    "key": "rate",
    "isCheckbox": false,
    "isNumber": true
  },
  "swr": {
    "key": "swr",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "fire_calculator",
  description: "Calculate financial-independence (FIRE) numbers: target nest egg, savings rate impact, and years to retirement.",
  inputSchema: {
    "type": "object",
    "properties": {
      "income": {
        "type": "number",
        "description": "income"
      },
      "expenses": {
        "type": "number",
        "description": "expenses"
      },
      "savings": {
        "type": "number",
        "description": "savings"
      },
      "rate": {
        "type": "number",
        "description": "rate"
      },
      "swr": {
        "type": "number",
        "description": "swr"
      }
    },
    "required": [
      "income",
      "expenses",
      "savings",
      "rate",
      "swr"
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
      action: "calc",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/fire-calculator/`;
    }
    return result.output;
  },
};

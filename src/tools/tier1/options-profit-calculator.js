import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/options-profit-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "strike": {
    "key": "strike",
    "isCheckbox": false,
    "isNumber": true
  },
  "premium": {
    "key": "premium",
    "isCheckbox": false,
    "isNumber": true
  },
  "expiry": {
    "key": "expiry",
    "isCheckbox": false,
    "isNumber": true
  },
  "contracts": {
    "key": "contracts",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "options_profit_calculator",
  description: "Calculate profit and loss at expiration for a single-leg option trade given strike, premium, and underlying price.",
  inputSchema: {
    "type": "object",
    "properties": {
      "strike": {
        "type": "number",
        "description": "strike"
      },
      "premium": {
        "type": "number",
        "description": "premium"
      },
      "expiry": {
        "type": "number",
        "description": "expiry"
      },
      "contracts": {
        "type": "number",
        "description": "contracts"
      }
    },
    "required": [
      "strike",
      "premium",
      "expiry",
      "contracts"
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
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/options-profit-calculator/`;
    }
    return result.output;
  },
};

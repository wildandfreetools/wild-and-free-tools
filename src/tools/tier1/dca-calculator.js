import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/dca-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "amount": {
    "key": "amount",
    "isCheckbox": false,
    "isNumber": true
  },
  "rate": {
    "key": "rate",
    "isCheckbox": false,
    "isNumber": true
  },
  "years": {
    "key": "years",
    "isCheckbox": false,
    "isNumber": true
  },
  "lumpsum": {
    "key": "lumpsum",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "dca_calculator",
  description: "Calculate dollar-cost-averaging returns over a period given a recurring investment amount and asset price history.",
  inputSchema: {
    "type": "object",
    "properties": {
      "amount": {
        "type": "number",
        "description": "amount"
      },
      "rate": {
        "type": "number",
        "description": "rate"
      },
      "years": {
        "type": "number",
        "description": "years"
      },
      "lumpsum": {
        "type": "number",
        "description": "lumpsum"
      }
    },
    "required": [
      "amount",
      "rate",
      "years",
      "lumpsum"
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
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/dca-calculator/`;
    }
    return result.output;
  },
};

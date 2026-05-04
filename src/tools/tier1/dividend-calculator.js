import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/dividend-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "price": {
    "key": "price",
    "isCheckbox": false,
    "isNumber": true
  },
  "dividend": {
    "key": "dividend",
    "isCheckbox": false,
    "isNumber": true
  },
  "shares": {
    "key": "shares",
    "isCheckbox": false,
    "isNumber": true
  },
  "growth": {
    "key": "growth",
    "isCheckbox": false,
    "isNumber": true
  },
  "years": {
    "key": "years",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "dividend_calculator",
  description: "Calculate annual dividend income and yield-on-cost from share count, share price, and dividend rate.",
  inputSchema: {
    "type": "object",
    "properties": {
      "price": {
        "type": "number",
        "description": "price"
      },
      "dividend": {
        "type": "number",
        "description": "dividend"
      },
      "shares": {
        "type": "number",
        "description": "shares"
      },
      "growth": {
        "type": "number",
        "description": "growth"
      },
      "years": {
        "type": "number",
        "description": "years"
      }
    },
    "required": [
      "price",
      "dividend",
      "shares",
      "growth",
      "years"
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
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/dividend-calculator/`;
    }
    return result.output;
  },
};

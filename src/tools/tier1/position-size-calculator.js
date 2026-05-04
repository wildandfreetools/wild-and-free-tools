import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/position-size-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "account": {
    "key": "account",
    "isCheckbox": false,
    "isNumber": true
  },
  "risk": {
    "key": "risk",
    "isCheckbox": false,
    "isNumber": true
  },
  "entry": {
    "key": "entry",
    "isCheckbox": false,
    "isNumber": true
  },
  "stop": {
    "key": "stop",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "position_size_calculator",
  description: "Calculate trade position size given account balance, risk percent, entry price, and stop-loss price.",
  inputSchema: {
    "type": "object",
    "properties": {
      "account": {
        "type": "number",
        "description": "account"
      },
      "risk": {
        "type": "number",
        "description": "risk"
      },
      "entry": {
        "type": "number",
        "description": "entry"
      },
      "stop": {
        "type": "number",
        "description": "stop"
      }
    },
    "required": [
      "account",
      "risk",
      "entry",
      "stop"
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
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/position-size-calculator/`;
    }
    return result.output;
  },
};

import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/risk-reward-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "entry": {
    "key": "entry",
    "isCheckbox": false,
    "isNumber": true
  },
  "stop": {
    "key": "stop",
    "isCheckbox": false,
    "isNumber": true
  },
  "target": {
    "key": "target",
    "isCheckbox": false,
    "isNumber": true
  },
  "shares": {
    "key": "shares",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "risk_reward_calculator",
  description: "Calculate risk-to-reward ratio and break-even win rate for a trade given entry, stop-loss, and target.",
  inputSchema: {
    "type": "object",
    "properties": {
      "entry": {
        "type": "number",
        "description": "entry"
      },
      "stop": {
        "type": "number",
        "description": "stop"
      },
      "target": {
        "type": "number",
        "description": "target"
      },
      "shares": {
        "type": "number",
        "description": "shares"
      }
    },
    "required": [
      "entry",
      "stop",
      "target",
      "shares"
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
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/risk-reward-calculator/`;
    }
    return result.output;
  },
};

import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/debt-payoff-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "extra": {
    "key": "extra",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "debt_payoff_calculator",
  description: "Calculate the payoff timeline and total interest for a debt given balance, APR, and monthly payment.",
  inputSchema: {
    "type": "object",
    "properties": {
      "extra": {
        "type": "number",
        "description": "extra"
      }
    },
    "required": [
      "extra"
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
      action: "addDebt",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/debt-payoff-calculator/`;
    }
    return result.output;
  },
};

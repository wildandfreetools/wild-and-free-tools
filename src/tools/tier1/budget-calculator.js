import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/budget-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "income": {
    "key": "income",
    "isCheckbox": false,
    "isNumber": true
  },
  "needs-pct": {
    "key": "needs_pct",
    "isCheckbox": false,
    "isNumber": true
  },
  "wants-pct": {
    "key": "wants_pct",
    "isCheckbox": false,
    "isNumber": true
  },
  "savings-pct": {
    "key": "savings_pct",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "budget_calculator",
  description: "Run the budget calculator tool. calculator category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "income": {
        "type": "number",
        "description": "income"
      },
      "needs_pct": {
        "type": "number",
        "description": "needs_pct"
      },
      "wants_pct": {
        "type": "number",
        "description": "wants_pct"
      },
      "savings_pct": {
        "type": "number",
        "description": "savings_pct"
      }
    },
    "required": [
      "income",
      "needs_pct",
      "wants_pct",
      "savings_pct"
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
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/budget-calculator/`;
    }
    return result.output;
  },
};

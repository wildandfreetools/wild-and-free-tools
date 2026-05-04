import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/age-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "dob": {
    "key": "dob",
    "isCheckbox": false,
    "isNumber": false
  },
  "age-on": {
    "key": "age_on",
    "isCheckbox": false,
    "isNumber": false
  }
};
const OUTPUTS = ["result"];

export default {
  name: "age_calculator",
  description: "Calculate age in years, months, and days from a date of birth, optionally as of a target date.",
  inputSchema: {
    "type": "object",
    "properties": {
      "dob": {
        "type": "string",
        "description": "dob"
      },
      "age_on": {
        "type": "string",
        "description": "age_on"
      }
    },
    "required": [
      "dob",
      "age_on"
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
      action: "calcAge",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/age-calculator/`;
    }
    return result.output;
  },
};

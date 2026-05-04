import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/email-validator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "emailInput": {
    "key": "emailInput",
    "isCheckbox": null,
    "isNumber": null
  }
};
const OUTPUTS = ["resultSection","healthScore"];

export default {
  name: "email_validator",
  description: "Run the email validator tool. data category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "emailInput": {
        "type": "string",
        "description": "john@example.com&#10;jane@gmail.com&#10;test@mailinator.com&#10;info@company.com&#10;bad-email@&#10;john@example.com"
      }
    },
    "required": [
      "emailInput"
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
      action: "validateEmails",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/data-tools/email-validator/`;
    }
    return result.output;
  },
};

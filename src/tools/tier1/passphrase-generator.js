import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/passphrase-generator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "capitalize": {
    "key": "capitalize",
    "isCheckbox": true,
    "isNumber": false
  },
  "addnum": {
    "key": "addnum",
    "isCheckbox": true,
    "isNumber": false
  },
  "addsym": {
    "key": "addsym",
    "isCheckbox": true,
    "isNumber": false
  }
};
const OUTPUTS = ["output"];

export default {
  name: "passphrase_generator",
  description: "Run the passphrase generator tool. generator category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "capitalize": {
        "type": "boolean",
        "description": "Capitalize first letter of each word",
        "default": false
      },
      "addnum": {
        "type": "boolean",
        "description": "Add a random number",
        "default": false
      },
      "addsym": {
        "type": "boolean",
        "description": "Add a random symbol (!@#$%)",
        "default": false
      }
    },
    "required": []
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
      action: "generate",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/generator-tools/passphrase-generator/`;
    }
    return result.output;
  },
};

import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/spacing-checker.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "fontSize": {
    "key": "fontSize",
    "isCheckbox": false,
    "isNumber": true
  },
  "lineHeight": {
    "key": "lineHeight",
    "isCheckbox": false,
    "isNumber": true
  },
  "letterSpacing": {
    "key": "letterSpacing",
    "isCheckbox": false,
    "isNumber": true
  },
  "wordSpacing": {
    "key": "wordSpacing",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["wcagResults","fontResults","codeOutput"];

export default {
  name: "spacing_checker",
  description: "Detect double spaces, leading and trailing whitespace, and inconsistent spacing patterns in text.",
  inputSchema: {
    "type": "object",
    "properties": {
      "fontSize": {
        "type": "number",
        "description": "Font Size"
      },
      "lineHeight": {
        "type": "number",
        "description": "Line Height"
      },
      "letterSpacing": {
        "type": "number",
        "description": "Letter Spacing"
      },
      "wordSpacing": {
        "type": "number",
        "description": "Word Spacing"
      }
    },
    "required": [
      "fontSize",
      "lineHeight",
      "letterSpacing",
      "wordSpacing"
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
      action: "fixAll",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/accessibility-tools/spacing-checker/`;
    }
    return result.output;
  },
};

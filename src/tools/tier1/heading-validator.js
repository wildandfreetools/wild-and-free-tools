import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/heading-validator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "htmlInput": {
    "key": "htmlInput",
    "isCheckbox": null,
    "isNumber": null
  }
};
const OUTPUTS = ["resultsPanel","scoreBanner","scoreIcon","scoreText"];

export default {
  name: "heading_validator",
  description: "Validate the heading hierarchy (h1 through h6) of an HTML document for accessibility and SEO best practices.",
  inputSchema: {
    "type": "object",
    "properties": {
      "htmlInput": {
        "type": "string",
        "description": "Paste HTML Source Code"
      }
    },
    "required": [
      "htmlInput"
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
      action: "analyzeHeadings",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/accessibility-tools/heading-validator/`;
    }
    return result.output;
  },
};

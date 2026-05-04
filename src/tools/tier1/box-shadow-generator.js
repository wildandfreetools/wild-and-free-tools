import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/box-shadow-generator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {};
const OUTPUTS = ["code-output"];

export default {
  name: "box_shadow_generator",
  description: "Generate CSS box-shadow values from offset, blur, spread, color, and inset settings.",
  inputSchema: {
    "type": "object",
    "properties": {},
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
      action: "copyCSS",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/developer-tools/box-shadow-generator/`;
    }
    return result.output;
  },
};

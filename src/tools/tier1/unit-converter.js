import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/unit-converter.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "input-val": {
    "key": "input_val",
    "isCheckbox": false,
    "isNumber": true
  },
  "from-unit": {
    "key": "from_unit",
    "isCheckbox": null,
    "isNumber": null
  },
  "to-unit": {
    "key": "to_unit",
    "isCheckbox": null,
    "isNumber": null
  }
};
const OUTPUTS = ["result-value","result-label"];

export default {
  name: "unit_converter",
  description: "Convert between units across length, weight, temperature, volume, area, time, and speed.",
  inputSchema: {
    "type": "object",
    "properties": {
      "input_val": {
        "type": "number",
        "description": "input_val"
      },
      "from_unit": {
        "type": "string",
        "description": "from_unit"
      },
      "to_unit": {
        "type": "string",
        "description": "to_unit"
      }
    },
    "required": [
      "input_val",
      "from_unit",
      "to_unit"
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
      action: "convert",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/converter-tools/unit-converter/`;
    }
    return result.output;
  },
};

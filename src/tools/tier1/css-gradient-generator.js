import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/css-gradient-generator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "angle": {
    "key": "angle",
    "isCheckbox": false,
    "isNumber": false
  },
  "radial-shape": {
    "key": "radial_shape",
    "isCheckbox": null,
    "isNumber": null
  },
  "radial-position": {
    "key": "radial_position",
    "isCheckbox": null,
    "isNumber": null
  },
  "conic-angle": {
    "key": "conic_angle",
    "isCheckbox": false,
    "isNumber": false
  }
};
const OUTPUTS = ["code-output"];

export default {
  name: "css_gradient_generator",
  description: "Generate CSS linear or radial gradient code from color stops and direction.",
  inputSchema: {
    "type": "object",
    "properties": {
      "angle": {
        "type": "string",
        "description": "angle"
      },
      "radial_shape": {
        "type": "string",
        "enum": [
          "circle",
          "ellipse"
        ],
        "description": "radial_shape",
        "default": "circle"
      },
      "radial_position": {
        "type": "string",
        "enum": [
          "center",
          "top",
          "bottom",
          "left",
          "right"
        ],
        "description": "radial_position",
        "default": "center"
      },
      "conic_angle": {
        "type": "string",
        "description": "conic_angle"
      }
    },
    "required": [
      "angle",
      "conic_angle"
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
      action: "copyCSS",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/developer-tools/css-gradient-generator/`;
    }
    return result.output;
  },
};

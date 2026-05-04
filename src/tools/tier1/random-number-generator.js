import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/random-number-generator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "rng-min": {
    "key": "rng_min",
    "isCheckbox": false,
    "isNumber": true
  },
  "rng-max": {
    "key": "rng_max",
    "isCheckbox": false,
    "isNumber": true
  },
  "rng-count": {
    "key": "rng_count",
    "isCheckbox": false,
    "isNumber": true
  },
  "rng-unique": {
    "key": "rng_unique",
    "isCheckbox": true,
    "isNumber": false
  }
};
const OUTPUTS = ["result"];

export default {
  name: "random_number_generator",
  description: "Generate one or more random integers within a configurable minimum and maximum range.",
  inputSchema: {
    "type": "object",
    "properties": {
      "rng_min": {
        "type": "number",
        "description": "rng_min"
      },
      "rng_max": {
        "type": "number",
        "description": "rng_max"
      },
      "rng_count": {
        "type": "number",
        "description": "rng_count"
      },
      "rng_unique": {
        "type": "boolean",
        "description": "rng_unique",
        "default": false
      }
    },
    "required": [
      "rng_min",
      "rng_max",
      "rng_count"
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
      action: "genRandom",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/random-number-generator/`;
    }
    return result.output;
  },
};

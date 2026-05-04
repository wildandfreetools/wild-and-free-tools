import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/prompt-builder.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "role": {
    "key": "role",
    "isCheckbox": false,
    "isNumber": false
  },
  "task": {
    "key": "task",
    "isCheckbox": null,
    "isNumber": null
  },
  "context": {
    "key": "context",
    "isCheckbox": null,
    "isNumber": null
  },
  "formatCustom": {
    "key": "formatCustom",
    "isCheckbox": false,
    "isNumber": false
  },
  "constraints": {
    "key": "constraints",
    "isCheckbox": null,
    "isNumber": null
  },
  "examples": {
    "key": "examples",
    "isCheckbox": null,
    "isNumber": null
  }
};
const OUTPUTS = ["outputBox","outputBody"];

export default {
  name: "prompt_builder",
  description: "Assemble a structured LLM prompt from role, context, task, format, and constraint fields.",
  inputSchema: {
    "type": "object",
    "properties": {
      "role": {
        "type": "string",
        "description": "e.g., You are a senior copywriter with 10 years of experience in SaaS marketing"
      },
      "task": {
        "type": "string",
        "description": "e.g., Write a product launch email for our new feature that increases team collaboration"
      },
      "context": {
        "type": "string",
        "description": "e.g., Our product is a project management tool. The audience is engineering managers at mid-size companies. The feature allows real-time document editing."
      },
      "formatCustom": {
        "type": "string",
        "description": "Or type a custom format..."
      },
      "constraints": {
        "type": "string",
        "description": "e.g., Keep it under 200 words. Don"
      },
      "examples": {
        "type": "string",
        "description": "e.g., Good: "
      }
    },
    "required": [
      "role",
      "task",
      "context",
      "formatCustom",
      "constraints",
      "examples"
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
      action: "buildPrompt",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/ai-tools/prompt-builder/`;
    }
    return result.output;
  },
};

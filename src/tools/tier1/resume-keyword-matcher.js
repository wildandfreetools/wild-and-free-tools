import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/resume-keyword-matcher.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "jd": {
    "key": "jd",
    "isCheckbox": null,
    "isNumber": null
  },
  "resume": {
    "key": "resume",
    "isCheckbox": null,
    "isNumber": null
  }
};
const OUTPUTS = ["result"];

export default {
  name: "resume_keyword_matcher",
  description: "Run the resume keyword matcher tool. career category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "jd": {
        "type": "string",
        "description": "Paste the job description here..."
      },
      "resume": {
        "type": "string",
        "description": "Paste your resume text here..."
      }
    },
    "required": [
      "jd",
      "resume"
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
      action: "analyze",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/career-tools/resume-keyword-matcher/`;
    }
    return result.output;
  },
};

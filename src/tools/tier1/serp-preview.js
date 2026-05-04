import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/serp-preview.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "pageTitle": {
    "key": "pageTitle",
    "isCheckbox": false,
    "isNumber": false
  },
  "metaDesc": {
    "key": "metaDesc",
    "isCheckbox": null,
    "isNumber": null
  },
  "pageUrl": {
    "key": "pageUrl",
    "isCheckbox": false,
    "isNumber": false
  },
  "siteName": {
    "key": "siteName",
    "isCheckbox": false,
    "isNumber": false
  },
  "pubDate": {
    "key": "pubDate",
    "isCheckbox": false,
    "isNumber": false
  },
  "breadcrumbPath": {
    "key": "breadcrumbPath",
    "isCheckbox": false,
    "isNumber": false
  },
  "faviconFile": {
    "key": "faviconFile",
    "isCheckbox": false,
    "isNumber": false
  }
};
const OUTPUTS = ["scorePanel","scoreBadge","scoreItems","codeOutput"];

export default {
  name: "serp_preview",
  description: "Run the serp preview tool. seo category.",
  inputSchema: {
    "type": "object",
    "properties": {
      "pageTitle": {
        "type": "string",
        "description": "Page Title"
      },
      "metaDesc": {
        "type": "string",
        "description": "Meta Description"
      },
      "pageUrl": {
        "type": "string",
        "description": "Page URL"
      },
      "siteName": {
        "type": "string",
        "description": "Site Name"
      },
      "pubDate": {
        "type": "string",
        "description": "Published Date"
      },
      "breadcrumbPath": {
        "type": "string",
        "description": "Breadcrumb Path"
      },
      "faviconFile": {
        "type": "string",
        "description": "Upload favicon"
      }
    },
    "required": [
      "pageTitle",
      "metaDesc",
      "pageUrl",
      "siteName",
      "pubDate",
      "breadcrumbPath",
      "faviconFile"
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
      action: "checkSeoScore",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/seo-tools/serp-preview/`;
    }
    return result.output;
  },
};

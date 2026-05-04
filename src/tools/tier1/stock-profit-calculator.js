import { runToolSandbox } from "../../runtime/sandbox.js";
import { script } from "../../runtime/tier1-scripts/stock-profit-calculator.js";
import { SITE_BASE } from "../../config.js";

const INPUT_MAP = {
  "buy": {
    "key": "buy",
    "isCheckbox": false,
    "isNumber": true
  },
  "sell": {
    "key": "sell",
    "isCheckbox": false,
    "isNumber": true
  },
  "shares": {
    "key": "shares",
    "isCheckbox": false,
    "isNumber": true
  },
  "buy-fee": {
    "key": "buy_fee",
    "isCheckbox": false,
    "isNumber": true
  },
  "sell-fee": {
    "key": "sell_fee",
    "isCheckbox": false,
    "isNumber": true
  }
};
const OUTPUTS = ["result"];

export default {
  name: "stock_profit_calculator",
  description: "Calculate profit and loss for a stock trade given buy price, sell price, share count, and commissions.",
  inputSchema: {
    "type": "object",
    "properties": {
      "buy": {
        "type": "number",
        "description": "buy"
      },
      "sell": {
        "type": "number",
        "description": "sell"
      },
      "shares": {
        "type": "number",
        "description": "shares"
      },
      "buy_fee": {
        "type": "number",
        "description": "buy_fee"
      },
      "sell_fee": {
        "type": "number",
        "description": "sell_fee"
      }
    },
    "required": [
      "buy",
      "sell",
      "shares",
      "buy_fee",
      "sell_fee"
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
      action: "calc",
      outputs: OUTPUTS,
      inputValues,
    });
    if (result.error) {
      return `Tool error: ${result.error}\n\nWeb version: ${SITE_BASE}/calculator-tools/stock-profit-calculator/`;
    }
    return result.output;
  },
};

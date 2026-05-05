function gcd(a, b) {
  a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

const NAMED_RATIOS = {
  "1:1": [1, 1],   "4:3": [4, 3],   "3:2": [3, 2],
  "16:9": [16, 9], "16:10": [16, 10], "21:9": [21, 9],
  "9:16": [9, 16], "4:5": [4, 5],   "2:3": [2, 3], "5:4": [5, 4],
};

export default {
  name: "aspect_ratio_calculator",
  description: "Calculate aspect ratios and target dimensions. Given any two of {width, height, ratio}, computes the third. Reports the simplified ratio (e.g. 1920x1080 → 16:9).",
  inputSchema: {
    type: "object",
    properties: {
      width: { type: "number", description: "Width in pixels (or any unit)" },
      height: { type: "number", description: "Height in pixels (or any unit)" },
      ratio: { type: "string", description: "Aspect ratio as 'W:H' (e.g. '16:9') or a named preset" },
    },
  },
  async run({ width, height, ratio }) {
    const hasW = typeof width === "number" && width > 0;
    const hasH = typeof height === "number" && height > 0;
    const hasR = typeof ratio === "string" && ratio.length > 0;

    let rW, rH;
    if (hasR) {
      const named = NAMED_RATIOS[ratio.toLowerCase()] || NAMED_RATIOS[ratio];
      if (named) [rW, rH] = named;
      else {
        const m = ratio.match(/^\s*(\d+(?:\.\d+)?)\s*[:x\/]\s*(\d+(?:\.\d+)?)\s*$/);
        if (!m) return `Could not parse ratio "${ratio}". Use 'W:H' format like '16:9'.`;
        rW = parseFloat(m[1]); rH = parseFloat(m[2]);
      }
    }

    if (hasW && hasH) {
      const d = gcd(width, height);
      const decimal = width / height;
      return {
        width, height,
        ratio: `${Math.round(width / d)}:${Math.round(height / d)}`,
        ratio_decimal: +decimal.toFixed(4),
      };
    }
    if (hasW && hasR) {
      const h = (width * rH) / rW;
      return { width, height: +h.toFixed(2), ratio: `${rW}:${rH}` };
    }
    if (hasH && hasR) {
      const w = (height * rW) / rH;
      return { width: +w.toFixed(2), height, ratio: `${rW}:${rH}` };
    }
    return "Provide any two of: width, height, ratio.";
  },
};

import { SITE_BASE } from "../../config.js";

function hexToRgb(hex) {
  const m = hex.replace("#", "").match(/^([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!m) return null;
  let v = m[1];
  if (v.length === 3) v = v.split("").map((c) => c + c).join("");
  return {
    r: parseInt(v.slice(0, 2), 16),
    g: parseInt(v.slice(2, 4), 16),
    b: parseInt(v.slice(4, 6), 16),
    a: v.length === 8 ? parseInt(v.slice(6, 8), 16) / 255 : 1,
  };
}

function rgbToHex({ r, g, b, a }) {
  const h = (n) => Math.round(Math.max(0, Math.min(255, n))).toString(16).padStart(2, "0");
  let out = "#" + h(r) + h(g) + h(b);
  if (a !== undefined && a !== 1) out += h(Math.round(a * 255));
  return out;
}

function rgbToHsl({ r, g, b }) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default {
  name: "color_converter",
  description: "Convert between color formats: HEX, RGB, RGBA, HSL. Accepts a HEX string or rgb()/hsl() expression as input.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Color value (e.g. #3b82f6, rgb(59,130,246))" },
    },
    required: ["input"],
  },
  async run({ input }) {
    const val = (input || "").trim();
    let rgb = null;
    if (val.startsWith("#")) {
      rgb = hexToRgb(val);
    } else if (/^rgba?\s*\(/i.test(val)) {
      const m = val.match(/rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/i);
      if (m) rgb = { r: +m[1], g: +m[2], b: +m[3], a: m[4] !== undefined ? +m[4] : 1 };
    } else if (/^[0-9a-f]{3,8}$/i.test(val)) {
      rgb = hexToRgb("#" + val);
    }
    if (!rgb) return `Could not parse color: ${val}`;
    const hsl = rgbToHsl(rgb);
    return {
      hex: rgbToHex(rgb),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      rgba: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      values: { r: rgb.r, g: rgb.g, b: rgb.b, a: rgb.a, h: hsl.h, s: hsl.s, l: hsl.l },
      webVersion: `${SITE_BASE}/color-tools/`,
    };
  },
};

// Shared sandbox runner for Tier 1 tools that wrap inline JS from web pages.
// Builds a minimal DOM mock, populates input elements with user-supplied values,
// runs the original page script, calls the named action function, then captures
// what was written to the output element(s) and returns it.

import vm from "node:vm";

function makeMockEl(initialValue, opts = {}) {
  const writes = [];
  const target = {
    _writes: writes,
    value: initialValue ?? "",
    checked: opts.checked ?? false,
    textContent: "",
    innerHTML: "",
    innerText: "",
    style: new Proxy({}, { set: (t, k, v) => { t[k] = v; return true; } }),
    classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
    addEventListener: () => {},
    removeEventListener: () => {},
    appendChild: () => {},
    setAttribute: () => {},
    getAttribute: () => null,
    children: [],
    childNodes: [],
    focus: () => {},
    blur: () => {},
    click: () => {},
    closest: () => null,
    dispatchEvent: () => true,
    parentNode: null,
    dataset: {},
    disabled: false,
  };
  target.querySelector = () => makeMockEl("");
  target.querySelectorAll = () => [];
  return new Proxy(target, {
    set(t, k, v) {
      if (["textContent", "innerText", "innerHTML", "value"].includes(k)) {
        writes.push({ key: k, value: v });
      }
      t[k] = v;
      return true;
    },
  });
}

function buildSandbox(inputValues, outputIds) {
  const elById = {};
  for (const [id, value] of Object.entries(inputValues)) {
    elById[id] = makeMockEl(value);
  }
  for (const id of outputIds) {
    elById[id] = makeMockEl("");
  }

  const sandbox = {
    document: {
      getElementById: (id) => {
        if (!elById[id]) elById[id] = makeMockEl("");
        return elById[id];
      },
      querySelector: () => makeMockEl(""),
      querySelectorAll: () => {
        const list = [];
        list.forEach = Array.prototype.forEach.bind(list);
        return list;
      },
      addEventListener: () => {},
      createElement: () => makeMockEl(""),
      body: makeMockEl(""),
      head: makeMockEl(""),
    },
    setInterval: () => 0,
    setTimeout: (fn, ms) => 0,
    clearInterval: () => {},
    clearTimeout: () => {},
    requestAnimationFrame: (fn) => { try { fn(0); } catch {} return 0; },
    cancelAnimationFrame: () => {},
    Math, JSON, console: { log: () => {}, error: () => {}, warn: () => {}, info: () => {} },
    URL, URLSearchParams,
    encodeURIComponent, decodeURIComponent, encodeURI, decodeURI,
    Promise, Array, Object, String, Number, Boolean, Date, RegExp, Error,
    Intl,
    parseInt, parseFloat, isNaN, isFinite,
    navigator: { clipboard: { writeText: async () => {} } },
    localStorage: {
      _data: {},
      getItem(k) { return this._data[k] ?? null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; },
    },
    sessionStorage: {
      _data: {},
      getItem(k) { return this._data[k] ?? null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; },
    },
    fetch: async () => ({ ok: false, status: 0, json: async () => ({}), text: async () => "" }),
    atob: (s) => Buffer.from(String(s), "base64").toString("binary"),
    btoa: (s) => Buffer.from(String(s), "binary").toString("base64"),
    crypto: {
      getRandomValues: (arr) => {
        for (let i = 0; i < arr.length; i++) {
          arr[i] = Math.floor(Math.random() * 256);
        }
        return arr;
      },
      randomUUID: () => {
        const bytes = new Uint8Array(16);
        for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
        bytes[6] = (bytes[6] & 0x0f) | 0x40;
        bytes[8] = (bytes[8] & 0x3f) | 0x80;
        const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
      },
    },
    TextEncoder, TextDecoder,
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.globalThis = sandbox;

  return { sandbox, elById };
}

/**
 * Run a Tier 1 tool's inline JS in a sandbox.
 *
 * @param {object} spec
 * @param {string} spec.script  Original inline script source.
 * @param {string} spec.action  Function name to invoke (e.g. "calculate", "convert").
 * @param {string[]} spec.outputs  Element IDs whose content represents the output.
 * @param {object<string,string>} spec.inputValues  Map of input element ID -> string value.
 * @returns {Promise<{output: string|object, error?: string}>}
 */
export async function runToolSandbox(spec) {
  const { script, action, outputs, inputValues = {} } = spec;
  const { sandbox, elById } = buildSandbox(inputValues, outputs);
  const ctx = vm.createContext(sandbox);

  try {
    vm.runInContext(script, ctx, { timeout: 5000 });
    const driver = `
      (async () => {
        try {
          if (typeof ${action} === 'function') {
            const r = ${action}();
            if (r && typeof r.then === 'function') await r;
          }
        } catch (e) {}
      })();
    `;
    vm.runInContext(driver, ctx, { timeout: 5000 });
    for (let i = 0; i < 10; i++) {
      await new Promise((r) => setImmediate(r));
    }
  } catch (e) {
    return { error: `sandbox error: ${e.message}` };
  }

  // Collect outputs in order. Prefer textContent, then innerHTML, then value.
  const outputs_collected = [];
  for (const id of outputs) {
    const el = elById[id];
    if (!el) continue;
    const writes = el._writes || [];
    let captured = "";
    // Last write wins per key
    const last = {};
    for (const w of writes) last[w.key] = w.value;
    captured = last.textContent ?? last.innerHTML ?? last.value ?? el.textContent ?? el.value ?? "";
    if (typeof captured === "string" && captured.trim()) {
      outputs_collected.push({ id, value: stripHtml(captured) });
    }
  }

  if (!outputs_collected.length) {
    return { error: "no output produced" };
  }

  if (outputs_collected.length === 1) {
    return { output: outputs_collected[0].value };
  }
  const result = {};
  for (const o of outputs_collected) result[o.id] = o.value;
  return { output: result };
}

function stripHtml(s) {
  return String(s).replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

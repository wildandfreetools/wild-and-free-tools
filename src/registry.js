import { readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOOLS_ROOT = join(__dirname, "tools");

export async function loadRegistry() {
  const tools = new Map();
  const tiers = ["tier1", "tier2", "tier3"];

  for (const tier of tiers) {
    const tierDir = join(TOOLS_ROOT, tier);
    let entries;
    try {
      entries = await readdir(tierDir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      if (!entry.isFile() || !entry.name.endsWith(".js")) continue;
      const url = pathToFileURL(join(tierDir, entry.name)).href;
      const mod = await import(url);
      if (!mod.default || !mod.default.name) continue;
      tools.set(mod.default.name, mod.default);
    }
  }

  return {
    list: () => [...tools.values()],
    get: (name) => tools.get(name),
    size: () => tools.size,
  };
}

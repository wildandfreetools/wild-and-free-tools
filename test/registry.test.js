import { test } from "node:test";
import { strict as assert } from "node:assert";
import { loadRegistry } from "../src/registry.js";

test("registry loads tools from all tier folders", async () => {
  const reg = await loadRegistry();
  const tools = reg.list();
  assert.ok(tools.length >= 5, `expected at least 5 tools, got ${tools.length}`);
  const names = tools.map((t) => t.name);
  assert.ok(names.includes("json_formatter"), "json_formatter should be registered");
  assert.ok(names.includes("email_writer"), "email_writer should be registered");
  assert.ok(names.includes("youtube_video_info"), "youtube_video_info should be registered");
});

test("json_formatter formats valid JSON", async () => {
  const reg = await loadRegistry();
  const tool = reg.get("json_formatter");
  const result = await tool.run({ input: '{"a":1,"b":2}', mode: "format" });
  assert.equal(result, '{\n  "a": 1,\n  "b": 2\n}');
});

test("json_formatter minifies", async () => {
  const reg = await loadRegistry();
  const tool = reg.get("json_formatter");
  const result = await tool.run({ input: '{ "a": 1, "b": 2 }', mode: "minify" });
  assert.equal(result, '{"a":1,"b":2}');
});

test("base64_encoder encodes and decodes", async () => {
  const reg = await loadRegistry();
  const tool = reg.get("base64_encoder");
  const encoded = await tool.run({ input: "hello world", mode: "encode" });
  assert.equal(encoded, "aGVsbG8gd29ybGQ=");
  const decoded = await tool.run({ input: "aGVsbG8gd29ybGQ=", mode: "decode" });
  assert.equal(decoded, "hello world");
});

test("hash_generator produces sha256", async () => {
  const reg = await loadRegistry();
  const tool = reg.get("hash_generator");
  const result = await tool.run({ input: "hello", algorithm: "sha256" });
  assert.equal(result.digest, "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
});

test("word_counter counts correctly", async () => {
  const reg = await loadRegistry();
  const tool = reg.get("word_counter");
  const result = await tool.run({ input: "Hello world. How are you today?" });
  assert.equal(result.words, 6);
  assert.equal(result.sentences, 2);
});

test("url_encoder round-trips", async () => {
  const reg = await loadRegistry();
  const tool = reg.get("url_encoder");
  const encoded = await tool.run({ input: "hello world & friends", mode: "encode" });
  const decoded = await tool.run({ input: encoded, mode: "decode" });
  assert.equal(decoded, "hello world & friends");
});

test("email_writer returns prompt with situation and tone", async () => {
  const reg = await loadRegistry();
  const tool = reg.get("email_writer");
  const result = await tool.run({ situation: "follow up with prospect", tone: "friendly" });
  assert.match(result, /friendly/);
  assert.match(result, /follow up with prospect/);
  assert.match(result, /Subject:/);
});

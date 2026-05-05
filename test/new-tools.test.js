import { test } from "node:test";
import { strict as assert } from "node:assert";
import { loadRegistry } from "../src/registry.js";

const reg = await loadRegistry();
const get = (name) => {
  const t = reg.get(name);
  if (!t) throw new Error(`tool ${name} not registered`);
  return t;
};

test("csv_to_json parses with header", async () => {
  const result = await get("csv_to_json").run({
    input: "name,age\nAlice,30\nBob,25",
  });
  assert.deepEqual(result, [
    { name: "Alice", age: "30" },
    { name: "Bob", age: "25" },
  ]);
});

test("csv_to_json handles quoted fields with commas", async () => {
  const result = await get("csv_to_json").run({
    input: 'name,bio\nAlice,"hello, world"\nBob,"line1\nline2"',
  });
  assert.equal(result[0].bio, "hello, world");
  assert.equal(result[1].bio, "line1\nline2");
});

test("json_to_csv round-trips with csv_to_json", async () => {
  const data = [{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }];
  const csv = await get("json_to_csv").run({ input: JSON.stringify(data) });
  const back = await get("csv_to_json").run({ input: csv });
  assert.equal(back[0].name, "Alice");
  assert.equal(back[1].age, "25");
});

test("json_to_csv unions keys across rows", async () => {
  const csv = await get("json_to_csv").run({
    input: JSON.stringify([{ a: 1, b: 2 }, { b: 3, c: 4 }]),
  });
  const lines = csv.split("\n");
  assert.equal(lines[0], "a,b,c");
  assert.equal(lines[1], "1,2,");
  assert.equal(lines[2], ",3,4");
});

test("xml_to_json parses simple element with attribute", async () => {
  const result = await get("xml_to_json").run({
    input: '<book id="42"><title>Hello</title><author>KJ</author></book>',
  });
  assert.equal(result.book["@id"], "42");
  assert.equal(result.book.title["#text"], "Hello");
  assert.equal(result.book.author["#text"], "KJ");
});

test("xml_to_json groups repeated children into arrays", async () => {
  const result = await get("xml_to_json").run({
    input: "<list><item>a</item><item>b</item><item>c</item></list>",
  });
  assert.ok(Array.isArray(result.list.item));
  assert.equal(result.list.item.length, 3);
});

test("jwt_decoder decodes header and payload", async () => {
  // header={"alg":"HS256","typ":"JWT"} payload={"sub":"1234","name":"KJ","iat":1516239022}
  const jwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJzdWIiOiIxMjM0IiwibmFtZSI6IktKIiwiaWF0IjoxNTE2MjM5MDIyfQ." +
    "fakesig";
  const result = await get("jwt_decoder").run({ input: jwt });
  assert.equal(result.header.alg, "HS256");
  assert.equal(result.payload.sub, "1234");
  assert.equal(result.payload.name, "KJ");
  assert.equal(result.algorithm, "HS256");
  assert.equal(result.verified, false);
});

test("jwt_decoder rejects malformed token", async () => {
  const result = await get("jwt_decoder").run({ input: "not.a.jwt.token" });
  assert.match(String(result), /Invalid JWT/);
});

test("html_entities encodes and decodes", async () => {
  const enc = await get("html_entities").run({ input: '<div class="x">A & B</div>', mode: "encode" });
  assert.match(enc, /&lt;div/);
  assert.match(enc, /&amp; B/);
  const dec = await get("html_entities").run({ input: enc, mode: "decode" });
  assert.equal(dec, '<div class="x">A & B</div>');
});

test("csv_deduplicator removes full-row duplicates", async () => {
  const out = await get("csv_deduplicator").run({
    input: "id,name\n1,Alice\n2,Bob\n1,Alice\n3,Carol",
  });
  assert.match(out, /Removed 1 duplicate/);
  assert.equal(out.split("\n").filter((l) => l && !l.startsWith("#")).length, 4); // header + 3 rows
});

test("csv_deduplicator dedupes by key column", async () => {
  const out = await get("csv_deduplicator").run({
    input: "id,name\n1,Alice\n2,Bob\n1,AliceDifferent",
    key_column: "id",
  });
  assert.match(out, /Removed 1 duplicate/);
});

test("csv_row_filter equals operator", async () => {
  const out = await get("csv_row_filter").run({
    input: "id,status\n1,active\n2,inactive\n3,active",
    column: "status",
    operator: "equals",
    value: "active",
  });
  assert.match(out, /Kept 2 of 3/);
});

test("csv_row_filter regex operator", async () => {
  const out = await get("csv_row_filter").run({
    input: "id,email\n1,a@example.com\n2,b@test.org\n3,c@example.com",
    column: "email",
    operator: "regex",
    value: "@example\\.com$",
  });
  assert.match(out, /Kept 2 of 3/);
});

test("csv_sanitizer trims and removes empty rows", async () => {
  const out = await get("csv_sanitizer").run({
    input: "name, age \n Alice ,30\n,\nBob,25",
  });
  assert.match(out, /removed 1 empty/);
  assert.match(out, /^name,age/);
});

test("csv_column_mapper renames columns", async () => {
  const out = await get("csv_column_mapper").run({
    input: "old_email,old_name,extra\na@b.com,Alice,X\nc@d.com,Bob,Y",
    mapping: JSON.stringify({ old_email: "email", old_name: "name" }),
  });
  const lines = out.split("\n");
  assert.equal(lines[0], "email,name");
  assert.equal(lines[1], "a@b.com,Alice");
});

test("csv_column_mapper keep_unmapped retains extra columns", async () => {
  const out = await get("csv_column_mapper").run({
    input: "old_email,extra\na@b.com,X",
    mapping: JSON.stringify({ old_email: "email" }),
    keep_unmapped: true,
  });
  assert.equal(out.split("\n")[0], "email,extra");
});

test("domain_extractor pulls domains from urls and emails", async () => {
  const result = await get("domain_extractor").run({
    input: "Check out https://example.com/foo and email me at kj@beargrips.com or visit http://shops.beargrips.com.",
  });
  assert.ok(result.domains.includes("example.com"));
  assert.ok(result.domains.includes("beargrips.com"));
  assert.ok(result.domains.includes("shops.beargrips.com"));
});

test("lead_list_cleaner removes duplicates and flags disposable", async () => {
  const result = await get("lead_list_cleaner").run({
    input: "alice@beargrips.com, alice@beargrips.com\nbob@mailinator.com\nnot-an-email\ninfo@acme.com",
    drop_disposable: true,
  });
  assert.equal(result.cleaned_count, 2); // alice + info (bob disposable, not-an-email invalid)
  assert.ok(result.disposable.includes("bob@mailinator.com"));
  assert.ok(result.invalid.includes("not-an-email"));
});

test("lead_list_cleaner can drop role accounts", async () => {
  const result = await get("lead_list_cleaner").run({
    input: "alice@acme.com\nsupport@acme.com\nsales@acme.com",
    drop_role: true,
  });
  assert.equal(result.cleaned_count, 1);
  assert.equal(result.role_based.length, 2);
});

test("aspect_ratio_calculator simplifies width x height", async () => {
  const result = await get("aspect_ratio_calculator").run({ width: 1920, height: 1080 });
  assert.equal(result.ratio, "16:9");
});

test("aspect_ratio_calculator computes height from width and ratio", async () => {
  const result = await get("aspect_ratio_calculator").run({ width: 1280, ratio: "16:9" });
  assert.equal(result.height, 720);
});

test("aspect_ratio_calculator computes width from height and ratio", async () => {
  const result = await get("aspect_ratio_calculator").run({ height: 1080, ratio: "21:9" });
  assert.equal(result.width, 2520);
});

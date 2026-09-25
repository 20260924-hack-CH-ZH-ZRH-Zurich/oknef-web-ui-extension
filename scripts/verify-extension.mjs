import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../dist/unpacked");
const manifest = JSON.parse(
  await readFile(resolve(root, "manifest.json"), "utf8"),
);
assert.equal(manifest.manifest_version, 3);
assert.deepEqual(manifest.permissions, ["activeTab"]);
for (const key of [
  "host_permissions",
  "optional_host_permissions",
  "content_scripts",
  "externally_connectable",
  "update_url",
  "background",
])
  assert.equal(manifest[key], undefined, key);
const csp = manifest.content_security_policy.extension_pages;
assert.match(csp, /script-src 'self'/);
assert.match(csp, /connect-src 'none'/);
assert.doesNotMatch(csp, /unsafe-|https?:|\*/);
const files = await readdir(root, { recursive: true });
assert.ok(files.includes("popup.js"));
assert.ok(files.includes("popup.css"));
for (const name of files) {
  assert.doesNotMatch(name, /\.map$|(^|\/)\.env/);
  if (!/\.(js|html)$/.test(name)) continue;
  const source = await readFile(resolve(root, name), "utf8");
  assert.doesNotMatch(
    source,
    /\beval\s*\(|new\s+Function\s*\(|<script[^>]+src=["']https?:/,
  );
  if (name.endsWith(".html"))
    assert.doesNotMatch(source, /<script(?![^>]+src=)|\son\w+=|\sstyle=/);
}
console.info(
  "Verified MV3, activeTab-only access, strict CSP, packaged code, and no source maps or environment files.",
);

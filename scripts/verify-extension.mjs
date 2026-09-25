import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseAppOrigin } from "../src/lib/config.ts";

const root = resolve(import.meta.dirname, "../dist/unpacked");
const manifest = JSON.parse(
  await readFile(resolve(root, "manifest.json"), "utf8"),
);
assert.equal(manifest.manifest_version, 3);
assert.deepEqual(manifest.permissions, ["activeTab"]);
for (const key of [
  "optional_host_permissions",
  "content_scripts",
  "externally_connectable",
  "update_url",
  "background",
])
  assert.equal(manifest[key], undefined, key);
const csp = manifest.content_security_policy.extension_pages;
const origin = parseAppOrigin(process.env.NEXT_PUBLIC_OKNEF_APP_ORIGIN);
assert.deepEqual(manifest.host_permissions, origin ? [`${origin}/*`] : []);
const id = Array.from(
  createHash("sha256")
    .update(Buffer.from(manifest.key, "base64"))
    .digest()
    .subarray(0, 16),
)
  .map((value) => String.fromCharCode(97 + (value >> 4), 97 + (value & 15)))
  .join("");
const identity = JSON.parse(
  await readFile(resolve(root, "../../extension-identity.json"), "utf8"),
);
assert.equal(id, identity.id);
assert.match(csp, /script-src 'self'/);
assert.ok(
  csp.includes(
    origin
      ? `connect-src ${origin} ${origin.replace(/^https:/, "wss:")}`
      : "connect-src 'none'",
  ),
);
assert.doesNotMatch(csp, /unsafe-|\*/);
const files = await readdir(root, { recursive: true });
assert.ok(files.includes("popup.js"));
assert.ok(files.includes("popup.css"));
for (const file of ["workspace.js", "workspace.css", "workspace.html"])
  assert.ok(files.includes(file), file);
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
  "Verified MV3, stable extension identity, exact host permission, strict CSP, packaged workspace and no source maps or environment files.",
);

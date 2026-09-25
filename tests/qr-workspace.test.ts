import assert from "node:assert/strict";
import { test } from "node:test";
import { decodePixels } from "../src/lib/models/qr";
import { WORKSPACE_VIEWS, workspaceUrl } from "../src/lib/models/workspace";
import { LOCALES } from "../src/lib/translations";
import { workspaceCopy } from "../src/lib/workspaceCopy";
import fixture from "./fixtures/qr.json";

test("packaged QR decoder reads actual synthetic QR pixels", () => {
  const scale = 6,
    margin = 4,
    size = (fixture.rows.length + margin * 2) * scale;
  const pixels = new Uint8ClampedArray(size * size * 4).fill(255);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      if (
        fixture.rows[Math.floor(y / scale) - margin]?.[
          Math.floor(x / scale) - margin
        ] !== "1"
      )
        continue;
      const offset = (y * size + x) * 4;
      pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = 0;
    }
  assert.equal(decodePixels(pixels, size, size), fixture.value);
});

test("QR decoder rejects malformed or excessive buffers before decoding", () => {
  for (const [width, height, length] of [
    [0, 1, 0],
    [1, 1, 3],
    [2001, 2000, 4],
    [1.5, 1, 6],
  ]) {
    assert.throws(() =>
      decodePixels(new Uint8ClampedArray(length), width, height),
    );
  }
  assert.equal(
    decodePixels(new Uint8ClampedArray(16 * 16 * 4).fill(255), 16, 16),
    null,
  );
});

test("workspace navigation keeps only the configured HTTPS origin and approved views", () => {
  assert.equal(
    workspaceUrl("https://example.com", "de", "drive"),
    "https://example.com/de/workspace?view=drive",
  );
  for (const origin of [
    "http://example.com",
    "https://user@example.com",
    "https://example.com/?token=private",
    "https://example.com/path",
  ]) {
    assert.throws(() => workspaceUrl(origin, "en", "drive"));
  }
  for (const locale of LOCALES)
    for (const view of WORKSPACE_VIEWS) {
      const url = new URL(workspaceUrl("https://example.com", locale, view));
      assert.equal(url.origin, "https://example.com");
      assert.equal(url.searchParams.size, 1);
      assert.ok(workspaceCopy[locale].views[view]);
    }
});

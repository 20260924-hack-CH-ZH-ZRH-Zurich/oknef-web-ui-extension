import assert from "node:assert/strict";
import { test } from "node:test";
import { workspaceFetch } from "../src/extension/network";
import { config } from "../src/lib/config";

test("workspace network adapter only reaches configured API routes with cookie auth", async () => {
  const previous = config.appOrigin;
  const previousFetch = globalThis.fetch;
  config.appOrigin = "https://workspace.example";
  const calls: { url: string; options?: RequestInit }[] = [];
  globalThis.fetch = (async (url, options) => {
    calls.push({ url: String(url), options });
    return Response.json({ ok: true });
  }) as typeof fetch;
  try {
    await workspaceFetch("/api/voice/call", {
      method: "POST",
      body: "v=0",
      headers: { "Content-Type": "application/sdp" },
    });
    assert.equal(calls[0]?.url, "https://workspace.example/api/voice/call");
    assert.equal(calls[0]?.options?.credentials, "include");
    assert.equal(calls[0]?.options?.redirect, "error");
    for (const path of [
      "https://evil.example/api/auth/me",
      "//evil.example/api",
      "/api/../../other",
      "/api/auth/me?token=x",
      "/api/\\evil",
    ])
      assert.throws(() => workspaceFetch(path));
    assert.equal(calls.length, 1);
    config.appOrigin = null;
    assert.throws(() => workspaceFetch("/api/auth/me"));
  } finally {
    globalThis.fetch = previousFetch;
    config.appOrigin = previous;
  }
});

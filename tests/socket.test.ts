import assert from "node:assert/strict";
import { test } from "node:test";
import { WorkspaceSocket } from "../src/extension/socket";
import { config } from "../src/lib/config";

test("closing during ticket acquisition cannot create a late websocket", async () => {
  const previous = config.appOrigin;
  const previousFetch = globalThis.fetch;
  const previousSocket = globalThis.WebSocket;
  config.appOrigin = "https://workspace.example";
  let resolveTicket: ((value: Response) => void) | undefined;
  let opened = 0;
  globalThis.fetch = (() =>
    new Promise<Response>((resolve) => {
      resolveTicket = resolve;
    })) as typeof fetch;
  globalThis.WebSocket = class {
    constructor() {
      opened++;
    }
  } as unknown as typeof WebSocket;
  try {
    assert.throws(
      () => new WorkspaceSocket(new URL("wss://evil.example/api/ws")),
    );
    const socket = new WorkspaceSocket(
      new URL("wss://workspace.example/api/ws"),
    );
    let closed = 0;
    socket.onclose = () => {
      closed++;
    };
    socket.close();
    socket.close();
    resolveTicket?.(Response.json({ ticket: "a".repeat(43) }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(opened, 0);
    assert.equal(closed, 1);
  } finally {
    config.appOrigin = previous;
    globalThis.fetch = previousFetch;
    globalThis.WebSocket = previousSocket;
  }
});

import { workspaceApiOrigin, workspaceFetch } from "./network";

// A short-lived single-use ticket bridges Chrome's websocket cookie boundary.
// It stays in memory and is sent in the handshake, never a URL or persistent store.
export class WorkspaceSocket {
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  private socket: globalThis.WebSocket | null = null;
  private closed = false;
  private abort = new AbortController();
  constructor(url: URL) {
    const expected = new URL("/api/ws", workspaceApiOrigin());
    expected.protocol = "wss:";
    if (url.href !== expected.href) throw new Error("invalid_socket_route");
    void this.connect(url);
  }
  private async connect(url: URL) {
    try {
      const response = await workspaceFetch("/api/extension/socket-ticket", {
        method: "POST",
        signal: this.abort.signal,
      });
      if (!response.ok) throw new Error("socket_ticket_failed");
      const result: unknown = await response.json();
      if (this.closed) return;
      if (
        !result ||
        typeof result !== "object" ||
        !("ticket" in result) ||
        typeof result.ticket !== "string" ||
        !/^[A-Za-z0-9_-]{43}$/.test(result.ticket)
      )
        throw new Error("invalid_socket_ticket");
      const socket = new globalThis.WebSocket(url, [
        "oknef.v1",
        `oknef-ticket.${result.ticket}`,
      ]);
      this.socket = socket;
      socket.onopen = (event) => {
        if (!this.closed) this.onopen?.(event);
      };
      socket.onmessage = (event) => {
        if (!this.closed) this.onmessage?.(event);
      };
      socket.onclose = (event) => {
        if (this.closed) return;
        this.closed = true;
        this.onclose?.(event);
      };
      socket.onerror = (event) => {
        if (!this.closed) this.onerror?.(event);
      };
    } catch {
      if (this.closed) return;
      this.onerror?.(new Event("error"));
      this.close();
    }
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    this.abort.abort();
    this.socket?.close();
    this.onclose?.(new Event("close"));
  }
}

import { MAX_INPUT_LENGTH } from "./models/inspection";

type BrowserApi = {
  tabs?: {
    create?: (options: { url: string }) => Promise<unknown>;
    query: (query: {
      active: boolean;
      currentWindow: boolean;
    }) => Promise<{ url?: string }[]>;
  };
  runtime?: { getURL: (path: string) => string };
};

function browserApi(): BrowserApi | undefined {
  return (globalThis as typeof globalThis & { chrome?: BrowserApi }).chrome;
}

export function canReadActiveTab(): boolean {
  return Boolean(browserApi()?.tabs?.query);
}

export function canExpandExtension(): boolean {
  return Boolean(browserApi()?.runtime?.getURL && browserApi()?.tabs?.create);
}

export async function expandExtension(): Promise<void> {
  const api = browserApi();
  if (api?.runtime && api.tabs?.create)
    await api.tabs.create({ url: api.runtime.getURL("popup.html?app=qr") });
}

export async function readActiveTabUrl(): Promise<string> {
  const tabs = await browserApi()?.tabs?.query({
    active: true,
    currentWindow: true,
  });
  const url = tabs?.[0]?.url;
  if (!url || url.length > MAX_INPUT_LENGTH) throw new Error("tab_unavailable");
  return url;
}

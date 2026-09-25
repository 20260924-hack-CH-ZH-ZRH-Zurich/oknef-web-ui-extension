import { parseAppOrigin } from "../config";
import type { Locale } from "../translations";

export const WORKSPACE_VIEWS = [
  "drive",
  "connections",
  "miniapps",
  "integrations",
  "identities",
  "sessions",
  "security",
  "succession",
  "approvals",
  "assistant",
  "admin",
] as const;
export type WorkspaceView = (typeof WORKSPACE_VIEWS)[number];

export function workspaceUrl(
  origin: string,
  locale: Locale,
  view: WorkspaceView,
): string {
  const trusted = parseAppOrigin(origin);
  if (!trusted || !WORKSPACE_VIEWS.includes(view))
    throw new Error("invalid_workspace");
  const url = new URL(`/${locale}/workspace`, trusted);
  url.searchParams.set("view", view);
  return url.href;
}

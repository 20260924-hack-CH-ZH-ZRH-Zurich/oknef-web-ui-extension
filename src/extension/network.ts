import { config } from "@/lib/config";

export function workspaceApiOrigin() {
  if (!config.appOrigin) throw new Error("workspace_origin_missing");
  return config.appOrigin;
}
export function workspaceFetch(path: string, options: RequestInit = {}) {
  if (
    !path.startsWith("/api/") ||
    path.includes("#") ||
    path.includes("?") ||
    path.includes("\\")
  )
    throw new Error("invalid_api_route");
  const destination = new URL(path, workspaceApiOrigin());
  if (
    destination.origin !== workspaceApiOrigin() ||
    !destination.pathname.startsWith("/api/")
  )
    throw new Error("invalid_api_route");
  return fetch(destination, {
    ...options,
    credentials: "include",
    redirect: "error",
    cache: "no-store",
  });
}

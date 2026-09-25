import {
  type AnchorHTMLAttributes,
  type ImgHTMLAttributes,
  useSyncExternalStore,
} from "react";

const change = "oknef-extension-route";
export function workspaceLocation() {
  const route = window.location.hash.slice(1);
  return new URL(
    route.startsWith("/") ? route : "/en/workspace",
    "https://extension.invalid",
  );
}
export function workspaceNavigate(path: string, replace = false) {
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error("invalid_route");
  const target = `${window.location.pathname}#${path}`;
  if (replace) window.history.replaceState(null, "", target);
  else window.history.pushState(null, "", target);
  window.dispatchEvent(new Event(change));
}
function subscribe(callback: () => void) {
  window.addEventListener(change, callback);
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener(change, callback);
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}
const router = {
  push: (path: string) => workspaceNavigate(path),
  replace: (path: string) => workspaceNavigate(path, true),
  refresh: () => window.dispatchEvent(new Event(change)),
};
export function useRouter() {
  return router;
}
export function usePathname() {
  return useSyncExternalStore(
    subscribe,
    () => workspaceLocation().pathname,
    () => "/en/workspace",
  );
}
export function useSearchParams() {
  const query = useSyncExternalStore(
    subscribe,
    () => workspaceLocation().search,
    () => "",
  );
  return new URLSearchParams(query);
}
export function WorkspaceLink({
  href = "/",
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const local = href.startsWith("/") && !href.startsWith("//");
  return (
    <a
      {...props}
      href={local ? `#${href}` : href}
      onClick={(event) => {
        onClick?.(event);
        if (
          local &&
          !event.defaultPrevented &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.shiftKey
        ) {
          event.preventDefault();
          workspaceNavigate(href);
        }
      }}
    />
  );
}
export function WorkspaceImage({
  unoptimized: _unoptimized,
  priority: _priority,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & {
  unoptimized?: boolean;
  priority?: boolean;
}) {
  // biome-ignore lint/performance/noImgElement: Assets are packaged locally; no Next image server exists in an extension.
  return <img {...props} alt={props.alt ?? ""} />;
}

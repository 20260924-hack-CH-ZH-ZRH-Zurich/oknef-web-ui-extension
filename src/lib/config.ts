export function parseAppOrigin(value: string | undefined): string | null {
  if (!value) return null;
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    url.pathname !== "/"
  )
    throw new Error(
      "NEXT_PUBLIC_OKNEF_APP_ORIGIN must be an HTTPS origin without credentials, path, query or fragment.",
    );
  return url.origin;
}

export const config = {
  appOrigin: parseAppOrigin(process.env.NEXT_PUBLIC_OKNEF_APP_ORIGIN),
};

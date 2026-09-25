import { execFileSync } from "node:child_process";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { parseAppOrigin } from "../src/lib/config.ts";
import { buildWorkspace } from "./build-workspace.mjs";

const root = resolve(import.meta.dirname, "..");
const out = resolve(root, "dist/unpacked");
const origin = parseAppOrigin(process.env.NEXT_PUBLIC_OKNEF_APP_ORIGIN);
const pkg = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const identity = JSON.parse(
  await readFile(resolve(root, "extension-identity.json"), "utf8"),
);
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const result = await Bun.build({
  entrypoints: [resolve(root, "src/extension/popup.tsx")],
  outdir: out,
  target: "browser",
  format: "esm",
  minify: true,
  sourcemap: "none",
  define: {
    "process.env.NODE_ENV": JSON.stringify("production"),
    "process.env.NEXT_PUBLIC_OKNEF_APP_ORIGIN": JSON.stringify(origin ?? ""),
  },
});
if (!result.success) throw new Error(result.logs.map(String).join("\n"));
await buildWorkspace(root, out, origin);
await cp(resolve(root, "src/extension/popup.html"), resolve(out, "popup.html"));
await cp(resolve(root, "public/icons"), resolve(out, "icons"), {
  recursive: true,
});
const manifest = {
  manifest_version: 3,
  name: "Oknef mini apps",
  version: pkg.version,
  key: identity.publicDer,
  description:
    "Oknef workspace, live mini apps, encrypted Drive, asset maps and conversations.",
  permissions: ["activeTab"],
  host_permissions: origin ? [`${origin}/*`] : [],
  action: {
    default_popup: "popup.html",
    default_title: "Oknef mini apps",
    default_icon: "icons/icon-128.png",
  },
  icons: {
    16: "icons/icon-16.png",
    32: "icons/icon-32.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
  },
  content_security_policy: {
    extension_pages: `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src ${origin ? `${origin} ${origin.replace(/^https:/, "wss:")}` : "'none'"}; frame-src https://player.vimeo.com; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
  },
};
await writeFile(
  resolve(out, "manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
const notices = [];
const seen = new Set();
const pending = Object.keys(pkg.dependencies);
while (pending.length) {
  const name = pending.pop();
  if (seen.has(name)) continue;
  seen.add(name);
  const directory = resolve(root, "node_modules", name);
  let dependency;
  try {
    dependency = JSON.parse(
      await readFile(resolve(directory, "package.json"), "utf8"),
    );
  } catch {
    continue; // Optional platform-specific dependencies may not be installed.
  }
  pending.push(...Object.keys(dependency.dependencies || {}));
  for (const file of (await readdir(directory)).filter((file) =>
    /^(license|licence|copying|notice)([.-]|$)/i.test(file),
  )) {
    const content = await readFile(resolve(directory, file), "utf8").catch(
      () => null,
    );
    if (content)
      notices.push(`${name}@${dependency.version} — ${file}\n\n${content}`);
  }
}
await writeFile(
  resolve(out, "LICENSES.txt"),
  `Installed dependency notices (includes build-only packages)\n\n${notices.join("\n\n")}`,
);
await rm(resolve(root, "dist/oknef-extension.zip"), { force: true });
execFileSync("zip", ["-q", "-r", "-X", "../oknef-extension.zip", "."], {
  cwd: out,
});
await mkdir(resolve(root, "public/downloads"), { recursive: true });
await cp(
  resolve(root, "dist/oknef-extension.zip"),
  resolve(root, "public/downloads/oknef-extension.zip"),
);
console.info(
  `Built Oknef ${pkg.version}: dist/unpacked and dist/oknef-extension.zip`,
);

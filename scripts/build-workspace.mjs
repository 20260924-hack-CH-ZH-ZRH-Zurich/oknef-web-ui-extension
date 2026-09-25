import { cp, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import tailwind from "@tailwindcss/postcss";

const interpretedValidation = {
  name: "zod-without-dynamic-code",
  setup(build) {
    build.onLoad(
      { filter: /[\\/]zod[\\/]v4[\\/]core[\\/]util\.js$/ },
      async ({ path }) => {
        const source = await readFile(path, "utf8");
        const probe =
          /export const allowsEval = \/\* @__PURE__\*\/ cached\(\(\) => \{[\s\S]*?\n\}\);/;
        if (!probe.test(source))
          throw new Error("Review required: Zod evaluation probe changed");
        return {
          contents: source.replace(
            probe,
            "export const allowsEval = { value: false };",
          ),
          loader: "js",
        };
      },
    );
  },
};

import postcss from "postcss";

export async function buildWorkspace(root, out, origin) {
  const result = await Bun.build({
    entrypoints: [resolve(root, "src/extension/workspace.tsx")],
    outdir: out,
    target: "browser",
    format: "esm",
    minify: true,
    sourcemap: "none",
    plugins: [interpretedValidation],
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.NEXT_PUBLIC_OKNEF_APP_ORIGIN": JSON.stringify(origin ?? ""),
    },
  });
  if (!result.success) throw new Error(result.logs.map(String).join("\n"));
  const stylesheet = resolve(root, "src/workspace/styles/globals.css");
  const css = await postcss([tailwind({ base: root })]).process(
    await readFile(stylesheet, "utf8"),
    { from: stylesheet },
  );
  await writeFile(resolve(out, "workspace.css"), css.css);
  await cp(
    resolve(root, "src/extension/workspace.html"),
    resolve(out, "workspace.html"),
  );
  await cp(resolve(root, "public/workspace-assets"), out, { recursive: true });
}

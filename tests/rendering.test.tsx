import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MiniApps } from "../src/features/mini-apps/MiniApps";
import { LOCALES, translations } from "../src/lib/translations";

test("four-language preview renders accessible form, cautious disclosure and download", () => {
  for (const locale of LOCALES) {
    const markup = renderToStaticMarkup(
      <MiniApps initialLocale={locale} preview />,
    );
    assert.ok(markup.includes(translations[locale].title));
    assert.ok(markup.includes('id="inspection-input"'));
    assert.ok(markup.includes('aria-pressed="true"'));
    assert.ok(markup.includes("/downloads/oknef-extension.zip"));
    assert.ok(!markup.includes("Use current page URL"));
    assert.ok(!markup.includes("<script"));
  }
});

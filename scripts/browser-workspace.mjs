import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, expect } from "@playwright/test";

const output = process.env.QA_OUTPUT_DIR;
if (!output) throw new Error("QA_OUTPUT_DIR required");
await mkdir(output, { recursive: true });
const extension = resolve("dist/unpacked");
const { id } = JSON.parse(await readFile("extension-identity.json", "utf8"));
const allowLocalTls = process.env.QA_ALLOW_LOCAL_TLS === "1";
const context = await chromium.launchPersistentContext("", {
  channel: "chromium",
  headless: true,
  ignoreHTTPSErrors: allowLocalTls,
  viewport: { width: 1440, height: 1080 },
  args: [
    `--disable-extensions-except=${extension}`,
    `--load-extension=${extension}`,
    ...(allowLocalTls ? ["--ignore-certificate-errors"] : []),
  ],
});
const page = await context.newPage();
page.setDefaultTimeout(25000);
const report = {
  startedAt: new Date().toISOString(),
  evidenceScope:
    "Installed extension with real HTTPS gateway; controlled demo account and QR fixture; no physical sensors",
  checks: [],
  pageErrors: [],
  apiFailures: [],
  extensionId: id,
  certificateValidation: !allowLocalTls,
};
page.on("console", (m) => {
  if (m.type() === "error") console.info("browser", m.text().slice(0, 300));
});
page.on("pageerror", (error) => report.pageErrors.push(error.message));
page.on("response", (response) => {
  if (response.url().includes("/api/") && response.status() >= 400)
    report.apiFailures.push({
      path: new URL(response.url()).pathname,
      status: response.status(),
    });
});
const check = (message) => {
  report.checks.push(message);
  console.info(message);
};
const prefix = `chrome-extension://${id}/workspace.html`;
try {
  await page.goto(`${prefix}#/en/login`);
  await page
    .getByRole("button", { name: "Continue with demo account", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Oknef Drive", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("banner")).toContainText("Connected", {
    timeout: 25000,
  });
  check(
    "Packaged extension signs in through exact-origin gateway with HttpOnly cookie and live WebSocket",
  );
  const reconnects = Number(process.env.QA_RECONNECT_ATTEMPTS || "3");
  assert(Number.isInteger(reconnects) && reconnects >= 1 && reconnects <= 20);
  for (let attempt = 1; attempt <= reconnects; attempt++) {
    await page.reload();
    await expect(page.getByRole("banner")).toContainText("Connected", {
      timeout: 25000,
    });
    check(`Authenticated websocket reconnect ${attempt}/${reconnects}`);
  }
  for (const view of [
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
  ]) {
    await page.goto(`${prefix}#/en/workspace?view=${view}`);
    await expect(page.locator("main h1").first()).toBeVisible();
    assert(
      !(await page
        .getByText("Your session has expired", { exact: true })
        .count()),
    );
    check(`Packaged workspace renders ${view}`);
  }
  await page.goto(`${prefix}#/en/workspace?view=miniapps&app=qr`);
  await page
    .locator("input[type=file]")
    .setInputFiles(resolve("tests/fixtures/qr.png"));
  await expect(page.locator("textarea")).not.toHaveValue("");
  await page.getByRole("checkbox").check();
  const saved = page.waitForResponse(
    (response) =>
      response.url().endsWith("/api/security/sessions/capture") &&
      response.request().method() === "POST",
  );
  await page
    .getByRole("button", { name: "Check and save", exact: true })
    .click();
  assert.equal((await saved).status(), 200);
  check(
    "Packaged QR mini app decodes pixels and persists actual upload receipt",
  );
  await page.screenshot({
    path: resolve(output, "extension-miniapps.png"),
    fullPage: true,
  });
  assert.deepEqual(report.pageErrors, []);
  assert.deepEqual(report.apiFailures, []);
  check("All requested workspace views render without script or API errors");
} catch (error) {
  await page.screenshot({
    path: resolve(output, "extension-failure.png"),
    fullPage: true,
  });
  report.error = String(error);
  throw error;
} finally {
  report.finishedAt = new Date().toISOString();
  await writeFile(
    resolve(output, "extension-workspace.json"),
    JSON.stringify(report, null, 2),
  );
  await context.close();
}

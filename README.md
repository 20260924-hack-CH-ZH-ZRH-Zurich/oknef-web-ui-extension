# Oknef browser extension

A Manifest V3 browser extension with four local mini apps: link inspection, camera/image QR inspection, pasted email review, and call-transcript review. Its complete-workspace navigation opens Drive, asset connections, integrations, identities, sessions, security, legacy, approvals, chat/voice and administration in the trusted web workspace. English, Spanish, German and French are included. The repository also provides a Next.js preview of the same interface. Both builds use Bun and TypeScript; CSS Modules use the shared tokens in `src/styles/globals.css`.

## Prerequisites and setup

Use Bun 1.4.2 and a `zip` command. Development installation requires a Chromium browser with extension developer mode. The packaged extension does not need an API key, account, backend or network connection to run its local checks.

```sh
cp .env.example .env
bun install --frozen-lockfile
```

Keep `.env` local. Configure `NEXT_PUBLIC_OKNEF_APP_ORIGIN` as an HTTPS origin without a path, credentials, query or fragment, or leave it empty to omit the workspace link. This public value is embedded at build time. Selecting **Open Oknef** opens the configured origin with the selected language path; it does not transfer the inspected text or findings.

The remaining example values configure the preview: `PORT`, `HOSTNAME`, `EXTENSION_PREVIEW_PORT`, `EXTENSION_IMAGE_TAG`, `HEALTHCHECK_URL` and `NEXT_TELEMETRY_DISABLED`. If the container port changes, update `HEALTHCHECK_URL` to match. No secret belongs in a `NEXT_PUBLIC_*` variable or Docker build argument.

## Build and install the extension

```sh
bun run build:extension
```

The build writes `dist/unpacked/`, `dist/oknef-extension.zip` and a distribution copy at `public/downloads/oknef-extension.zip`. Its verifier checks Manifest V3, the exact `activeTab` permission, strict packaged-script CSP, absence of remote scripts and source maps, and absence of broad host access or an update endpoint.

1. Open your browser's extensions management page, such as `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode** and choose **Load unpacked**.
3. Select this repository's `dist/unpacked` directory. If starting from the ZIP, extract it first and select the directory containing `manifest.json`.
4. Pin **Oknef mini apps**, open an ordinary web page and click the extension action.
5. Select a mini app, paste content or choose **Use current page URL**, then select **Check now**. The current-page button reads only the URL after your interaction.
6. For QR capture, select **QR destination**, then **Scan with camera** or choose a PNG/JPEG/WebP image up to 4 MB. If browser permission prompts close the toolbar popup, choose **Open extension in a full tab** first. Camera decoding uses packaged jsQR and stops after capture or when the page becomes hidden.
7. Review the captured image, decoded content, local findings and SHA-256 digest. **Download evidence JSON** explicitly saves this sensitive evidence on your device; it is not uploaded.
8. After rebuilding, reload the extension from the extensions management page. Remove it there when finished.

The ZIP is a manual development installation artifact. It is not a signed store release, and there is no self-hosted automatic update channel. Store publication and approval are separate work.

## Build and run the preview

```sh
bun run build
bun run start --hostname 127.0.0.1 --port 3014
```

The preview provides `/`, `/en/`, `/es/`, `/de/`, `/fr/` and `/health`. The production build includes the downloadable extension ZIP. `next start` is convenient for local preview; Next reports that its standalone output is intended for the generated server. The Docker image packages and runs that standalone server directly. `bun run dev` is available for editing, but use the production build for strict-CSP acceptance.

```sh
docker compose up --build -d preview
docker compose ps
docker compose down
```

`docker-compose.yml` is for local development only. It binds the preview to the host loopback interface, passes the public origin as a build argument, and supplies health checks and resource/log limits. Production uses a separate orchestrator and ingress configuration. A standalone container build uses only this repository as its context.

## Checks and operating behavior

```sh
bun run test
bun run typecheck
bun run lint
bun run audit
bun run build:extension
```

`bun run secret-scan` and the optional compose `secret-scan` profile run Gitleaks. Install the local pre-commit configuration with `pre-commit install` when the `pre-commit` tool and Gitleaks are available; the hook rejects detected secrets. Generated output and dependency files should be distinguished from authored-source findings during investigation without suppressing unexplained findings.

Inspection is deterministic local pattern matching. It detects configured URL structure, hidden characters, instruction patterns and social-engineering language. False positives and missed attacks are possible. A result without findings is **Not verified**, never proof that a link, sender, document or caller is authentic. The extension never fetches or opens inspected destinations. Camera and image QR decoding are real local operations. It provides no reputation lookup, mailbox connection, call interception, voice/deepfake classifier, microphone or WebRTC call session inside the popup. The full-workspace buttons open the separately authenticated web app; they do not claim in-popup feature parity. No extension authentication/CORS mechanism is configured, so evidence synchronization is explicitly excluded. The JSON export is untrusted evidence for a later user-directed import and does not establish authenticity.

Pasted text stays in the current window. The last eight checks are kept in memory. QR captures additionally retain the decoded content, a bounded PNG, timestamp, source and SHA-256 digest. Closing the popup, reloading the preview or selecting **Clear all** removes that memory; explicitly downloaded evidence files remain on the device. There is no persistent browsing log or telemetry in the extension. The preview's service worker caches only a static offline notice, not submitted evidence. The installed extension runs offline; the notice explains when the separately hosted preview cannot be loaded.

QR decoder and boundary tests include actual synthetic QR pixels, malformed image rejection, same-origin routes and all four language catalogs. Runtime validation exercised the actual unpacked MV3 package in Chromium with a declared synthetic camera stream, file upload, evidence digest verification, clearing/reloading, zero external requests and no page errors. This is not proof of physical camera optics, store approval or real speaker/deepfake classification.

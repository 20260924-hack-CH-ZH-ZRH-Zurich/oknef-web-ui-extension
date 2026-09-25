"""Copy the reviewed web client into this independently buildable extension.

Only import-reachable source is copied; framework routing and same-origin network
calls are adapted explicitly. No source, code, or assets are fetched at runtime.
"""
from pathlib import Path
import hashlib
import json
import re
import subprocess
import shutil

root = Path(__file__).resolve().parents[1]
source = root.parent / "oknef-web"
destination = root / "src/workspace"
pending = ["src/features/auth/Auth.tsx", "src/features/workspace/Workspace.tsx",
           "src/features/preferences/Preferences.tsx", "src/features/deck/PitchDeck.tsx"]
previous_path = root / "workspace-source-manifest.json"
previous = json.loads(previous_path.read_text()).get("files", {}) if previous_path.exists() else {}
copied = {}
while pending:
    relative = pending.pop()
    if relative in copied:
        continue
    original = source / relative
    content = original.read_text()
    for imported in re.findall(r'(?:from\s+|import\s*)["\']([^"\']+)["\']', content):
        base = source / "src" / imported[2:] if imported.startswith("@/") else original.parent / imported
        if not imported.startswith(("@/", ".")):
            continue
        for candidate in [base, Path(str(base)+".ts"), Path(str(base)+".tsx"), base / "index.ts"]:
            if candidate.is_file():
                pending.append(str(candidate.resolve().relative_to(source)))
                break
    transformed = content.replace('"@/', '"@workspace/')
    transformed = transformed.replace('from "next/navigation"', 'from "@/extension/router"')
    transformed = transformed.replace('import Link from "next/link"', 'import { WorkspaceLink as Link } from "@/extension/router"')
    transformed = transformed.replace('import Image from "next/image"', 'import { WorkspaceImage as Image } from "@/extension/router"')
    if "fetch(" in transformed:
        transformed = 'import { workspaceFetch as fetch } from "@/extension/network";\n' + transformed
    if "window.location.assign(" in transformed:
        transformed = 'import { workspaceNavigate } from "@/extension/router";\n' + transformed.replace("window.location.assign(", "workspaceNavigate(")
    if relative.endswith("Preferences.tsx"):
        transformed = 'import { workspaceLocation } from "@/extension/router";\n' + transformed.replace("window.location.pathname", "workspaceLocation().pathname").replace("window.location.search", "workspaceLocation().search")
    if relative.endswith("useWorkspace.ts"):
        transformed = 'import { WorkspaceSocket as WebSocket } from "@/extension/socket";\nimport { workspaceApiOrigin } from "@/extension/network";\n' + transformed.replace("window.location.origin", "workspaceApiOrigin()")
    # WebAuthn credentials for the HTTPS relying party are used on that party's
    # origin. Extension login retains the ordinary authenticated account flow.
    if relative.endswith("features/auth/Passkeys.tsx"):
        transformed = transformed.replace('typeof PublicKeyCredential !== "undefined"', 'window.location.protocol === "https:" && typeof PublicKeyCredential !== "undefined"')
    target = destination / relative.removeprefix("src/")
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(transformed)
    copied[relative] = {"source_sha256": hashlib.sha256(original.read_bytes()).hexdigest(),
                        "packaged_sha256": hashlib.sha256(target.read_bytes()).hexdigest()}
for relative in set(previous) - set(copied):
    stale = destination / relative.removeprefix("src/")
    if stale.is_file():
        stale.unlink()
styles = source / "src/styles/globals.css"
(destination / "styles").mkdir(parents=True, exist_ok=True)
(destination / "styles/globals.css").write_bytes(styles.read_bytes())
subprocess.run(["bunx", "biome", "check", "--write", "src/workspace"], cwd=root, check=True)
for relative in copied:
    copied[relative]["packaged_sha256"] = hashlib.sha256((destination / relative.removeprefix("src/")).read_bytes()).hexdigest()
assets = {}
for asset in sorted((source / "public").rglob("*")):
    if not asset.is_file():
        continue
    relative = asset.relative_to(source / "public")
    if relative.parts[0] not in ("diagrams", "guides", "deck-assets") and not (len(relative.parts) == 1 and asset.suffix == ".svg"):
        continue
    target = root / "public/workspace-assets" / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(asset, target)
    assets[str(relative)] = hashlib.sha256(asset.read_bytes()).hexdigest()
manifest = {"assets": assets, "source": "oknef-web", "files": copied, "styles_sha256": hashlib.sha256(styles.read_bytes()).hexdigest()}
(root / "workspace-source-manifest.json").write_text(json.dumps(manifest, indent=2)+"\n")
print(f"Copied {len(copied)} reviewed source modules")

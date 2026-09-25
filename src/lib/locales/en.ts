import type { Copy } from "../translations";

export const en: Copy = {
  openWorkspace: "Open full workspace",
  workspaceError:
    "The workspace could not open. Reload the extension and try again.",
  language: "Language",
  eyebrow: "YOUR EVERYDAY SAFETY KIT",
  title: "Pause. Check. Decide.",
  intro:
    "A second look before your next click. Choose a mini app to inspect what someone sent you.",
  local: "Checked on this device",
  apps: {
    url: "Link check",
    qr: "QR destination",
    email: "Email check",
    call: "Call transcript",
  },
  descriptions: {
    url: "Inspect an address before opening it.",
    qr: "Scan with camera or choose a QR image.",
    email: "Look for warning signs in pasted email text.",
    call: "Review a transcript for social engineering.",
  },
  placeholders: {
    url: "Paste a complete web address",
    qr: "Paste the URL decoded from the QR image",
    email: "Paste the email text. Remove passwords and personal details first.",
    call: "Paste a call transcript. Remove private details first.",
  },
  input: "Content to check",
  inspect: "Check now",
  tab: "Use current page URL",
  preview: "Extension preview",
  download: "Download extension ZIP",
  openApp: "Open Oknef",
  appHint: "Opens your Oknef workspace. Your text and results are not sent.",
  clear: "Clear all",
  history: "This window's checks",
  empty: "Your checks will appear here.",
  result: "Why this result?",
  status: {
    blocked: "Do not open yet",
    caution: "Review warning signs",
    unverified: "Not verified",
  },
  findings: {
    invalid_url: "This is not a complete, valid web address.",
    unsafe_scheme:
      "This address uses a non-web scheme. Do not execute or open it.",
    credentials:
      "The address includes sign-in information before the host, which can disguise its destination.",
    private_host:
      "This address points to a local, reserved, literal IP or unsupported host. Verify it independently.",
    unencrypted: "The address uses HTTP without transport encryption.",
    international_domain:
      "The domain uses internationalized characters. Confirm the exact spelling through an independent source.",
    nested_destination:
      "The address contains another destination in its parameters. This may be a redirect.",
    sensitive_parameters:
      "The address includes a parameter that may carry private data. Avoid sharing it.",
    hidden_characters:
      "Invisible or direction-changing characters are present and can disguise text.",
    prompt_injection:
      "The text contains an instruction pattern that could try to redirect an AI. It was treated as data.",
    urgency: "Urgent language can pressure you to skip verification.",
    secret_request:
      "The text mentions passwords, verification codes or recovery secrets. Never share those in response to a request.",
    payment:
      "The text mentions a transfer, crypto or gift card. Confirm payment requests through an independent channel.",
    remote_access:
      "The text mentions remote access or installing software. Verify the request before granting access.",
  },
  noSignals:
    "No configured warning patterns matched. This does not establish safety or authenticity.",
  next: "Contact the person or provider through a number or website you already trust.",
  disclaimer:
    "Local pattern checks with QR camera capture. No reputation lookup, sender authentication, call interception or voice/deepfake classifier. Findings are prompts for review, not proof of fraud.",
  retention:
    "Text and QR evidence stay in this window and disappear when cleared, closed or reloaded. Downloaded evidence files remain on your device.",
  invalidInput: "Enter content between 1 and 12,000 characters.",
  tabError:
    "This page URL is unavailable. Copy a web address into the field instead.",
  links: "Links inspected",
  check: "Check",
  view: "Review",
  appUnavailable: "Workspace link is not configured in this build.",
};

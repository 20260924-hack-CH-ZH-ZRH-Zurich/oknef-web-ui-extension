export const MINI_APPS = ["url", "qr", "email", "call"] as const;
export type MiniApp = (typeof MINI_APPS)[number];
export const MAX_INPUT_LENGTH = 12_000;
export const MAX_HISTORY = 8;
export type FindingCode =
  | "invalid_url"
  | "unsafe_scheme"
  | "credentials"
  | "private_host"
  | "unencrypted"
  | "international_domain"
  | "nested_destination"
  | "sensitive_parameters"
  | "hidden_characters"
  | "prompt_injection"
  | "urgency"
  | "secret_request"
  | "payment"
  | "remote_access";
export type Finding = { code: FindingCode; severity: "blocked" | "caution" };
export type Inspection = {
  app: MiniApp;
  status: "blocked" | "caution" | "unverified";
  findings: Finding[];
  linkCount: number;
};

const TEXT_SIGNALS: [FindingCode, RegExp][] = [
  [
    "prompt_injection",
    /ignore\s+(all\s+)?(previous|prior)\s+(instructions|context)|system\s*prompt|ignora\s+(las\s+)?instrucciones|ignoriere\s+.*anweisungen|ignore[rz]?\s+.*instructions/i,
  ],
  [
    "urgency",
    /urgent|immediately|act now|urgente|inmediatamente|sofort|dringend|immédiatement|tout de suite/i,
  ],
  [
    "secret_request",
    /password|one.time (code|password)|verification code|otp\b|seed phrase|contrase[ñn]a|c[oó]digo de verificaci[oó]n|passwort|bestätigungscode|mot de passe|code de v[ée]rification/i,
  ],
  [
    "payment",
    /wire transfer|transfer money|gift card|crypto(currency)?|transferencia|tarjeta regalo|überweisung|gutschein|virement|carte.cadeau/i,
  ],
  [
    "remote_access",
    /remote (access|control)|install.*(software|app)|acceso remoto|fernzugriff|acc[èe]s [àa] distance/i,
  ],
];

function add(
  findings: Finding[],
  code: FindingCode,
  severity: Finding["severity"] = "caution",
) {
  if (!findings.some((finding) => finding.code === code))
    findings.push({ code, severity });
}

function urlSignals(value: string, findings: Finding[]) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    add(findings, "invalid_url", "blocked");
    return;
  }
  if (!["http:", "https:"].includes(url.protocol)) {
    add(findings, "unsafe_scheme", "blocked");
    return;
  }
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (url.username || url.password) add(findings, "credentials", "blocked");
  if (
    !host.includes(".") ||
    host.includes(":") ||
    /^\d+(\.\d+){3}$/.test(host) ||
    /\.(localhost|local|internal|test|invalid)$/.test(host)
  )
    add(findings, "private_host", "blocked");
  if (url.protocol === "http:") add(findings, "unencrypted");
  if (host.includes("xn--")) add(findings, "international_domain");
  for (const [key, parameter] of url.searchParams) {
    if (/token|password|secret|otp|session|api.?key|auth|email/i.test(key))
      add(findings, "sensitive_parameters");
    if (/^(https?:)?\/\//i.test(parameter)) add(findings, "nested_destination");
  }
}

export function inspect(app: unknown, value: unknown): Inspection {
  if (
    !MINI_APPS.includes(app as MiniApp) ||
    typeof value !== "string" ||
    !value.trim() ||
    value.length > MAX_INPUT_LENGTH
  )
    throw new Error("invalid_input");
  const selectedApp = app as MiniApp;
  const text = value.trim();
  const findings: Finding[] = [];
  if (/[\u200B-\u200F\u202A-\u202E\u2060-\u2069]/.test(text))
    add(findings, "hidden_characters", "blocked");
  for (const [code, pattern] of TEXT_SIGNALS)
    if (pattern.test(text)) add(findings, code);
  const urls =
    selectedApp === "url" || selectedApp === "qr"
      ? [text]
      : (text.match(/https?:\/\/[^\s<>"']+/gi) ?? []);
  for (const url of urls) urlSignals(url, findings);
  const status = findings.some((finding) => finding.severity === "blocked")
    ? "blocked"
    : findings.length
      ? "caution"
      : "unverified";
  return { app: selectedApp, status, findings, linkCount: urls.length };
}

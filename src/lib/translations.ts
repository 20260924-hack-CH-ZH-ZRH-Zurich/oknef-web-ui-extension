import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import type { FindingCode, MiniApp } from "./models/inspection";

export const LOCALES = ["en", "es", "de", "fr"] as const;
export type Locale = (typeof LOCALES)[number];
export type Copy = {
  language: string;
  eyebrow: string;
  title: string;
  intro: string;
  local: string;
  apps: Record<MiniApp, string>;
  descriptions: Record<MiniApp, string>;
  placeholders: Record<MiniApp, string>;
  input: string;
  inspect: string;
  tab: string;
  preview: string;
  download: string;
  openApp: string;
  openWorkspace: string;
  workspaceError: string;
  appHint: string;
  clear: string;
  history: string;
  empty: string;
  result: string;
  status: Record<"blocked" | "caution" | "unverified", string>;
  findings: Record<FindingCode, string>;
  noSignals: string;
  next: string;
  disclaimer: string;
  retention: string;
  invalidInput: string;
  tabError: string;
  links: string;
  check: string;
  view: string;
  appUnavailable: string;
};

export const translations: Record<Locale, Copy> = { en, es, de, fr };
export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

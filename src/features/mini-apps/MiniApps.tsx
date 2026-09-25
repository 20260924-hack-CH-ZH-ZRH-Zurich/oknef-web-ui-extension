"use client";

import { useEffect, useState } from "react";
import {
  canExpandExtension,
  canReadActiveTab,
  openWorkspace,
} from "@/lib/browser";
import { config } from "@/lib/config";
import { MAX_INPUT_LENGTH, MINI_APPS } from "@/lib/models/inspection";
import {
  isLocale,
  LOCALES,
  type Locale,
  translations,
} from "@/lib/translations";
import { InspectionResult } from "./InspectionResult";
import styles from "./MiniAppsStyles.module.css";
import { QrCapture } from "./QrCapture";
import { QrEvidenceView } from "./QrEvidenceView";
import { useInspection } from "./useInspection";
import { WorkspaceLinks } from "./WorkspaceLinks";

type State = ReturnType<typeof useInspection>;
type ViewProps = { state: State; locale: Locale };
const SYMBOLS = { url: "↗", qr: "▦", email: "✉", call: "≋" };

function Header({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  const copy = translations[locale];
  return (
    <header className={styles.header}>
      <div className={styles.wordmark}>
        <span aria-hidden="true">◈</span> oknef{" "}
        <span className={styles.wordmarkDetail}>mini apps</span>
      </div>
      <label className={styles.language}>
        {copy.language}
        <select
          value={locale}
          onChange={(event) => {
            if (isLocale(event.target.value)) setLocale(event.target.value);
          }}
        >
          {LOCALES.map((language) => (
            <option key={language} value={language}>
              {language.toUpperCase()}
            </option>
          ))}
        </select>
      </label>
    </header>
  );
}

function MiniAppPicker({ state, locale }: ViewProps) {
  const copy = translations[locale];
  return (
    <section className={styles.apps} aria-label={copy.input}>
      {MINI_APPS.map((app) => (
        <button
          key={app}
          type="button"
          aria-pressed={state.app === app}
          className={`${styles.app} ${state.app === app ? styles.selected : ""}`}
          onClick={() => state.selectApp(app)}
        >
          <span className={styles.appSymbol} aria-hidden="true">
            {SYMBOLS[app]}
          </span>
          <strong>{copy.apps[app]}</strong>
          <span>{copy.descriptions[app]}</span>
        </button>
      ))}
    </section>
  );
}

function Inspector({ state, locale }: ViewProps) {
  const copy = translations[locale];
  return (
    <form
      className={styles.inspector}
      onSubmit={(event) => {
        event.preventDefault();
        state.check();
      }}
    >
      <div className={styles.row}>
        <label htmlFor="inspection-input">{copy.input}</label>
        {canReadActiveTab() && (
          <button
            className={styles.textButton}
            type="button"
            onClick={state.currentTab}
          >
            {copy.tab}
          </button>
        )}
      </div>
      <textarea
        id="inspection-input"
        value={state.input}
        onChange={(event) => state.setInput(event.target.value)}
        placeholder={copy.placeholders[state.app]}
        maxLength={MAX_INPUT_LENGTH}
        rows={5}
        spellCheck={false}
        autoComplete="off"
        aria-describedby="retention input-error"
      />
      <div className={styles.row}>
        <span className={styles.caption}>
          {state.input.length.toLocaleString(locale)} /{" "}
          {MAX_INPUT_LENGTH.toLocaleString(locale)}
        </span>
        <button
          className={styles.primary}
          type="submit"
          disabled={!state.input.trim()}
        >
          {copy.inspect} <span aria-hidden="true">→</span>
        </button>
      </div>
      <p id="input-error" className={styles.error} role="alert">
        {state.error ? copy[state.error] : ""}
      </p>
    </form>
  );
}

function History({ state, locale }: ViewProps) {
  const copy = translations[locale];
  return (
    <section className={styles.history}>
      <div className={styles.row}>
        <h2>{copy.history}</h2>
        <button
          type="button"
          className={styles.textButton}
          onClick={state.clear}
        >
          {copy.clear}
        </button>
      </div>
      {!state.sessions.length && <p className={styles.caption}>{copy.empty}</p>}
      <ol>
        {state.sessions.map((session, index) => (
          <li key={session.id}>
            <span>
              <strong>{copy.apps[session.app]}</strong>
              <span className={styles.caption}>
                {" "}
                {copy.status[session.status]}
              </span>
            </span>
            <button
              type="button"
              className={styles.textButton}
              aria-label={`${copy.view} ${copy.check} ${state.sessions.length - index}`}
              onClick={() => state.setResult(session)}
            >
              {copy.view}
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Footer({ locale, preview }: { locale: Locale; preview: boolean }) {
  const copy = translations[locale];
  return (
    <footer className={styles.footer}>
      <p id="retention">{copy.retention}</p>
      <p>{copy.disclaimer}</p>
      {config.appOrigin ? (
        <>
          <a
            className={styles.appLink}
            href={`${config.appOrigin}/${locale}/`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.openApp} ↗
          </a>
          <p>{copy.appHint}</p>
        </>
      ) : (
        <p>{copy.appUnavailable}</p>
      )}
      {preview && (
        <a
          className={styles.appLink}
          href="/downloads/oknef-extension.zip"
          download
        >
          {copy.download} ↓
        </a>
      )}
    </footer>
  );
}

export function MiniApps({
  initialLocale = "en",
  preview = false,
}: {
  initialLocale?: Locale;
  preview?: boolean;
}) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const state = useInspection();
  const [launchError, setLaunchError] = useState(false);
  const copy = translations[locale];
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("app") === "qr")
      state.selectApp("qr");
  }, [state.selectApp]);
  return (
    <main className={styles.shell}>
      <Header locale={locale} setLocale={setLocale} />
      {canExpandExtension() && (
        <button
          type="button"
          className={styles.primary}
          onClick={() => {
            void openWorkspace(locale).catch(() => setLaunchError(true));
          }}
        >
          {copy.openWorkspace} ↗
        </button>
      )}
      {launchError && (
        <p role="alert" className={styles.error}>
          {copy.workspaceError}
        </p>
      )}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>
          {preview ? copy.preview : copy.eyebrow}
        </p>
        <h1>{copy.title}</h1>
        <p>{copy.intro}</p>
        <span className={styles.local}>
          <span aria-hidden="true">●</span> {copy.local}
        </span>
      </section>
      <MiniAppPicker state={state} locale={locale} />
      {state.app === "qr" && (
        <QrCapture
          key={state.captureGeneration}
          locale={locale}
          onCapture={state.capture}
        />
      )}
      <Inspector state={state} locale={locale} />
      {state.result && <InspectionResult result={state.result} copy={copy} />}
      {state.result && (
        <QrEvidenceView session={state.result} locale={locale} />
      )}
      <History state={state} locale={locale} />
      <WorkspaceLinks locale={locale} />
      <Footer locale={locale} preview={preview} />
    </main>
  );
}
